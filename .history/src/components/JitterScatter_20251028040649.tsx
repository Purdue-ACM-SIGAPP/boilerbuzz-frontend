// components/JitterScatterNoOverlap.tsx
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
  minSpacing?: number; // required free margin between posters (px)
  ringStep?: number;   // radial distance between rings
  seed?: number;       // deterministic layout
  renderItem: (item: ScatterItem) => React.ReactNode;
};

function prng(seed: number) {
  let s = (seed || 1) >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

type Placed = { id: string; left: number; top: number; width: number; height: number };

function withinBoard(p: Placed, w: number, h: number, margin: number) {
  return (
    p.left >= margin &&
    p.top >= margin &&
    p.left + p.width <= w - margin &&
    p.top + p.height <= h - margin
  );
}

function overlaps(a: Placed, b: Placed, spacing: number) {
  // Inflate by spacing/2 on all sides, then AABB-overlap check
  const s = spacing / 2;
  const aL = a.left - s, aT = a.top - s, aR = a.left + a.width + s, aB = a.top + a.height + s;
  const bL = b.left - s, bT = b.top - s, bR = b.left + b.width + s, bB = b.top + b.height + s;
  return aL < bR && aR > bL && aT < bB && aB > bT;
}

export default function JitterScatterNoOverlap({
  items,
  boardWidth,
  boardHeight,
  minSpacing = 15,
  ringStep,
  seed = 7,
  renderItem,
}: Props) {
  const layout = useMemo(() => {
    if (!items.length) return [] as Placed[];

    // Place larger items first for easier packing
    const sorted = [...items].sort((a, b) => b.height * b.width - a.height * a.width);

    const cx = boardWidth / 2;
    const cy = boardHeight / 2;
    const rand = prng(seed);

    const avgH = sorted.reduce((acc, it) => acc + it.height, 0) / sorted.length;
    const step = ringStep ?? Math.max(120, Math.round(avgH + minSpacing + 20));

    let r = Math.max(140, Math.round(avgH * 0.8));
    let theta = rand() * Math.PI * 2;

    const placed: Placed[] = [];

    for (const it of sorted) {
      const tryPlace = (): Placed | null => {
        // circumference at this radius
        const C = Math.max(1, 2 * Math.PI * r);
        // Minimal angular increment based on item width + spacing
        const dThetaMin = ((it.width + minSpacing) / C) * 2 * Math.PI;
        // Don’t go too fine; ~2–3 degrees minimum
        const stepTheta = Math.max(dThetaMin, (2 * Math.PI) / 180);

        // Search around the ring up to ~one full revolution
        const maxSweeps = Math.ceil((2 * Math.PI) / stepTheta) + 4;
        let ang = theta;

        for (let s = 0; s < maxSweeps; s++) {
          // small jitter to avoid perfect arcs (kept tiny)
          const jitterA = (rand() - 0.5) * 0.2;
          const jitterR = (rand() - 0.5) * Math.min(20, step * 0.25);

          const rr = r + jitterR;
          const aa = ang + jitterA;

          const x = cx + rr * Math.cos(aa);
          const y = cy + rr * Math.sin(aa);

          const candidate: Placed = {
            id: it.id,
            left: Math.round(x - it.width / 2),
            top: Math.round(y - it.height / 2),
            width: it.width,
            height: it.height,
          };

          if (!withinBoard(candidate, boardWidth, boardHeight, minSpacing)) {
            ang += stepTheta;
            continue;
          }

          let collide = false;
          for (let j = 0; j < placed.length; j++) {
            if (overlaps(candidate, placed[j], minSpacing)) {
              collide = true;
              break;
            }
          }
          if (!collide) {
            // advance theta for next item roughly by its arc
            theta = ang + stepTheta;
            return candidate;
          }
          ang += stepTheta;
        }
        return null;
      };

      let placedNode = tryPlace();

      // If we couldn't place on this ring, move to next ring(s) until we can.
      let guard = 0;
      while (!placedNode && guard < 32) {
        r += step;
        theta = rand() * Math.PI * 2;
        placedNode = tryPlace();
        guard++;
      }

      // As a last resort (very unlikely), park at center ring with a slow spiral bump
      if (!placedNode) {
        const fallback: Placed = {
          id: it.id,
          left: Math.round(cx - it.width / 2),
          top: Math.round(cy - it.height / 2),
          width: it.width,
          height: it.height,
        };
        let ok = withinBoard(fallback, boardWidth, boardHeight, minSpacing);
        let spin = 0, rad = r;
        while (ok) {
          let hit = false;
          for (const p of placed) if (overlaps(fallback, p, minSpacing)) { hit = true; break; }
          if (!hit) break;
          spin += 0.2;
          rad += 6;
          fallback.left = Math.round(cx + rad * Math.cos(spin) - it.width / 2);
          fallback.top  = Math.round(cy + rad * Math.sin(spin) - it.height / 2);
          ok = withinBoard(fallback, boardWidth, boardHeight, minSpacing);
          if (rad > Math.max(boardWidth, boardHeight)) break;
        }
        placedNode = fallback;
      }

      placed.push(placedNode);
    }

    return placed;
  }, [items, boardWidth, boardHeight, minSpacing, ringStep, seed]);

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
