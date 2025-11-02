// components/PackedScatterGrid.tsx
import React, { useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";

/**
 * PackedScatterGrid:
 *  - Pure layout engine for a set of rectangles.
 *  - Computes absolute positions to avoid overlaps (spiral + neighbor grid).
 *  - Renders children at those positions.
 *  - Reports total content size via onContentSize so a parent (e.g., PanBoard) can size a canvas.
 *
 *  NOTE: This component does NOT know about panning or any outer board/canvas.
 */

export type ScatterItem = { id: string; width: number; height: number };

type PlacedNode = { id: string; left: number; top: number; width: number; height: number };

type Props = {
  items: ScatterItem[];
  /** Minimum gap between rectangles */
  spacing?: number;
  /** Lower = tighter packing, Higher = looser rings */
  compactness?: number;
  /** Seed for deterministic layout */
  seed?: number;
  /** Extra pixels around the cluster so it doesn't touch the edge visually */
  padding?: number;
  /** Callback whenever content size changes */
  onContentSize?: (w: number, h: number) => void;
  /** Render your rectangle by id/size; position is handled by this component's wrapper View */
  renderItem: (it: ScatterItem) => React.ReactNode;
};

const TAU = Math.PI * 2;
const GOLDEN_ANGLE = TAU * (1 - 1 / 1.61803398875);

function prng(seed = 1) {
  let s = seed >>> 0 || 1;
  return () => ((s = (1664525 * s + 1013904223) >>> 0) / 0xffffffff);
}

function rectsOverlap(a: PlacedNode, b: PlacedNode, spacing: number) {
  // Expand bboxes by spacing so we keep a gap.
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
  seed = 42,
  padding = 0,
  onContentSize,
  renderItem,
}: Props) {
  const layout = useMemo(() => {
    if (!items.length) {
      return { placed: [] as PlacedNode[], contentW: 0, contentH: 0, minX: 0, minY: 0 };
    }

    /** --- Neighbor grid to accelerate collision checks (only nearby rectangles) --- */
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
            if (!seen.has(id)) {
              seen.add(id);
              out.push(id);
            }
          }
        }
      }
      return out;
    };

    /** --- Spiral placement: try angles around an expanding radius until a non-overlapping slot is found --- */
    const rnd = prng(seed);
    const baseRingStep = Math.max(spacing, Math.round(Math.min(minW, minH) * compactness));
    const maxRings = 1000;

    for (let i = 0; i < items.length; i++) {
      const it = items[i];

      let radius = 0; // start at center
      let startAngle = (i * GOLDEN_ANGLE) % TAU; // stagger starts to fill gaps
      let chosen: PlacedNode | null = null;

      for (let ring = 0; ring < maxRings && !chosen; ring++) {
        const circumference = Math.max(1, TAU * Math.max(1, radius));
        const approxStep = Math.max(spacing, it.width * 0.6);
        const nAngles = Math.max(12, Math.min(96, Math.ceil(circumference / approxStep)));
        const deltaAngle = TAU / nAngles;

        let angle = startAngle + (rnd() - 0.5) * 0.2; // slight jitter to avoid rigid aliasing
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

          // Only check potential overlaps against nearby rects
          const neigh = neighbors(candidate);
          let hit = false;
          for (let k = 0; k < neigh.length; k++) {
            if (rectsOverlap(candidate, placed[neigh[k]], spacing)) {
              hit = true;
              break;
            }
          }
          if (!hit) {
            chosen = candidate;
            break;
          }
          angle += deltaAngle;
        }

        if (!chosen) {
          radius += baseRingStep;
          startAngle += deltaAngle * 0.37; // slide the arc start to sneak into untried gaps
        }
      }

      if (!chosen) {
        // If we somehow didn't find a spot, drop it "far out" on the positive x-axis
        chosen = { id: it.id, left: Math.round(radius), top: 0, width: it.width, height: it.height };
      }

      const idx = placed.push(chosen) - 1;
      addToGrid(idx, chosen);
    }

    // Compute bounds of all placed nodes
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
  }, [items, spacing, compactness, seed, padding]);

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
