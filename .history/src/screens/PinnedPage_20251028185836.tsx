// screens/PinnedPage.tsx
import React, { useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import PanBoard from "../components/PanBoard";
import BulletinPoster from "../components/BulletinPoster";
import PackedScatterGrid, { ScatterItem } from "../components/PackedScatterGrid";

export default function PinnedPage() {

  // This is irrelevant, just filling space with random sized posters
  const posters = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => {
        const likes = Math.floor(Math.random() * 600) + 10;
        const minH = 110, maxH = 240;
        const t = Math.min(1, Math.sqrt(likes) / Math.sqrt(600));
        const h = Math.round(minH + t * (maxH - minH));
        const w = Math.round(h * (2 / 3));
        return { id: String(i), width: w, height: h } as ScatterItem;
      }),
    []
  );

  // Board size is 2000 x 2000 px
  const [board, setBoard] = useState({ w: 2000, h: 2000 });

  return (
    <View style={styles.container}>
      <PanBoard boardWidth={board.w} boardHeight={board.h}>
        <PackedScatterGrid
          items={posters}
          boardWidth={board.w}
          boardHeight={board.h}
          minSpacing={5}
          seed={42}
          onBoardSize={(w, h) => setBoard((cur) => (cur.w === w && cur.h === h ? cur : { w, h }))}
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
