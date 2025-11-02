// screens/PinnedPage.tsx
import React, { useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import PanBoard from "../components/PanBoard";
import PackedScatterGrid, { ScatterItem } from "../components/PackedScatterGrid";
import BulletinPoster, { likesToSize, makeRandomPosters, PosterMeta } from "../components/BulletinPoster";
import { EXAMPLE_POSTERS } from "../components/ExamplePosters";

export default function PinnedPage() {
  // 1) Build the complete poster list (example + filler for demo fullness)
  const ALL_POSTERS: PosterMeta[] = useMemo(() => {
    const filler = makeRandomPosters(EXAMPLE_POSTERS.length, 50, 1337);
    return [...EXAMPLE_POSTERS, ...filler];
  }, []);

  // 2) Fast lookup by id
  const POSTERS_BY_ID = useMemo(
    () => Object.fromEntries(ALL_POSTERS.map((p) => [p.id, p])),
    [ALL_POSTERS]
  );

  // 3) Grid items (sizes derived from likes by using BulletinPoster's helper)
  const items: ScatterItem[] = useMemo(
    () =>
      ALL_POSTERS
        .map((p) => {
          const { width, height } = likesToSize(p.likes);
          return { id: p.id, width, height };
        })
        // Place bigger first so center is denser
        .sort((a, b) => b.width * b.height - a.width * a.height),
    [ALL_POSTERS]
  );

  // 4) Canvas (pannable area). We’ll let the grid tell us how big it needs to be.
  const [canvas, setCanvas] = useState({ w: 2000, h: 2000 });

  return (
    <View style={styles.container}>
      <PanBoard canvasWidth={canvas.w} canvasHeight={canvas.h}>
        <PackedScatterGrid
          items={items}
          spacing={8}
          compactness={0.25}
          seed={42}
          padding={80}
          onContentSize={(w, h) => {
            const nextW = Math.max(canvas.w, w);
            const nextH = Math.max(canvas.h, h);
            if (nextW !== canvas.w || nextH !== canvas.h) setCanvas({ w: nextW, h: nextH });
          }}
          renderItem={(node) => {
            const meta = POSTERS_BY_ID[node.id];
            return (
              <BulletinPoster
                meta={meta}
                width={node.width}
                height={node.height}
                // autoNavigate default is true; pass false if you want to control onPress
              />
            );
          }}
        />
      </PanBoard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0c" },
});
