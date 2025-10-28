// screens/PinnedPage.tsx
import React, { useMemo, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import PanBoard from "../components/PanBoard";
import BulletinPoster from "../components/BulletinPoster";
import PackedScatterGrid, { ScatterItem } from "../components/PackedScatterGrid";

const { width: winW } = Dimensions.get("window");

export default function PinnedPage() {
  // Simulated data: use these as intrinsic sizes (aspect ratio).
  const posters: ScatterItem[] = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => {
        // Pretend originals are ~2:3 ratio but vary a bit
        const w = 2 + Math.random() * 0.4;   // intrinsic width units
        const h = 3 + Math.random() * 0.5;   // intrinsic height units
        return { id: String(i), width: w, height: h };
      }),
    []
  );

  // Board width = viewport width; height grows with content
  const [board, setBoard] = useState({ w: winW, h: 1200 });

  return (
    <View style={styles.container}>
      <PanBoard boardWidth={board.w} boardHeight={board.h}>
        <PackedScatterGrid
          items={posters}
          boardWidth={board.w}
          boardHeight={board.h}
          numColumns={3}
          gutter={12}
          // make every 6th item a hero that spans 2 columns (tweak to taste)
          getColumnSpan={(_, i) => (i % 6 === 0 ? 2 : 1)}
          onBoardSize={(w, h) => setBoard((cur) => (cur.h === h && cur.w === w ? cur : { w, h }))}
          renderItem={() => (
            <BulletinPoster
              image={require("../../assets/tempposter.png")}
              onPress={() => {}}
              // no width/height -> it will fill the computed cell
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
