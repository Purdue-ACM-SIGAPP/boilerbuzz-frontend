// screens/PinnedPage.tsx
import React, { useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import PanBoard from "../components/PanBoard";
import PackedScatterGrid, { ScatterItem } from "../components/PackedScatterGrid";
import BulletinPoster, { likesToSize, makeRandomPosters, PosterData } from "../components/BulletinPoster";

// For now, the board doesn't render poster at once.
// It determines the placement of posters, then renders posters
// while the user is panning through the board


// If you want to add more posters, go to ExamplePosters.ts and edit the file

export default function PinnedPage() {


  // This array will contain the elements of 10 example posters and 50 additional filler posters
  const ALL_POSTERS: PosterData[] = useMemo(() => makeRandomPosters(0, 60), []);


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

          padding={80} // padding around grid box

          visibleRect={viewport ?? undefined} // current visible region when panning

          renderDistance={300} // how far to pre-render images off-screen during panning
          
           // Increase canvas size if the final grid's width/height 
           // is bigger than the original 2000x2000 canvas
          onContentSize={(w, h) => {
            const nextW = Math.max(canvas.w, w);
            const nextH = Math.max(canvas.h, h);
            if (nextW !== canvas.w || nextH !== canvas.h) setCanvas({ w: nextW, h: nextH });
            if (!contentReady) setContentReady(true);
          }}

          // rendering each poster item
          renderItem={(node) => {
            const data = POSTERS_BY_ID[node.id]; // look up all poster data
            return (
              <BulletinPoster
                data={data}
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
