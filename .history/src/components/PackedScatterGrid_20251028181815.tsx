// components/PackedScatterGrid.tsx
import React, { useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";

export type ScatterItem = {
  id: string;
  width: number;
  height: number;
};

type Props = {
  items: ScatterItem[];
  boardWidth: number;              // current board size (from parent state)
  boardHeight: number;
  minSpacing?: number;             // >= 15 for your case
  ringStep?: number;               // radial ring spacing
  seed?: number;                   // deterministic jitter
  cellSize?: number;               // spatial grid cell size
  padding?: number;                // extra breathing room around bbox
  onBoardSize?: (w: number, h: number) => void; // callback to grow PanBoard
  renderItem: (item: ScatterItem) => React.ReactNode;
};

type Placed = { id: string; left: number; top: number; width: number; height: number };

function prng(seed: number) {
  let s = (seed || 1) >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function overlapsAABB(a: Placed, b: Placed, spacing: number) {
  const L1 = a.left - spacing,  T1 = a.top - spacing;
  const R1 = a.left + a.width + spacing, B1 = a.top + a.height + spacing;
  const L2 = b.left - spacing,  T2 = b.top - spacing;
  const R2 = b.left + b.width + spacing, B2 = b.top + b.height + spacing;
  return L1 < R2 && R1 > L2 && T1 < B2 && B1 > T2;
}

export default function PackedScatterGrid({
  items,
  boardWidth,
  boardHeight,
  minSpacing = 15,
  ringStep,
  seed = 42,
  cellSize,
  padding = 100,
  onBoardSize,
  renderItem,
}: Props) {
  const layout = useMemo(() => {
    if (!items.length) {
      return {
        placed: [] as Placed[],
        bounds: { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 },
        computedW: padding * 2,
        computedH: padding * 2,
        offsetX: padding,
        offsetY: padding,
      };
    }

    // Sort largest-first for easier packing
    const sorted = [...items].sort((a, b) => b.width * b.height - a.width * a.height);

    // Spatial grid
    const minW = Math.max(1, Math.min(...sorted.map(i => i.width)));
    const minH = Math.max(1, Math.min(...sorted.map(i => i.height)));
    const CELL = cellSize ?? Math.max(32, Math.floor((Math.min(minW, minH) + minSpacing) * 0.8));
    const key = (gx: number, gy: number) => `${gx},${gy}`;
    const toCell = (x: number) => Math.floor(x / CELL);
    const grid = new Map<string, number[]>();
    const placed: Placed[] = [];

    const addToGrid = (idx: number, r: Placed) => {
      const gx0 = toCell(r.left), gy0 = toCell(r.top);
      const gx1 = toCell(r.left + r.width), gy1 = toCell(r.top + r.height);
      for (let gx = gx0; gx <= gx1; gx++) {
        for (let gy = gy0; gy <= gy1; gy++) {
          const k = key(gx, gy);
          const arr = grid.get(k);
          if (arr) arr.push(idx);
          else grid.set(k, [idx]);
        }
      }
    };

    const neighbors = (r: Placed): number[] => {
      const gx0 = toCell(r.left - minSpacing), gy0 = toCell(r.top - minSpacing);
      const gx1 = toCell(r.left + r.width + minSpacing), gy1 = toCell(r.top + r.height + minSpacing);
      const out: number[] = [];
      const seen = new Set<number>();
      for (let gx = gx0; gx <= gx1; gx++) {
        for (let gy = gy0; gy <= gy1; gy++) {
          const arr = grid.get(key(gx, gy));
          if (!arr) continue;
          for (const idx of arr) if (!seen.has(idx)) { seen.add(idx); out.push(idx); }
        }
      }
      return out;
    };

    // Place around (0,0); we'll offset & pad after computing bounds
    const rand = prng(seed);
    const avgH = sorted.reduce((acc, it) => acc + it.height, 0) / Math.max(1, sorted.length);
    const STEP = ringStep ?? Math.max(100, Math.round(avgH + minSpacing + 20));

    let radius = Math.max(140, Math.round(avgH * 0.8));
    let theta = rand() * Math.PI * 2;

    for (let i = 0; i < sorted.length; i++) {
      const it = sorted[i];
      const circumference = Math.max(1, 2 * Math.PI * radius);
      const dThetaMin = ((it.width + minSpacing) / circumference) * 2 * Math.PI;
      const stepTheta = Math.max(dThetaMin, (2 * Math.PI) / 180); // ≥ ~2°

      let placedNode: Placed | null = null;

      const tryRing = (): Placed | null => {
        const maxSweeps = Math.ceil((2 * Math.PI) / stepTheta) + 4;
        let ang = theta;
        for (let s = 0; s < maxSweeps; s++) {
          const jitterA = (rand() - 0.5) * 0.25;
          const jitterR = (rand() - 0.5) * Math.min(20, STEP * 0.25);
          const rr = radius + jitterR;
          const aa = ang + jitterA;

          const cx = rr * Math.cos(aa);
          const cy = rr * Math.sin(aa);

          const cand: Placed = {
            id: it.id,
            left: Math.round(cx - it.width / 2),
            top: Math.round(cy - it.height / 2),
            width: it.width,
            height: it.height,
          };

          const neigh = neighbors(cand);
          let hit = false;
          for (let k = 0; k < neigh.length; k++) {
            if (overlapsAABB(cand, placed[neigh[k]], minSpacing)) { hit = true; break; }
          }
          if (!hit) {
            theta = ang + stepTheta; // advance for next item
            return cand;
          }
          ang += stepTheta;
        }
        return null;
      };

      placedNode = tryRing();

      // If no spot on this ring, expand outward
      let guards = 0;
      while (!placedNode && guards < 32) {
        radius += STEP;
        theta = rand() * Math.PI * 2;
        placedNode = tryRing();
        guards++;
      }

      // Fallback spiral (still grid-checked)
      if (!placedNode) {
        let rr = STEP * 0.5;
        let a = rand() * Math.PI * 2;
        for (let spins = 0; spins < 240; spins++) {
          const cx = rr * Math.cos(a);
          const cy = rr * Math.sin(a);
          const cand: Placed = {
            id: it.id, width: it.width, height: it.height,
            left: Math.round(cx - it.width / 2), top: Math.round(cy - it.height / 2),
          };
          const neigh = neighbors(cand);
          let hit = false;
          for (let k = 0; k < neigh.length; k++) {
            if (overlapsAABB(cand, placed[neigh[k]], minSpacing)) { hit = true; break; }
          }
          if (!hit) { placedNode = cand; break; }
          a += 0.3; rr += 6;
        }
        if (!placedNode) {
          // last resort — far out point, still no overlap
          placedNode = { id: it.id, width: it.width, height: it.height, left: Math.round(radius), top: 0 };
        }
      }

      const idx = placed.push(placedNode) - 1;
      addToGrid(idx, placedNode);
    }

    // bounds in world coords
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of placed) {
      minX = Math.min(minX, n.left);
      minY = Math.min(minY, n.top);
      maxX = Math.max(maxX, n.left + n.width);
      maxY = Math.max(maxY, n.top + n.height);
    }
    const bounds = { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
    const computedW = Math.ceil(bounds.width + padding * 2);
    const computedH = Math.ceil(bounds.height + padding * 2);
    const offsetX = Math.round(padding - bounds.minX);
    const offsetY = Math.round(padding - bounds.minY);

    return { placed, bounds, computedW, computedH, offsetX, offsetY };
  }, [items, minSpacing, ringStep, seed, cellSize, padding]);

  // Report required board size up to parent
  useEffect(() => {
    if (!onBoardSize) return;
    if (layout.computedW !== boardWidth || layout.computedH !== boardHeight) {
      onBoardSize(layout.computedW, layout.computedH);
    }
  }, [layout.computedW, layout.computedH, boardWidth, boardHeight, onBoardSize]);

  return (
    <View style={{ width: boardWidth, height: boardHeight }}>
      {layout.placed.map((n) => (
        <View
          key={n.id}
          style={[
            styles.abs,
            {
              left: n.left + layout.offsetX,
              top: n.top + layout.offsetY,
              width: n.width,
              height: n.height,
            },
          ]}
        >
          {renderItem({ id: n.id, width: n.width, height: n.height })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  abs: { position: "absolute", overflow: "hidden", borderRadius: 10 },
});
