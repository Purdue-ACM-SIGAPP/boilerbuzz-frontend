// components/PackedScatterGrid.tsx
import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";

export type ScatterItem = {
  id: string;
  width: number;
  height: number;
};

type Props = {
  items: ScatterItem[];
  boardWidth: number;
  boardHeight: number;
  minSpacing?: number;   // >= 15 for your case
  ringStep?: number;     // radial distance between rings
  seed?: number;         // deterministic jitter
  cellSize?: number;     // spatial grid cell size (auto if omitted)
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

function withinBoard(p: Placed, W: number, H: number, margin: number) {
  return (
    p.left >= margin &&
    p.top >= margin &&
    p.left + p.width <= W - margin &&
    p.top + p.height <= H - margin
  );
}

export default function PackedScatterGrid({
  items,
  boardWidth,
  boardHeight,
  minSpacing = 15,
  ringStep,
  seed = 7,
  cellSize,
  renderItem,
}: Props) {
  const layout = useMemo(() => {
    if (!items.length) return [] as Placed[];

    // Sort largest first for easier packing
    const sorted = [...items].sort((a, b) => b.width * b.height - a.width * a.height);

    // Spatial grid (hash map): cell key -> indices of placed[]
    const minW = Math.max(1, Math.min(...sorted.map(i => i.width)));
    const minH = Math.max(1, Math.min(...sorted.map(i => i.height)));
    const defaultCell = Math.max(32, Math.floor((Math.min(minW, minH) + minSpacing) * 0.8));
    const CELL = cellSize ?? defaultCell;

    const grid = new Map<string, number[]>();
    const key = (gx: number, gy: number) => `${gx},${gy}`;
    const toCell = (x: number) => Math.floor(x / CELL);

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

    // Center + ring parameters
    const cx = boardWidth / 2, cy = boardHeight / 2;
    const rand = prng(seed);
    const avgH =
      sorted.reduce((acc, it) => acc + it.height, 0) / Math.max(1, sorted.length);
    const STEP = ringStep ?? Math.max(120, Math.round(avgH + minSpacing + 20));
    let radius = Math.max(140, Math.round(avgH * 0.8));
    let theta = rand() * Math.PI * 2;

    for (let i = 0; i < sorted.length; i++) {
      const it = sorted[i];

      const circumference = Math.max(1, 2 * Math.PI * radius);
      const dThetaMin = ((it.width + minSpacing) / circumference) * 2 * Math.PI;
      const stepTheta = Math.max(dThetaMin, (2 * Math.PI) / 180); // >= ~2°

      let placedNode: Placed | null = null;
      let attempts = 0;

      const tryRing = (): Placed | null => {
        const maxSweeps = Math.ceil((2 * Math.PI) / stepTheta) + 4;
        let ang = theta;

        for (let s = 0; s < maxSweeps; s++) {
          // small jitter for organic look
          const jitterA = (rand() - 0.5) * 0.25;
          const jitterR = (rand() - 0.5) * Math.min(20, STEP * 0.25);
          const rr = radius + jitterR;
          const aa = ang + jitterA;

          const x = cx + rr * Math.cos(aa);
          const y = cy + rr * Math.sin(aa);

          const cand: Placed = {
            id: it.id,
            left: Math.round(x - it.width / 2),
            top: Math.round(y - it.height / 2),
            width: it.width,
            height: it.height,
          };

          if (!withinBoard(cand, boardWidth, boardHeight, minSpacing)) {
            ang += stepTheta; attempts++; continue;
          }

          // Only check local neighbors from grid
          const neigh = neighbors(cand);
          let hit = false;
          for (let k = 0; k < neigh.length; k++) {
            if (overlapsAABB(cand, placed[neigh[k]], minSpacing)) { hit = true; break; }
          }
          if (!hit) {
            theta = ang + stepTheta; // advance along the ring for the next poster
            return cand;
          }

          ang += stepTheta; attempts++;
        }
        return null;
      };

      placedNode = tryRing();

      // If no spot on this ring, expand outward until we find one (efficient with grid).
      let guards = 0;
      while (!placedNode && guards < 32) {
        radius += STEP;
        theta = rand() * Math.PI * 2;
        placedNode = tryRing();
        guards++;
      }

      // Fallback (rare): park near center and spiral out, still using grid neighbor checks
      if (!placedNode) {
        let rr = Math.min(boardWidth, boardHeight) * 0.2;
        let a = rand() * Math.PI * 2;
        let ok = false;
        for (let spins = 0; spins < 200; spins++) {
          const x = cx + rr * Math.cos(a);
          const y = cy + rr * Math.sin(a);
          const cand: Placed = {
            id: it.id,
            left: Math.round(x - it.width / 2),
            top: Math.round(y - it.height / 2),
            width: it.width,
            height: it.height,
          };
          if (withinBoard(cand, boardWidth, boardHeight, minSpacing)) {
            const neigh = neighbors(cand);
            let hit = false;
            for (let k = 0; k < neigh.length; k++) {
              if (overlapsAABB(cand, placed[neigh[k]], minSpacing)) { hit = true; break; }
            }
            if (!hit) { placedNode = cand; ok = true; break; }
          }
          a += 0.3;
          rr += 6;
        }
        if (!ok) {
          // give up gracefully: place at center without collisions guarantee (shouldn't happen)
          placedNode = {
            id: it.id,
            left: Math.round(cx - it.width / 2),
            top: Math.round(cy - it.height / 2),
            width: it.width,
            height: it.height,
          };
        }
      }

      const idx = placed.push(placedNode) - 1;
      addToGrid(idx, placedNode);
    }

    return placed;
  }, [items, boardWidth, boardHeight, minSpacing, ringStep, seed, cellSize]);

  return (
    <View style={{ width: boardWidth, height: boardHeight }}>
      {layout.map((n) => (
        <View key={n.id} style={[styles.abs, { left: n.left, top: n.top, width: n.width, height: n.height }]}>
          {renderItem(items.find((i) => i.id === n.id)!)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  abs: { position: "absolute" },
});
