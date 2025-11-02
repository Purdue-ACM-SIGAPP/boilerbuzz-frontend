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


  // This array will contain the elements of 10 example posters and 450 additional filler posters
  const ALL_POSTERS: PosterData[] = useMemo(() => { // useMemo() for cacheing
    const filler = makeRandomPosters(EXAMPLE_POSTERS.length, 490); // the integer value is how many random posters to make
    return [...EXAMPLE_POSTERS, ...filler]; 
  }, []);

  // const ALL_POSTERS: PosterData[] = useMemo(() => EXAMPLE_POSTERS, []); 
  


  // Making a hash map to get poster data from id
  const POSTERS_BY_ID = useMemo(
    () => Object.fromEntries(ALL_POSTERS.map((poster) => [poster.id, poster])),
    [ALL_POSTERS]
  );

  // Convert posters to items for scattergrid
  const items: ScatterItem[] = useMemo(
    () =>
      ALL_POSTERS
        .map((poster) => { // convert likes to width/height
          const { width, height } = likesToSize(poster.likes);
          return { id: poster.id, width, height };
        })
        // Place bigger posters first so center is denser
        .sort((a, b) => b.width * b.height - a.width * a.height),
    [ALL_POSTERS]
  );

  // 4) Canvas (pannable area).
  const [canvas, setCanvas] = useState({ w: 2000, h: 2000 }); // canvas size
  const [viewport, setViewport] = useState<{ x: number; y: number; w: number; h: number } | null>(null); //viewport/rendered area
  const [contentReady, setContentReady] = useState(false); // Make sure posters are ready before panning
  return (
    <View style={styles.container}>
      <PanBoard 
        canvasWidth={canvas.w}
        canvasHeight={canvas.h}
        onViewportChange={setViewport} // recieve updates on if viewport/rendered area changes
        enabled={contentReady} // disable panning until ready
        > 
        <PackedScatterGrid
          items={items} // get poster dimensions and id
          spacing={8} // spacing between posters in px
          compactness={0.25} // how tight posters are packed. lower -> tighter packing
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
