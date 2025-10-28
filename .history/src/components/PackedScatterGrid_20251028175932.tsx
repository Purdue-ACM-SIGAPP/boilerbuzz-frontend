// components/PackedScatterGrid.tsx
import React, { useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";

export type ScatterItem = {
  id: string;
  /** Intrinsic image size (for aspect ratio). If you don't have real sizes,
   * pass something like width=2, height=3 for a 2:3 poster. */
  width: number;
  height: number;
};

type Props = {
  items: ScatterItem[];
  boardWidth: number;              // PanBoard width
  boardHeight: number;             // PanBoard height (will be updated via onBoardSize)
  numColumns?: number;             // default 3
  gutter?: number;                 // px between tiles (default 12)
  getColumnSpan?: (item: ScatterItem, index: number) => 1 | 2; // default 1
  onBoardSize?: (w: number, h: number) => void;                // report needed height
  renderItem: (item: ScatterItem) => React.ReactNode;          // child fills its cell
};

type Node = {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

export default function PackedScatterGrid({
  items,
  boardWidth,
  boardHeight,
  numColumns = 3,
  gutter = 12,
  getColumnSpan = (_, i) => (i % 7 === 0 ? 2 : 1), // simple “hero” rule
  onBoardSize,
  renderItem,
}: Props) {
  const layout = useMemo(() => {
    if (!items.length || boardWidth <= 0) {
      return { nodes: [] as Node[], neededHeight: 0 };
    }

    const colW = Math.max(
      1,
      Math.floor((boardWidth - gutter * (numColumns + 1)) / numColumns)
    );
    const colHeights = Array.from({ length: numColumns }, () => gutter);
    const nodes: Node[] = [];

    const placeSpan1 = (it: ScatterItem) => {
      // pick shortest column
      let col = 0;
      for (let i = 1; i < numColumns; i++) {
        if (colHeights[i] < colHeights[col]) col = i;
      }
      const w = colW;
      const h = Math.round((it.height / it.width) * w); // keep aspect
      const left = gutter + col * (colW + gutter);
      const top = colHeights[col];

      nodes.push({ id: it.id, left, top, width: w, height: h });
      colHeights[col] = top + h + gutter;
    };

    const placeSpan2 = (it: ScatterItem) => {
      if (numColumns < 2) return placeSpan1(it);

      // choose best adjacent pair (minimal resulting top)
      let bestStart = 0;
      let bestTop = Number.MAX_SAFE_INTEGER;
      for (let i = 0; i < numColumns - 1; i++) {
        const t = Math.max(colHeights[i], colHeights[i + 1]);
        if (t < bestTop) { bestTop = t; bestStart = i; }
      }
      const w = colW * 2 + gutter;
      const h = Math.round((it.height / it.width) * w);
      const left = gutter + bestStart * (colW + gutter);
      const top = bestTop;

      nodes.push({ id: it.id, left, top, width: w, height: h });
      const newTop = top + h + gutter;
      colHeights[bestStart] = newTop;
      colHeights[bestStart + 1] = newTop; // lock both columns to same height
    };

    items.forEach((it, idx) => {
      const span = Math.min(getColumnSpan(it, idx), numColumns);
      if (span === 2) placeSpan2(it);
      else placeSpan1(it);
    });

    const neededHeight = Math.max(...colHeights, gutter);
    return { nodes, neededHeight };
  }, [items, boardWidth, numColumns, gutter, getColumnSpan]);

  // tell parent if height needs to grow
  useEffect(() => {
    if (onBoardSize && layout.neededHeight && layout.neededHeight !== boardHeight) {
      onBoardSize(boardWidth, layout.neededHeight);
    }
  }, [layout.neededHeight, onBoardSize, boardWidth, boardHeight]);

  return (
    <View style={{ width: boardWidth, height: Math.max(boardHeight, layout.neededHeight) }}>
      {layout.nodes.map((n) => (
        <View
          key={n.id}
          style={[
            styles.cell,
            { left: n.left, top: n.top, width: n.width, height: n.height },
          ]}
        >
          {renderItem(items.find((x) => x.id === n.id)!)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    position: "absolute",
    overflow: "hidden",
    borderRadius: 10, // looks nicer with posters
    backgroundColor: "#00000009",
  },
});
