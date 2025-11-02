// components/PackedScatterGrid.tsx
import React, { useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";

/**
 * PackedScatterGrid
 * -----------------
 * A layout engine for absolutely-positioned rectangles (posters).
 *
 * Features:
 *  - Two layout algorithms:
 *      • "spiral": greedy spiral with collision checks (nice organic clustering)
 *      • "rings": concentric ring packer with O(n) performance (great for large n)
 *    Use layoutMode="auto" to switch to rings when items >= ringThreshold (default 80).
 *
 *  - Deterministic placement (no randomness) with strong "big center / small outer" bias.
 *  - Viewport virtualization: render only nodes intersecting the current visibleRect (plus overscan).
 *
 * Coordinates:
 *  - This component returns a content box at (0,0) of size (contentW x contentH).
 *  - Parent (e.g., PanBoard) can pan this box; pass back content size via onContentSize.
 */

export type ScatterItem = { id: string | number; width: number; height: number };

type PlacedNode = { id: string | number; left: number; top: number; width: number; height: number };

export type LayoutMode = "auto" | "spiral" | "rings";

type Props = {
  items: ScatterItem[];

  /** Minimum gap between posters (both for collision and ring spacing) */
  spacing?: number;

  /** Spiral only: lower = tighter packing; higher = looser rings */
  compactness?: number;

  /** Extra pixels around the cluster so it doesn't touch the edge visually */
  padding?: number;

  /** Choose algorithm: "auto" (default), "spiral", or "rings" */
  layoutMode?: LayoutMode;

  /** If layoutMode="auto", switch to rings at this many items (default 80) */
  ringThreshold?: number;

  /** Optional viewport rectangle (canvas coordinates) to virtualize rendering */
  visibleRect?: { x: number; y: number; w: number; h: number };

  /** Extra pixels beyond visibleRect to render for smooth panning */
  overscan?: number;

  /** Callback whenever content size changes */
  onContentSize?: (w: number, h: number) => void;

  /** Render your rectangle by id/size; position is handled here */
  renderItem: (it: ScatterItem) => React.ReactNode;
};

const TAU = Math.PI * 2;
const GOLDEN_ANGLE = TAU * (1 - 1 / 1.61803398875);

/** AABB overlap test */
const intersects = (
  a: { l: number; t: number; r: number; b: number },
  b: { l: number; t: number; r: number; b: number }
) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;

/** Expand rectangles by spacing to keep gaps */
function rectsOverlap(a: PlacedNode, b: PlacedNode, spacing: number) {
  const L1 = a.left - spacing, T1 = a.top - spacing;
  const R1 = a.left + a.width + spacing, B1 = a.top + a.height + spacing;
  const L2 = b.left - spacing, T2 = b.top - spacing;
  const R2 = b.left + b.width + spacing, B2 = b.top + b.height + spacing;
  return L1 < R2 && R1 > L2 && T1 < B2 && B1 > T2;
}

/** ------------------------------ Spiral layout ------------------------------ */
/**
 * Size-aware deterministic spiral:
 *  - Rank by area (largest first) -> strong central bias.
 *  - Nonlinear size score + hard inner "core" gate prevents very small posters from entering.
 *  - Greedy search along rings using a neighbor grid to avoid O(n^2) collision checks.
 */
function computeLayoutSpiral(
  items: ScatterItem[],
  spacing: number,
  compactness: number,
  padding: number
): { placed: PlacedNode[]; contentW: number; contentH: number; minX: number; minY: number } {
  if (!items.length) return { placed: [], contentW: 0, contentH: 0, minX: 0, minY: 0 };

  // Neighbor grid to accelerate collision checks
  const minW = Math.max(1, Math.min(...items.map((d) => d.width)));
  const minH = Math.max(1, Math.min(...items.map((d) => d.height)));
  const cellSize = Math.max(32, Math.floor(Math.min(minW, minH) + spacing * 0.6));
  const key = (gx: number, gy: number) => `${gx},${gy}`;
  const toCell = (x: number) => Math.floor(x / cellSize);

  const grid = new Map<string, number[]>();
  const placed: PlacedNode[] = [];

  const addToGrid = (idx: number, r: PlacedNode) => {
    const gx0 = toCell(r.left), gy0 = toCell(r.top);
    const gx1 = toCell(r.left + r.width), gy1 = toCell(r.top + r.height);
    for (let gx = gx0; gx <= gx1; gx++) {
      for (let gy = gy0; gy <= gy1; gy++) {
        const k = key(gx, gy);
        const arr = grid.get(k);
        arr ? arr.push(idx) : grid.set(k, [idx]);
      }
    }
  };

  const neighbors = (r: PlacedNode) => {
    const gx0 = toCell(r.left - spacing), gy0 = toCell(r.top - spacing);
    const gx1 = toCell(r.left + r.width + spacing), gy1 = toCell(r.top + r.height + spacing);
    const out: number[] = [];
    const seen = new Set<number>();
    for (let gx = gx0; gx <= gx1; gx++) {
      for (let gy = gy0; gy <= gy1; gy++) {
        const arr = grid.get(key(gx, gy));
        if (!arr) continue;
        for (const id of arr) if (!seen.has(id)) { seen.add(id); out.push(id); }
      }
    }
    return out;
  };

  // Rank items by area (largest -> smallest)
  const areas = items.map((it) => it.width * it.height);
  const sortedIdx = [...areas.keys()].sort((i, j) => areas[j] - areas[i]);
  const rankByIndex = new Map<number, number>();
  sortedIdx.forEach((idx, rank) => rankByIndex.set(idx, rank));

  const n = items.length;

  // Estimate overall cluster radius from total padded area
  const paddedAreas = items.map((it) => (it.width + spacing) * (it.height + spacing));
  const totalPadded = paddedAreas.reduce((a, b) => a + b, 0);
  const packEff = 0.62; // empirical packing efficiency for our greedy spiral
  const R_est = Math.sqrt(totalPadded / (Math.PI * packEff));

  const baseRingStep = Math.max(spacing, Math.round(Math.min(minW, minH) * compactness));

  // Hard "core" where only big enough items may enter
  const coreRadius = R_est * 0.35;
  const coreGate = 0.6; // require sizeScore >= coreGate to enter the core

  // Outer bias: where the smallest items begin
  const outerBias = R_est;

  const gamma = 2; // nonlinear emphasis (2–3 pushes mediums out harder)
  const maxRings = 1000;

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const rank = rankByIndex.get(i)!; // 0 (largest) .. n-1 (smallest)
    const percentile = 1 - rank / Math.max(1, n - 1); // largest≈1, smallest≈0
    const sizeScore = Math.pow(percentile, gamma);

    // Start radius by size (small further out) and enforce a big-only core
    const rBySize = (1 - sizeScore) * outerBias;
    const mustStayOutsideCore = sizeScore < coreGate;
    let radius = Math.max(rBySize, mustStayOutsideCore ? coreRadius : 0);

    // Small items step outward faster
    const ringStep = baseRingStep * (1 + (1 - sizeScore));

    // Deterministic angular staggering (no randomness)
    let startAngle = (i * GOLDEN_ANGLE) % TAU;
    let chosen: PlacedNode | null = null;

    for (let ring = 0; ring < maxRings && !chosen; ring++) {
      const circumference = Math.max(1, TAU * Math.max(1, radius));
      const approxStep = Math.max(spacing, it.width * 0.6);
      const nAngles = Math.max(12, Math.min(96, Math.ceil(circumference / approxStep)));
      const deltaAngle = TAU / nAngles;

      let angle = startAngle;
      for (let t = 0; t < nAngles; t++) {
        const cx = radius * Math.cos(angle);
        const cy = radius * Math.sin(angle);

        const candidate: PlacedNode = {
          id: it.id,
          left: Math.round(cx - it.width / 2),
          top: Math.round(cy - it.height / 2),
          width: it.width,
          height: it.height,
        };

        // collision check only with nearby neighbors
        const neigh = neighbors(candidate);
        let hit = false;
        for (let k = 0; k < neigh.length; k++) {
          if (rectsOverlap(candidate, placed[neigh[k]], spacing)) { hit = true; break; }
        }
        if (!hit) { chosen = candidate; break; }
        angle += deltaAngle;
      }

      if (!chosen) {
        radius += ringStep;
        startAngle += deltaAngle * 0.37; // walk the arc deterministically
      }
    }

    if (!chosen) {
      // Fallback: drop at last radius on +X axis
      chosen = { id: it.id, left: Math.round(radius), top: 0, width: it.width, height: it.height };
    }

    const idx = placed.push(chosen) - 1;
    // update neighbor grid
    const toCell = (x: number) => Math.floor(x / cellSize); // re-declare for closure correctness
    const gx0 = toCell(chosen.left), gy0 = toCell(chosen.top);
    const gx1 = toCell(chosen.left + chosen.width), gy1 = toCell(chosen.top + chosen.height);
    for (let gx = gx0; gx <= gx1; gx++) {
      for (let gy = gy0; gy <= gy1; gy++) {
        const k = `${gx},${gy}`;
        const arr = grid.get(k);
        arr ? arr.push(idx) : grid.set(k, [idx]);
      }
    }
  }

  // Bounds
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const nnode of placed) {
    minX = Math.min(minX, nnode.left);
    minY = Math.min(minY, nnode.top);
    maxX = Math.max(maxX, nnode.left + nnode.width);
    maxY = Math.max(maxY, nnode.top + nnode.height);
  }
  const contentW = Math.ceil(maxX - minX + padding * 2);
  const contentH = Math.ceil(maxY - minY + padding * 2);

  return { placed, contentW, contentH, minX, minY };
}

