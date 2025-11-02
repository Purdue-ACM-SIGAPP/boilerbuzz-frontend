// components/PackedScatterGrid.tsx
import React, { useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";

/**
 * PackedScatterGrid:
 * The layout for a set of posters/rectangles
 * Computes absolute positions to avoid overlaps (spiral + neighbor grid).
 * Renders the posters at those positions.
 */

export type ScatterItem = { id: string; width: number; height: number };

type PlacedNode = { id: string; left: number; top: number; width: number; height: number };

type Props = {
  items: ScatterItem[];
  /** Minimum gap between posters */
  spacing?: number;
  /** Lower = tighter packing, Higher = looser rings */
  compactness?: number;
  /** Extra pixels around the cluster so it doesn't touch the edge visually */
  padding?: number;
  /** Callback whenever content size changes */
  onContentSize?: (w: number, h: number) => void;
  /** Render your rectangle by id/size; position is handled by this component's wrapper View */
  renderItem: (it: ScatterItem) => React.ReactNode;
};

const TAU = Math.PI * 2;
const GOLDEN_ANGLE = TAU * (1 - 1 / 1.61803398875);


function rectsOverlap(a: PlacedNode, b: PlacedNode, spacing: number) {
  // Expand boxes by spacing so we keep a gap.
  const L1 = a.left - spacing;
  const T1 = a.top - spacing;
  const R1 = a.left + a.width + spacing;
  const B1 = a.top + a.height + spacing;

  const L2 = b.left - spacing;
  const T2 = b.top - spacing;
  const R2 = b.left + b.width + spacing;
  const B2 = b.top + b.height + spacing;

  return L1 < R2 && R1 > L2 && T1 < B2 && B1 > T2;
}

export default function PackedScatterGrid({
  items,
  spacing = 12,
  compactness = 0.25,
  padding = 0,
  onContentSize,
  renderItem,
}: Props) {
const layout = useMemo(() => {
  if (!items.length) {
    return { placed: [] as PlacedNode[], contentW: 0, contentH: 0, minX: 0, minY: 0 };
  }

  // --- Neighbor grid to accelerate collision checks ---
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
        for (const id of arr) {
          if (!seen.has(id)) { seen.add(id); out.push(id); }
        }
      }
    }
    return out;
  };

  // --- Size-aware spiral placement (deterministic, no randomness) ---

  // Normalize areas to [0,1] so we can bias radius/step by size
  const areas = items.map(it => it.width * it.height);
  const minA = Math.min(...areas);
  const maxA = Math.max(...areas) || 1;

  // This changes how far small items can be placed from the center
  // Smaller bias means small items can near the center
  // Larger bias means small items are farther from the center
  const outerBias = 800; 
  
  const baseRingStep = Math.max(spacing, Math.round(Math.min(minW, minH) * compactness));
  const maxRings = 1000;

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const area = it.width * it.height;
    // sizeScore: small≈0, big≈1
    const sizeScore = (area - minA) / (maxA - minA || 1);

    // Big items start closer to center; small items start further out.
    let radius = (1 - sizeScore) * outerBias;

    // Small items step outward faster, so they drift to the periphery more decisively.
    const ringStep = baseRingStep * (1 + (1 - sizeScore)); // big≈1x, small≈2x

    // Deterministic angular staggering (no randomness).
    let startAngle = (i * GOLDEN_ANGLE) % TAU;
    let chosen: PlacedNode | null = null;

    for (let ring = 0; ring < maxRings && !chosen; ring++) {
      const circumference = Math.max(1, TAU * Math.max(1, radius));
      const approxStep = Math.max(spacing, it.width * 0.6);
      const nAngles = Math.max(12, Math.min(96, Math.ceil(circumference / approxStep)));
      const deltaAngle = TAU / nAngles;

      let angle = startAngle; // no jitter
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

        const neigh = neighbors(candidate);
        let hit = false;
        for (let k = 0; k < neigh.length; k++) {
          if (rectsOverlap(candidate, placed[neigh[k]], spacing)) { hit = true; break; }
        }
        if (!hit) { chosen = candidate; break; }
        angle += deltaAngle;
      }

      if (!chosen) {
        radius += ringStep;                 // use size-aware step
        startAngle += deltaAngle * 0.37;    // keep scanning different arcs deterministically
      }
    }

    if (!chosen) {
      // Fallback: drop at the last radius along +X axis.
      chosen = { id: it.id, left: Math.round(radius), top: 0, width: it.width, height: it.height };
    }

    const idx = placed.push(chosen) - 1;
    addToGrid(idx, chosen);
  }

  // --- Compute bounds of all placed nodes ---
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of placed) {
    minX = Math.min(minX, n.left);
    minY = Math.min(minY, n.top);
    maxX = Math.max(maxX, n.left + n.width);
    maxY = Math.max(maxY, n.top + n.height);
  }

  const contentW = Math.ceil((maxX - minX) + padding * 2);
  const contentH = Math.ceil((maxY - minY) + padding * 2);

  return { placed, contentW, contentH, minX, minY };
}, [items, spacing, compactness, padding]); // <-- removed `seed`


  // Notify parent about size so it can size its panning canvas.
  useEffect(() => {
    if (!onContentSize) return;
    onContentSize(layout.contentW, layout.contentH);
  }, [layout.contentW, layout.contentH, onContentSize]);

  // Shift all children so the minX/minY land at padding.
  const offsetX = Math.round(padding - layout.minX);
  const offsetY = Math.round(padding - layout.minY);

  return (
    <View style={{ width: layout.contentW, height: layout.contentH }}>
      {layout.placed.map((n) => (
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
