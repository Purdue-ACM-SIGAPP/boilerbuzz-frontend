// components/PosterCluster.tsx
import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";

export type PosterItem = {
  id: string;
  width: number;
  height: number;
  tag?: string;
  // You can carry likes or any other metadata; not required by the layout
  likes?: number;
};

type PosterClusterProps = {
  items: PosterItem[];
  boardWidth: number;
  boardHeight: number;
  /** Minimum gap between posters (in px). */
  spacing?: number;
  /** How strongly positions are pulled toward the center or tag-centroids [0..1]. */
  centerBias?: number;
  /** Run more iterations for tighter packing (tradeoff: CPU). */
  iterations?: number;
  /** If true, posters with the same tag drift toward a tag-specific centroid. */
  clusterByTag?: boolean;
  /** Seed for deterministic layout between renders. */
  seed?: number;
  /** Render function for each poster. */
  renderItem: (item: PosterItem) => React.ReactNode;
};

type Vec = { x: number; y: number };
type Node = PosterItem & { x: number; y: number; vx: number; vy: number };

function seededRand(seed: number) {
  // quick LCG for deterministic jitter
  let s = seed >>> 0 || 1;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function computeTagCentroids(
  items: PosterItem[],
  center: Vec,
  radius: number
): Record<string, Vec> {
  const tags = Array.from(new Set(items.map(i => i.tag).filter(Boolean))) as string[];
  const out: Record<string, Vec> = {};
  const TWO_PI = Math.PI * 2;
  tags.forEach((tag, idx) => {
    const a = (idx / Math.max(1, tags.length)) * TWO_PI;
    out[tag] = { x: center.x + radius * Math.cos(a), y: center.y + radius * Math.sin(a) };
  });
  return out;
}

/**
 * Simple rectangle collision resolution:
 * If two AABBs overlap, push them away along the axis of least overlap.
 */
function resolvePair(a: Node, b: Node, spacing: number) {
  const halfW = (a.width + b.width) * 0.5 + spacing;
  const halfH = (a.height + b.height) * 0.5 + spacing;

  const dx = b.x - a.x;
  const dy = b.y - a.y;

  const overlapX = halfW - Math.abs(dx);
  const overlapY = halfH - Math.abs(dy);

  if (overlapX > 0 && overlapY > 0) {
    // Resolve along the smaller overlap axis
    if (overlapX < overlapY) {
      const push = (overlapX / 2) * Math.sign(dx || 1);
      a.x -= push;
      b.x += push;
    } else {
      const push = (overlapY / 2) * Math.sign(dy || 1);
      a.y -= push;
      b.y += push;
    }
    return true;
  }
  return false;
}

/**
 * Force-ish rectangle packer with:
 * - attraction toward center (or tag centroid)
 * - pairwise collision resolution
 * - light damping
 */
function packLayout(
  items: PosterItem[],
  boardWidth: number,
  boardHeight: number,
  {
    spacing = 12,
    centerBias = 0.8,
    iterations = 120,
    clusterByTag = false,
    seed = 1,
  }: Required<Pick<PosterClusterProps, "spacing" | "centerBias" | "iterations" | "clusterByTag" | "seed">>
) {
  const center = { x: boardWidth / 2, y: boardHeight / 2 };
  const rnd = seededRand(seed);

  // Initial positions around center with a bit of jitter
  const nodes: Node[] = items.map((p, i) => {
    // Spiral-ish radius with jitter for nice scatter
    const t = i / Math.max(1, items.length);
    const radius = Math.sqrt(t) * Math.min(boardWidth, boardHeight) * 0.25;
    const angle = t * Math.PI * 6; // a few turns
    const jitterR = (rnd() - 0.5) * 30;
    const jitterA = (rnd() - 0.5) * 0.6;

    const x = center.x + (radius + jitterR) * Math.cos(angle + jitterA);
    const y = center.y + (radius + jitterR) * Math.sin(angle + jitterA);

    return { ...p, x, y, vx: 0, vy: 0 };
  });

  const damping = 0.8;
  const step = 0.9; // move scale per iteration
  const centroidRadius = Math.min(boardWidth, boardHeight) * 0.22;
  const tagTargets = clusterByTag ? computeTagCentroids(items, center, centroidRadius) : {};

  for (let k = 0; k < iterations; k++) {
    // Attraction toward center (or tag centroid)
    for (const n of nodes) {
      const target =
        clusterByTag && n.tag && tagTargets[n.tag] ? tagTargets[n.tag] : center;

      const ax = (target.x - n.x) * centerBias * 0.02;
      const ay = (target.y - n.y) * centerBias * 0.02;

      n.vx = n.vx * damping + ax;
      n.vy = n.vy * damping + ay;
    }

    // Integrate velocity
    for (const n of nodes) {
      n.x += n.vx * step;
      n.y += n.vy * step;

      // Keep within board bounds (loose clamp keeps it tidy)
      const halfW = n.width / 2 + spacing;
      const halfH = n.height / 2 + spacing;
      n.x = clamp(n.x, halfW, boardWidth - halfW);
      n.y = clamp(n.y, halfH, boardHeight - halfH);
    }

    // Resolve collisions (naive n^2 is OK for ~100 items)
    let anyOverlap = false;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        anyOverlap = resolvePair(nodes[i], nodes[j], spacing) || anyOverlap;
      }
    }

    // Early exit if stable enough
    if (!anyOverlap && k > 10) break;
  }

  return nodes.map(n => ({
    id: n.id,
    left: n.x - n.width / 2,
    top: n.y - n.height / 2,
    width: n.width,
    height: n.height,
  }));
}

export default function PosterCluster(props: PosterClusterProps) {
  const {
    items,
    boardWidth,
    boardHeight,
    spacing = 12,
    centerBias = 0.8,
    iterations = 120,
    clusterByTag = false,
    seed = 1,
    renderItem,
  } = props;

  const layout = useMemo(
    () =>
      packLayout(items, boardWidth, boardHeight, {
        spacing,
        centerBias,
        iterations,
        clusterByTag,
        seed,
      }),
    [
      items,
      boardWidth,
      boardHeight,
      spacing,
      centerBias,
      iterations,
      clusterByTag,
      seed,
    ]
  );

  return (
    <View style={{ width: boardWidth, height: boardHeight }}>
      {layout.map(node => (
        <View
          key={node.id}
          style={[
            styles.absolute,
            {
              left: Math.round(node.left),
              top: Math.round(node.top),
              width: Math.round(node.width),
              height: Math.round(node.height),
            },
          ]}
        >
          {renderItem(
            items.find(i => i.id === node.id)! // safe: ids match
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
  },
});
