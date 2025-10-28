// components/PackedScatterGrid.tsx
import React, { useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";

export type ScatterItem = {
  id: string;
  width: number;   // render width (px)
  height: number;  // render height (px)
};

type Props = {
  items: ScatterItem[];
  boardWidth: number;                // current board size (PanBoard props)
  boardHeight: number;
  minSpacing?: number;               // gutter between posters (default 15)
  // keep these for compatibility; ignored in this packer:
  ringStep?: number;
  cellSize?: number;
  seed?: number;                     // optional; only affects tie-break sort
  onBoardSize?: (w: number, h: number) => void; // notify parent if board must grow/shrink
  renderItem: (sized: ScatterItem) => React.ReactNode;
};

type NodeRect = { x: number; y: number; w: number; h: number; used?: boolean; right?: NodeRect; down?: NodeRect };
type Fit = { x: number; y: number };
type Block = { id: string; w: number; h: number; fit?: Fit; renderW: number; renderH: number };

// --- Growing Bin Packer -----------------------------------------------------

function findNode(root: NodeRect | undefined, w: number, h: number): NodeRect | undefined {
  if (!root) return;
  if (!root.used && w <= root.w && h <= root.h) return root;
  return findNode(root.right, w, h) || findNode(root.down, w, h);
}

function splitNode(node: NodeRect, w: number, h: number): NodeRect {
  node.used = true;
  node.down = { x: node.x, y: node.y + h, w: node.w, h: node.h - h };
  node.right = { x: node.x + w, y: node.y, w: node.w - w, h };
  return node;
}

function growRight(root: NodeRect, w: number, h: number): NodeRect {
  const newRoot: NodeRect = {
    used: true,
    x: 0, y: 0,
    w: root.w + w, h: root.h,
    down: root,
    right: { x: root.w, y: 0, w, h: root.h }
  };
  return newRoot;
}

function growDown(root: NodeRect, w: number, h: number): NodeRect {
  const newRoot: NodeRect = {
    used: true,
    x: 0, y: 0,
    w: root.w, h: root.h + h,
    right: root,
    down: { x: 0, y: root.h, w: root.w, h }
  };
  return newRoot;
}

function growNode(root: NodeRect, w: number, h: number): { root: NodeRect; node?: NodeRect } {
  const canGrowRight = h <= root.h;
  const canGrowDown  = w <= root.w;
  // choose direction that keeps shape roughly squarish
  const shouldGrowRight = canGrowRight && (root.h >= root.w + w);
  const shouldGrowDown  = canGrowDown  && (root.w >= root.h + h);

  if (shouldGrowRight) {
    root = growRight(root, w, h);
    return { root, node: findNode(root, w, h) };
  } else if (shouldGrowDown) {
    root = growDown(root, w, h);
    return { root, node: findNode(root, w, h) };
  } else if (canGrowRight) {
    root = growRight(root, w, h);
    return { root, node: findNode(root, w, h) };
  } else if (canGrowDown) {
    root = growDown(root, w, h);
    return { root, node: findNode(root, w, h) };
  }
  return { root, node: undefined };
}

// ----------------------------------------------------------------------------

export default function PackedScatterGrid({
  items,
  boardWidth,
  boardHeight,
  minSpacing = 15,
  // compatibility only:
  ringStep,
  cellSize,
  seed,
  onBoardSize,
  renderItem,
}: Props) {
  const layout = useMemo(() => {
    if (!items.length) {
      return { nodes: [] as { id: string; x: number; y: number; w: number; h: number }[], usedW: 0, usedH: 0 };
    }

    // Prepare blocks, add full gutter to w/h, and keep original render sizes.
    const G = minSpacing;
    const blocks: Block[] = items.map((it) => ({
      id: it.id,
      // reserve area includes full gutter; we'll offset by G/2 at render time
      w: Math.max(1, Math.round(it.width  + G)),
      h: Math.max(1, Math.round(it.height + G)),
      renderW: it.width,
      renderH: it.height,
    }));

    // Largest-first pack helps quality; stable tie-breaker
    blocks.sort((a, b) => {
      const da = b.h - a.h; // taller first
      if (da !== 0) return da;
      const db = b.w - a.w;
      if (db !== 0) return db;
      // stable fallback by id
      return a.id < b.id ? -1 : 1;
    });

    // Seeded shuffle of equal-sized groups (optional)
    if (seed != null) {
      // tiny LCG
      let s = (seed || 1) >>> 0;
      const rnd = () => ((s = (1664525 * s + 1013904223) >>> 0) / 0xffffffff);
      for (let i = blocks.length - 1; i > 0; i--) {
        if (blocks[i].w === blocks[i - 1].w && blocks[i].h === blocks[i - 1].h && rnd() < 0.5) {
          const t = blocks[i]; blocks[i] = blocks[i - 1]; blocks[i - 1] = t;
        }
      }
    }

    // Start root with first block size
    let root: NodeRect = { x: 0, y: 0, w: blocks[0].w, h: blocks[0].h };

    for (const b of blocks) {
      let node = findNode(root, b.w, b.h);
      if (node) {
        b.fit = { x: node.x, y: node.y };
        splitNode(node, b.w, b.h);
      } else {
        const grown = growNode(root, b.w, b.h);
        root = grown.root;
        const n2 = grown.node;
        if (!n2) {
          // should be extremely rare; in that case, keep growing down
          root = growDown(root, b.w, b.h);
          const n3 = findNode(root, b.w, b.h);
          if (!n3) continue;
          b.fit = { x: n3.x, y: n3.y };
          splitNode(n3, b.w, b.h);
        } else {
          b.fit = { x: n2.x, y: n2.y };
          splitNode(n2, b.w, b.h);
        }
      }
    }

    // Compute used area (in padded coordinates)
    let usedW = 0, usedH = 0;
    for (const b of blocks) {
      if (!b.fit) continue;
      usedW = Math.max(usedW, b.fit.x + b.w);
      usedH = Math.max(usedH, b.fit.y + b.h);
    }

    // Convert to render nodes: offset each by G/2 so spacing is symmetric.
    const nodes = blocks.map((b) => {
      const x = (b.fit?.x ?? 0) + G / 2;
      const y = (b.fit?.y ?? 0) + G / 2;
      return { id: b.id, x: Math.round(x), y: Math.round(y), w: b.renderW, h: b.renderH };
    });

    // Final board size in render coordinates: same as used padded size (already includes two * G/2)
    const finalW = Math.max(usedW, 0);
    const finalH = Math.max(usedH, 0);

    return { nodes, usedW: finalW, usedH: finalH };
  }, [items, minSpacing, seed]);

  // Tell parent if board size needs to change (grow or shrink)
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
        <View
          key={n.id}
          style={[styles.cell, { left: n.x, top: n.y, width: n.w, height: n.h }]}
        >
          {renderItem({ id: n.id, width: n.w, height: n.h })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: { position: "absolute", overflow: "hidden", borderRadius: 10 },
});