/** ------------------------------- Ring layout ------------------------------- */
/**
 * Concentric rings packer:
 *  - Sort by area (biggest first). First item centered.
 *  - Place remaining items around rings by arc length (width + spacing).
 *  - When a ring runs out of angle (2π), start a new ring separated by tallest item in the ring.
 *  - No collision checks => O(n). Great for 100s+ items.
 */
function computeLayoutRings(
  items: ScatterItem[],
  spacing: number,
  padding: number
): { placed: PlacedNode[]; contentW: number; contentH: number; minX: number; minY: number } {
  if (!items.length) return { placed: [], contentW: 0, contentH: 0, minX: 0, minY: 0 };

  // sort biggest first so center and early rings look dense
  const sorted = [...items].sort((a, b) => b.width * b.height - a.width * a.height);

  const placed: PlacedNode[] = [];

  // place first at center
  const first = sorted[0];
  placed.push({
    id: first.id,
    left: -Math.round(first.width / 2),
    top: -Math.round(first.height / 2),
    width: first.width,
    height: first.height,
  });

  // ring bookkeeping
  const minH = Math.max(1, Math.min(...sorted.map((d) => d.height)));
  let r = Math.max(first.height, minH) + spacing; // radius of current ring
  let angle = 0;                                  // current angle along ring
  let ringMaxH = 0;                                // tallest item in current ring

  for (let i = 1; i < sorted.length; i++) {
    const it = sorted[i];

    // ensure ring radius is large enough to host at least one item "comfortably"
    let angleNeeded = (it.width + spacing) / Math.max(1, r);

    // if this item would almost consume the whole ring, push to the next ring
    while (angleNeeded > Math.PI * 0.8) {
      r += Math.max(ringMaxH, it.height) + spacing;
      angle = 0;
      ringMaxH = 0;
      angleNeeded = (it.width + spacing) / Math.max(1, r);
    }

    // wrap to next ring if not enough angular room remains
    if (angle + angleNeeded > TAU) {
      r += ringMaxH + spacing;
      angle = 0;
      ringMaxH = 0;
      angleNeeded = (it.width + spacing) / Math.max(1, r);
    }

    // place at angle + half-span
    const theta = angle + angleNeeded / 2;
    const cx = r * Math.cos(theta);
    const cy = r * Math.sin(theta);

    placed.push({
      id: it.id,
      left: Math.round(cx - it.width / 2),
      top: Math.round(cy - it.height / 2),
      width: it.width,
      height: it.height,
    });

    angle += angleNeeded;
    ringMaxH = Math.max(ringMaxH, it.height);
  }

  // Bounds
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of placed) {
    minX = Math.min(minX, n.left);
    minY = Math.min(minY, n.top);
    maxX = Math.max(maxX, n.left + n.width);
    maxY = Math.max(maxY, n.top + n.height);
  }
  const contentW = Math.ceil(maxX - minX + padding * 2);
  const contentH = Math.ceil(maxY - minY + padding * 2);

  return { placed, contentW, contentH, minX, minY };
}

