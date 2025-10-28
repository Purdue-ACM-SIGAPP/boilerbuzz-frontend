// components/PackedScatterGrid.tsx
import React, { useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";

export type ScatterItem = { id: string; width: number; height: number };

type Props = {
  items: ScatterItem[];
  boardWidth: number;
  boardHeight: number;
  minSpacing?: number;
  ringStep?: number;   // kept for compatibility (unused)
  cellSize?: number;   // kept for compatibility (unused)
  seed?: number;       // controls deterministic shuffles
  onBoardSize?: (w: number, h: number) => void;
  renderItem: (sized: ScatterItem) => React.ReactNode;
};

type NodeRect = { x: number; y: number; w: number; h: number; used?: boolean; right?: NodeRect; down?: NodeRect };
type Fit = { x: number; y: number };
type Block = { id: string; w: number; h: number; fit?: Fit; renderW: number; renderH: number };

// ---------- utils
function prng(seed: number) {
  let s = (seed || 1) >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

// alternate search direction to reduce bias
function findNodeDir(root: NodeRect | undefined, w: number, h: number, preferRight: boolean): NodeRect | undefined {
  if (!root) return;
  if (!root.used && w <= root.w && h <= root.h) return root;
  if (preferRight) return findNodeDir(root.right, w, h, preferRight) || findNodeDir(root.down, w, h, preferRight);
  return findNodeDir(root.down, w, h, preferRight) || findNodeDir(root.right, w, h, preferRight);
}

function splitNode(node: NodeRect, w: number, h: number): NodeRect {
  node.used = true;
  node.down = { x: node.x, y: node.y + h, w: node.w, h: node.h - h };
  node.right = { x: node.x + w, y: node.y, w: node.w - w, h };
  return node;
}

function growRight(root: NodeRect, w: number, h: number): NodeRect {
  return {
    used: true,
    x: 0, y: 0,
    w: root.w + w, h: root.h,
    down: root,
    right: { x: root.w, y: 0, w, h: root.h },
  };
}

function growDown(root: NodeRect, w: number, h: number): NodeRect {
  return {
    used: true,
    x: 0, y: 0,
    w: root.w, h: root.h + h,
    right: root,
    down: { x: 0, y: root.h, w: root.w, h },
  };
}

// choose growth that keeps aspect closer to square
function growNodeSmart(root: NodeRect, w: number, h: number, preferRight: boolean): { root: NodeRect; node?: NodeRect } {
  const GR = growRight({ ...root }, w, h);
  const GD = growDown({ ...root }, w, h);

  const arR = GR.w / GR.h;
  const arD = GD.w / GD.h;
  const scoreR = Math.abs(Math.log(arR)); // 0 if perfectly square
  const scoreD = Math.abs(Math.log(arD));

  let chosen = scoreR < scoreD ? GR : GD;
  // tie-breaker: sometimes honor preferred direction to add variety
  if (Math.abs(scoreR - scoreD) < 0.02) chosen = preferRight ? GR : GD;

  const node = findNodeDir(chosen, w, h, preferRight);
  return { root: chosen, node };
}

// interleave large/medium/small buckets so big items aren’t all first
function interleaveByArea(blocks: Block[], seed = 42): Block[] {
  const rnd = prng(seed);
  const sorted = [...blocks].sort((a, b) => b.w * b.h - a.w * a.h);

  const n = sorted.length;
  const g = 3; // number of buckets
  const groups: Block[][] = Array.from({ length: g }, () => []);
  for (let i = 0; i < n; i++) {
    const bucket = Math.floor((i / n) * g); // 0..g-1 by quantiles
    groups[bucket].push(sorted[i]);
  }
  // shuffle inside each bucket
  for (const grp of groups) {
    for (let i = grp.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [grp[i], grp[j]] = [grp[j], grp[i]];
    }
  }
  // round-robin interleave: L, M, S, L, M, S, ...
  const out: Block[] = [];
  let idxs = groups.map(() => 0);
  let remaining = n;
  while (remaining > 0) {
    for (let b = 0; b < g; b++) {
      const i = idxs[b];
      if (i < groups[b].length) {
        out.push(groups[b][i]);
        idxs[b] = i + 1;
        remaining--;
      }
    }
  }
  return out;
}

// ---------- component
export default function PackedScatterGrid({
  items,
  boardWidth,
  boardHeight,
  minSpacing = 15,
  seed = 42,
  onBoardSize,
  renderItem,
}: Props) {
  const layout = useMemo(() => {
    if (!items.length) return { nodes: [] as { id: string; x: number; y: number; w: number; h: number }[], usedW: 0, usedH: 0 };

    const G = minSpacing;

    // Build blocks (reserve full gutter; render uses w/h without gutter)
    const raw: Block[] = items.map((it) => ({
      id: it.id,
      w: Math.max(1, Math.round(it.width + G)),
      h: Math.max(1, Math.round(it.height + G)),
      renderW: it.width,
      renderH: it.height,
    }));

    // Interleave sizes to avoid “all big first”
    const blocks = interleaveByArea(raw, seed);

    // Initialize root with a near-square guess = ~sqrt(total padded area)
    const totalArea = blocks.reduce((a, b) => a + b.w * b.h, 0);
    const side = Math.max(1, Math.ceil(Math.sqrt(totalArea) * 0.25)); // conservative start, will grow as needed
    let root: NodeRect = { x: 0, y: 0, w: blocks[0] ? Math.max(blocks[0].w, side) : side, h: blocks[0] ? Math.max(blocks[0].h, side) : side };

    // Pack
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      const preferRight = (i & 1) === 0; // alternate search direction

      let node = findNodeDir(root, b.w, b.h, preferRight);
      if (node) {
        b.fit = { x: node.x, y: node.y };
        splitNode(node, b.w, b.h);
      } else {
        const grown = growNodeSmart(root, b.w, b.h, preferRight);
        root = grown.root;
        const n2 = grown.node;
        if (!n2) {
          // emergency: always succeed by growing down once more
          root = growDown(root, b.w, b.h);
          const n3 = findNodeDir(root, b.w, b.h, preferRight) as NodeRect;
          b.fit = { x: n3.x, y: n3.y };
          splitNode(n3, b.w, b.h);
        } else {
          b.fit = { x: n2.x, y: n2.y };
          splitNode(n2, b.w, b.h);
        }
      }
    }

    // used extents (include full gutter reservation)
    let usedW = 0, usedH = 0;
    for (const b of blocks) {
      if (!b.fit) continue;
      usedW = Math.max(usedW, b.fit.x + b.w);
      usedH = Math.max(usedH, b.fit.y + b.h);
    }

    // render nodes: subtract half-gutter so gaps are symmetric
    const nodes = blocks.map((b) => {
      const x = (b.fit?.x ?? 0) + G / 2;
      const y = (b.fit?.y ?? 0) + G / 2;
      return { id: b.id, x: Math.round(x), y: Math.round(y), w: b.renderW, h: b.renderH };
    });

    return { nodes, usedW, usedH };
  }, [items, minSpacing, seed]);

  // Resize PanBoard if needed (grow/shrink)
  useEffect(() => {
    if (!onBoardSize) return;
    const w = Math.max(boardWidth, layout.usedW);
    const h = Math.max(boardHeight, layout.usedH);
    if (w !== boardWidth || h !== boardHeight) onBoardSize(w, h);
  }, [layout.usedW, layout.usedH, onBoardSize, boardWidth, boardHeight]);

  const renderW = Math.max(boardWidth, layout.usedW);
  const renderH = Math.max(boardHeight, layout.usedH);

  return (
    <View style={{ width: renderW, height: renderH }}>
      {layout.nodes.map((n) => (
        <View key={n.id} style={[styles.cell, { left: n.x, top: n.y, width: n.w, height: n.h }]}>
          {renderItem({ id: n.id, width: n.w, height: n.h })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: { position: "absolute", overflow: "hidden", borderRadius: 10 },
});
