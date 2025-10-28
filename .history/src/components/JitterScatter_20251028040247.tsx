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
  spacing?: number; // min gap along a ring
  ringStep?: number; // radial step between rings
  seed?: number;     // deterministic jitter
  renderItem: (item: ScatterItem) => React.ReactNode;
};

function prng(seed: number) {
  let s = (seed || 1) >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

export default function JitterScatter({
  items,
  boardWidth,
  boardHeight,
  spacing = 16,
  ringStep,
  seed = 42,
  renderItem,
}: Props) {
  const layout = useMemo(() => {
    const cx = boardWidth / 2;
    const cy = boardHeight / 2;
    const rand = prng(seed);

    // Heuristic ring step: average item height + spacing
    const avgH =
      items.length > 0
        ? items.reduce((a, b) => a + b.height, 0) / items.length
        : 150;
    const step = ringStep ?? Math.max(120, Math.round(avgH + spacing + 20));

    // Start radius so the inner ring has room
    let r = Math.max(140, Math.round(avgH * 0.8));
    let theta = rand() * Math.PI * 2;
    let usedArc = 0; // used circumference on current ring (in px)

    const out: Array<{ id: string; left: number; top: number; width: number; height: number }> = [];

    for (const it of items) {
      const circumference = 2 * Math.PI * r;
      const arc = it.width + spacing; // approx horizontal footprint on the ring

      // If this item doesn't fit the remaining arc, move to next ring
      if (usedArc + arc > circumference) {
        r += step;
        theta = rand() * Math.PI * 2;
        usedArc = 0;
      }

      // convert pixel arc to angle
      const dTheta = (arc / Math.max(1, circumference)) * 2 * Math.PI;

      // Jitter (small) to avoid perfect arcs
      const jitterA = (rand() - 0.5) * 0.35; // ±0.175 rad ~ ±10°
      const jitterR = (rand() - 0.5) * Math.min(24, step * 0.25);

      const ang = theta + dTheta / 2 + jitterA;
      const rad = r + jitterR;

      const x = cx + rad * Math.cos(ang);
      const y = cy + rad * Math.sin(ang);

      out.push({
        id: it.id,
        left: Math.round(x - it.width / 2),
        top: Math.round(y - it.height / 2),
        width: it.width,
        height: it.height,
      });

      theta += dTheta;
      usedArc += arc;
    }

    return out;
  }, [items, boardWidth, boardHeight, spacing, ringStep, seed]);

  return (
    <View style={{ width: boardWidth, height: boardHeight }}>
      {layout.map((n) => (
        <View
          key={n.id}
          style={[styles.abs, { left: n.left, top: n.top, width: n.width, height: n.height }]}
        >
          {renderItem(items.find((i) => i.id === n.id)!)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  abs: { position: "absolute" },
});
