// PinnedPage.tsx
import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import PanBoard from "../components/PanBoard";
import BulletinPoster from "../components/BulletinPoster";
import PackedScatterGrid, { ScatterItem } from "../components/PackedScatterGrid";

export default function PinnedPage() {
  const posters = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => {
        const likes = Math.floor(Math.random() * 600) + 10;
        const minH = 110, maxH = 240;
        const t = Math.min(1, Math.sqrt(likes) / Math.sqrt(600));
        const h = Math.round(minH + t * (maxH - minH));
        const w = Math.round(h * (2 / 3));
        return { id: String(i), width: w, height: h } as ScatterItem;
      }),
    []
  );

  const boardWidth = 2000;
  const boardHeight = 2000;

  return (
    <View style={styles.container}>
      <PanBoard boardWidth={2000} boardHeight={2000}>
  <PackedScatterGrid
    items={posters /* [{ id, width, height }, ...] */}
    boardWidth={2000}
    boardHeight={2000}
    minSpacing={15}
    // cellSize={96} // optional: tune for your item sizes
    seed={42}
    renderItem={(it) => (
      <BulletinPoster
        image={require("../../assets/tempposter.png")}
        width={it.width}
        height={it.height}
        onPress={() => {}}
      />
    )}
  />
</PanBoard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0c" },
});
