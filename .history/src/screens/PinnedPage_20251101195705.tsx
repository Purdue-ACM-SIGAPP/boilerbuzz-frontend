// screens/PinnedPage.tsx
import React, { useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import PanBoard from "../components/PanBoard";
import PackedScatterGrid, { ScatterItem } from "../components/PackedScatterGrid";
import BulletinPoster, { likesToSize, makeRandomPosters, PosterData } from "../components/BulletinPoster";
import { EXAMPLE_POSTERS } from "../components/ExamplePosters";

// For now, the board doesn't render poster at once.
// It determines the placement of posters, then renders posters
// while the user is panning through the board

export default function PinnedPage() {


  // This array will contain the elements of example posters and 50 additional filler posters
  const MANY_POSTERS: PosterData[] = useMemo(() => { // useMemo() for cacheing
    const filler = makeRandomPosters(EXAMPLE_POSTERS.length, 450); // the integer value is how many random posters to make
    return [...EXAMPLE_POSTERS, ...filler]; 
  }, []);

  // Making a hash map to get poster data from id
  const POSTERS_BY_ID = useMemo(
    () => Object.fromEntries(MANY_POSTERS.map((poster) => [poster.id, poster])),
    [MANY_POSTERS]
  );

  // Grid items
  const items: ScatterItem[] = useMemo(
    () =>
      MANY_POSTERS // you can replace this with any other poster array like EXAMPLE_POSTERS
        .map((poster) => { // width and height determined by likes
          const { width, height } = likesToSize(poster.likes);
          return { id: poster.id, width, height };
        })
        // Place bigger posters first so center is denser
        .sort((a, b) => b.width * b.height - a.width * a.height),
    [MANY_POSTERS]
  );

  // 4) Canvas (pannable area). We’ll let the grid tell us how big it needs to be.
  const [canvas, setCanvas] = useState({ w: 2000, h: 2000 });
  const [viewport, setViewport] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [contentReady, setContentReady] = useState(false);
  return (
    <View style={styles.container}>
      <PanBoard 
        canvasWidth={canvas.w}
        canvasHeight={canvas.h}
        onViewportChange={setViewport}
        enabled={contentReady}>
        <PackedScatterGrid
          items={items}
          spacing={8}
          compactness={0.25}
          padding={80}
          visibleRect={viewport ?? undefined}
          overscan={500} // how far to pre-render images during panning
          onContentSize={(w, h) => {
            const nextW = Math.max(canvas.w, w);
            const nextH = Math.max(canvas.h, h);
            if (nextW !== canvas.w || nextH !== canvas.h) setCanvas({ w: nextW, h: nextH });
            if (!contentReady) setContentReady(true);
          }}
          renderItem={(node) => {
            const meta = POSTERS_BY_ID[node.id];
            return (
              <BulletinPoster
                meta={meta}
                width={node.width}
                height={node.height}
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
