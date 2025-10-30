// components/PackedScatterGrid.tsx
import React, { useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";

/*
 * I couldn't get the library I wanted to work. I'm not too good with
 * understanding the math behind actual rendering and animation 
 * so I decided to just take some code from a library already made
 * and have AI optimize it so that it fit what I already had made.
 */


export type ScatterItem = { id: string; width: number; height: number };


type Props = {
  items: ScatterItem[];
  boardWidth: number;
  boardHeight: number;
  minSpacing?: number;       // gap between posters (default 15)
  ringStep?: number;
  compactness?: number;      // 0.5..1.2 — smaller = tighter spiral steps (default 0.75)
  seed?: number;
  onBoardSize?: (w: number, h: number) => void;
  renderItem: (it: ScatterItem) => React.ReactNode;
};

type Placed = { id: string; left: number; top: number; width: number; height: number };

function prng(seed = 1) { let s = seed >>> 0 || 1; return () => ((s = (1664525 * s + 1013904223) >>> 0) / 0xffffffff); }
const TAU = Math.PI * 2;
const GOLDEN_ANGLE = TAU * (1 - 1 / 1.61803398875);

function overlaps(a: Placed, b: Placed, spacing: number) {
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
  minSpacing = 15, // minimum margin between posters 
  compactness = 0.25, // how tight the packing is between posters (lower value is more compact, higher number is less compact)
  seed = 42, // seed for equations so that posters aren't actually placed in a grid-like manner
  onBoardSize,
  renderItem,
}: Props) {
  const layout = useMemo(() => {
    if (!items.length) return { nodes: [] as Placed[], usedW: 0, usedH: 0, minX: 0, minY: 0 };

    // Place bigger items first so the center is dense
    const data = [...items].sort((a, b) => b.width * b.height - a.width * a.height);

    // Neighbor grid (limits collision checks to nearby cells)
    const minW = Math.max(1, Math.min(...data.map(d => d.width)));
    const minH = Math.max(1, Math.min(...data.map(d => d.height)));
    const CELL = Math.max(32, Math.floor(Math.min(minW, minH) + minSpacing * 0.6));
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
          const arr = grid.get(k); arr ? arr.push(idx) : grid.set(k, [idx]);
        }
      }
    };
    const neighbors = (r: Placed) => {
      const gx0 = toCell(r.left - minSpacing), gy0 = toCell(r.top - minSpacing);
      const gx1 = toCell(r.left + r.width + minSpacing), gy1 = toCell(r.top + r.height + minSpacing);
      const out: number[] = []; const seen = new Set<number>();
      for (let gx = gx0; gx <= gx1; gx++) {
        for (let gy = gy0; gy <= gy1; gy++) {
          const arr = grid.get(key(gx, gy)); if (!arr) continue;
          for (const id of arr) if (!seen.has(id)) { seen.add(id); out.push(id); }
        }
      }
      return out;
    };

    // Center-biased spiral search: try near (0,0) first, then slowly expand
    const rnd = prng(seed);
    const baseStep = Math.max( minSpacing, Math.round(Math.min(minW, minH) * compactness) );
    const maxRings = 1_000;  // hard safety cap

    for (let i = 0; i < data.length; i++) {
      const it = data[i];

      // start near center; advance radius slowly for tight packing
      let r = 0;
      // stagger starting angle using golden angle for good gap filling
      let a0 = (i * GOLDEN_ANGLE) % TAU;
      let placedNode: Placed | null = null;

      for (let ring = 0; ring < maxRings && !placedNode; ring++) {
        const circumference = Math.max(1, TAU * Math.max(1, r));
        // number of angular samples at this radius (more when r is large)
        const stepArc = Math.max(minSpacing, it.width * 0.6);
        const nAngles = Math.max(12, Math.min(96, Math.ceil(circumference / stepArc)));
        const dA = TAU / nAngles;

        let ang = a0 + (rnd() - 0.5) * 0.2; // tiny jitter so patterns don’t show
        for (let t = 0; t < nAngles; t++) {
          const cx = r * Math.cos(ang);
          const cy = r * Math.sin(ang);

          const cand: Placed = {
            id: it.id,
            left: Math.round(cx - it.width / 2),
            top:  Math.round(cy - it.height / 2),
            width: it.width,
            height: it.height,
          };

          // check only nearby neighbors
          const neigh = neighbors(cand);
          let hit = false;
          for (let k = 0; k < neigh.length; k++) {
            if (overlaps(cand, placed[neigh[k]], minSpacing)) { hit = true; break; }
          }
          if (!hit) { placedNode = cand; break; }
          ang += dA;
        }

        if (!placedNode) {
          // gently grow outward
          r += baseStep;
          // shift the starting angle a bit to sneak into gaps between arcs
          a0 += dA * 0.37;
        }
      }

      if (!placedNode) {
        // ultra-rare: just drop far out without overlap (grid still prevents collisions)
        placedNode = { id: it.id, left: Math.round(r), top: 0, width: it.width, height: it.height };
      }

      const idx = placed.push(placedNode) - 1;
      addToGrid(idx, placedNode);
    }

    // bounds for board sizing
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of placed) {
      minX = Math.min(minX, n.left);
      minY = Math.min(minY, n.top);
      maxX = Math.max(maxX, n.left + n.width);
      maxY = Math.max(maxY, n.top + n.height);
    }

    return {
      nodes: placed,
      usedW: Math.ceil(maxX - minX),
      usedH: Math.ceil(maxY - minY),
      minX, minY,
    };
  }, [items, minSpacing, compactness, seed]);

  // Auto-size PanBoard (grow/shrink) with padding
  
const pad = 80;

// Canvas big enough for padding
const renderW = Math.max(boardWidth, layout.usedW + pad * 2);
const renderH = Math.max(boardHeight, layout.usedH + pad * 2);

// Center the cluster inside the canvas
const offsetX = Math.round((renderW - layout.usedW) / 2 - layout.minX);
const offsetY = Math.round((renderH - layout.usedH) / 2 - layout.minY);

// Auto-size PanBoard to the chosen canvas size
useEffect(() => {
  if (!onBoardSize) return;
  if (renderW !== boardWidth || renderH !== boardHeight) {
    onBoardSize(renderW, renderH);
  }
}, [renderW, renderH, onBoardSize, boardWidth, boardHeight]);

  return (
    <View style={{ width: renderW, height: renderH }}>
      {layout.nodes.map((n) => (
        <View
          key={n.id}
          style={[
            styles.abs,
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
  abs: { position: "absolute", overflow: "hidden", borderRadius: 10 },
});
