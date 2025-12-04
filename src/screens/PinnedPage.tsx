import React, { useMemo, useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import PanBoard from "../components/PanBoard";
import PackedScatterGrid, { ScatterItem } from "../components/PackedScatterGrid";
import BulletinPoster, { posterToSize, PosterData } from "../components/BulletinPoster";
import { fetchPosters } from "../components/posters";

export default function PinnedPage() {
  const [ALL_POSTERS, setPosters] = useState<PosterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load posters from backend
  useEffect(() => {
    (async () => {
      try {
        const posters = await fetchPosters();
        setPosters(posters);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Failed to load posters");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const POSTERS_BY_ID = useMemo(
    () => Object.fromEntries(ALL_POSTERS.map((p) => [p.id, p])),
    [ALL_POSTERS]
  );

  const items: ScatterItem[] = useMemo(
    () =>
      ALL_POSTERS
        .map((poster) => {
          const { width, height } = posterToSize(poster);
          return { id: poster.id, width, height };
        })
        .sort((a, b) => b.width * b.height - a.width * a.height),
    [ALL_POSTERS]
  );

  const [canvas, setCanvas] = useState({ w: 2000, h: 2000 });
  const [viewport, setViewport] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [contentReady, setContentReady] = useState(false);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: "white" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PanBoard
        canvasWidth={canvas.w}
        canvasHeight={canvas.h}
        onViewportChange={setViewport}
        enabled={contentReady}
      >
        <PackedScatterGrid
          items={items}
          spacing={8}
          compactness={0.25}
          padding={80}
          visibleRect={viewport ?? undefined}
          renderDistance={300}
          onContentSize={(w, h) => {
            const nextW = Math.max(canvas.w, w);
            const nextH = Math.max(canvas.h, h);
            if (nextW !== canvas.w || nextH !== canvas.h) setCanvas({ w: nextW, h: nextH });
            if (!contentReady) setContentReady(true);
          }}
          renderItem={(node) => {
            const data = POSTERS_BY_ID[node.id];
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
  center: { justifyContent: "center", alignItems: "center" },
});