/** ------------------------------- Component -------------------------------- */
export default function PackedScatterGrid({
  items,
  spacing = 12,
  compactness = 0.25,
  padding = 0,
  layoutMode = "auto",
  ringThreshold = 80,
  visibleRect,
  overscan = 160,
  onContentSize,
  renderItem,
}: Props) {
  // choose algorithm
  const useRings = layoutMode === "rings" || (layoutMode === "auto" && items.length >= ringThreshold);

  const layout = useMemo(() => {
    if (useRings) {
      return computeLayoutRings(items, spacing, padding);
    }
    return computeLayoutSpiral(items, spacing, compactness, padding);
  }, [useRings, items, spacing, compactness, padding]);

  // Let parent (PanBoard) know our content box size so it can size the canvas
  useEffect(() => {
    onContentSize?.(layout.contentW, layout.contentH);
  }, [layout.contentW, layout.contentH, onContentSize]);

  // Shift children so minX/minY land at "padding"
  const offsetX = Math.round(padding - layout.minX);
  const offsetY = Math.round(padding - layout.minY);

  // Virtualize: only render nodes intersecting the (overscanned) viewport
  let nodesToRender = layout.placed;
  if (visibleRect) {
    const vr = {
      l: visibleRect.x - overscan,
      t: visibleRect.y - overscan,
      r: visibleRect.x + visibleRect.w + overscan,
      b: visibleRect.y + visibleRect.h + overscan,
    };
    nodesToRender = layout.placed.filter((n) =>
      intersects(
        {
          l: n.left + offsetX,
          t: n.top + offsetY,
          r: n.left + offsetX + n.width,
          b: n.top + offsetY + n.height,
        },
        vr
      )
    );
  }

  return (
    <View style={{ width: layout.contentW, height: layout.contentH }}>
      {nodesToRender.map((n) => (
        <View
          key={n.id}
          style={[
            styles.absoluteNode,
            { left: n.left + offsetX, top: n.top + offsetY, width: n.width, height: n.height },
          ]}
        >
          {renderItem({ id: n.id, width: n.width, height: n.height })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteNode: { position: "absolute", overflow: "hidden", borderRadius: 0 },
});
