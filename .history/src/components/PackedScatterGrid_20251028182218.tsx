// components/PackedScatterGrid.tsx
import React, { useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";

export type ScatterItem = { id: string; width: number; height: number };

type Props = {
  items: ScatterItem[];
  boardWidth: number;
  boardHeight: number;
  minSpacing?: number;       // minimum gap between posters (default 15)
  ringStep?: number;         // optional override for ring spacing (px)
  compactness?: number;      // 0.6..1.2: lower = tighter rings (default 0.8)
  seed?: number;             // deterministic jitter
  onBoardSize?: (w: number, h: number) => void;
  renderItem: (it: ScatterItem) => React.ReactNode;
};

type Placed = { id: string; left: number; top: number; width: number; height: number };

// tiny PRNG
function prng(seed = 1) { let s = seed >>> 0 || 1; return () => ((s = (1664525 * s + 1013904223) >>> 0) / 0xffffffff); }

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
  minSpacing = 15,
  ringStep,
  compactness = 0.8,
  seed = 42,
  onBoardSize,
  renderItem,
}: Props) {

  const layout = useMemo(() => {
    if (!items.length) {
      return { nodes: [] as Placed[], usedW: 0, usedH: 0 };
    }

    // 1) Order: place larger/taller first so the core is dense
    const data = [...items].sort((a, b) => (b.height - a.height) || (b.width - a.width));

    // 2) Neighbor grid for fast overlap checks
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
      for (let gx = gx0; gx <= gx1; gx++) for (let gy = gy0; gy <= gy1; gy++) {
        const k = key(gx, gy);
        const arr = grid.get(k); arr ? arr.push(idx) : grid.set(k, [idx]);
      }
    };
    const neighbors = (r: Placed) => {
      const gx0 = toCell(r.left - minSpacing), gy0 = toCell(r.top - minSpacing);
      const gx1 = toCell(r.left + r.width + minSpacing), gy1 = toCell(r.top + r.height + minSpacing);
      const out: number[] = []; const seen = new Set<number>();
      for (let gx = gx0; gx <= gx1; gx++) for (let gy = gy0; gy <= gy1; gy++) {
        const arr = grid.get(key(gx, gy)); if (!arr) continue;
        for (const id of arr) if (!seen.has(id)) { seen.add(id); out.push(id); }
      }
      return out;
    };

    // 3) Ring parameters (world coords centered at 0,0)
    const rnd = prng(seed);
    const avgH = data.reduce((a, b) => a + b.height, 0) / data.length;
    const STEP = ringStep ?? Math.max( minSpacing + 24, Math.round((avgH + minSpacing) * compactness) );

    let r = Math.max(80, Math.round(avgH * 0.7)); // initial radius
    let theta = rnd() * Math.PI * 2;
    let usedArc = 0;

    const circumference = () => 2 * Math.PI * r;

    for (let i = 0; i < data.length; i++) {
      const it = data[i];
      const arc = it.width + minSpacing;               // pixel arc claim on the ring
      const cap = Math.max(1, circumference());

      // If it doesn't fit remaining arc, start a new ring
      if (usedArc + arc > cap) {
        r += STEP;
        theta = rnd() * Math.PI * 2;
        usedArc = 0;
      }

      // base angle increment proportional to arc
      const dTheta = (arc / Math.max(1, circumference())) * 2 * Math.PI;

      // Local placement search: try a few tiny angular nudges before giving up
      let placedNode: Placed | null = null;
      let ang = theta + dTheta / 2;

      for (let tries = 0; tries < 8; tries++) {
        const jitterA = (rnd() - 0.5) * 0.12;                     // small jitter to avoid perfect arcs
        const jitterR = (rnd() - 0.5) * Math.min(6, STEP * 0.2);  // tiny radial jitter keeps it tight
        const rr = r + jitterR;
        const aa = ang + jitterA;

        const cx = rr * Math.cos(aa);
        const cy = rr * Math.sin(aa);

        const cand: Placed = {
          id: it.id,
          left: Math.round(cx - it.width / 2),
          top:  Math.round(cy - it.height / 2),
          width: it.width,
          height: it.height,
        };

        // neighbor-only overlap check
        const neigh = neighbors(cand);
        let hit = false;
        for (let k = 0; k < neigh.length; k++) {
          if (overlaps(cand, placed[neigh[k]], minSpacing)) { hit = true; break; }
        }
        if (!hit) { placedNode = cand; break; }

        // small angular step to squeeze in tightly
        ang += dTheta * 0.35;
      }

      // If still not placed, bump outward just enough and place
      if (!placedNode) {
        let rr = r + Math.max(2, minSpacing * 0.5);
        for (let stepOut = 0; stepOut < 6 && !placedNode; stepOut++) {
          const cx = rr * Math.cos(ang);
          const cy = rr * Math.sin(ang);
          const cand: Placed = {
            id: it.id,
            left: Math.round(cx - it.width / 2),
            top:  Math.round(cy - it.height / 2),
            width: it.width,
            height: it.height,
          };
          const neigh = neighbors(cand);
          let hit = false;
          for (let k = 0; k < neigh.length; k++) {
            if (overlaps(cand, placed[neigh[k]], minSpacing)) { hit = true; break; }
          }
          if (!hit) placedNode = cand;
          rr += Math.ceil(minSpacing * 0.6); // tiny outward nudge
        }
      }

      if (!placedNode) {
        // last resort: new ring, place there (still tight)
        r += STEP;
        usedArc = 0;
        const aa = rnd() * Math.PI * 2;
        const cx = r * Math.cos(aa);
        const cy = r * Math.sin(aa);
        placedNode = {
          id: it.id,
          left: Math.round(cx - it.width / 2),
          top:  Math.round(cy - it.height / 2),
          width: it.width,
          height: it.height,
        };
      }

      const idx = placed.push(placedNode) - 1;
      addToGrid(idx, placedNode);

      // advance along the ring just enough for tight packing
      usedArc += arc;
      theta += dTheta;
    }

    // 4) Compute bounds and return
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of placed) {
      minX = Math.min(minX, n.left);
      minY = Math.min(minY, n.top);
      maxX = Math.max(maxX, n.left + n.width);
      maxY = Math.max(maxY, n.top + n.height);
    }
    return { nodes: placed, usedW: Math.ceil(maxX - minX), usedH: Math.ceil(maxY - minY), minX, minY };
  }, [items, minSpacing, ringStep, compactness, seed]);

  // Auto-size PanBoard if needed
  useEffect(() => {
    if (!onBoardSize) return;
    const pad = 80;
    const w = Math.max(boardWidth, layout.usedW + pad * 2);
    const h = Math.max(boardHeight, layout.usedH + pad * 2);
    if (w !== boardWidth || h !== boardHeight) onBoardSize(w, h);
  }, [layout.usedW, layout.usedH, onBoardSize, boardWidth, boardHeight]);

  // Render with offset so minX/minY sit inside padding
  const pad = 80;
  const offsetX = pad - (layout.minX ?? 0);
  const offsetY = pad - (layout.minY ?? 0);
  const renderW = Math.max(boardWidth, (layout.usedW ?? 0) + pad * 2);
  const renderH = Math.max(boardHeight, (layout.usedH ?? 0) + pad * 2);

  return (
    <View style={{ width: renderW, height: renderH }}>
      {layout.nodes.map((n) => (
        <View
          key={n.id}
          style={[
            styles.abs,
            {
              left: n.left + offsetX,
              top: n.top + offsetY,
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
