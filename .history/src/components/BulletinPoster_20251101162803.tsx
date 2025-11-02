// components/PosterBoard.tsx
import React, { useMemo, useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { ImageSourcePropType } from "react-native";

import PanBoard from "./PanBoard";
import PackedScatterGrid, { ScatterItem } from "./PackedScatterGrid";
import BulletinPoster from "./BulletinPoster";

import type { BottomTabsParamList, RootStackParamList } from "../navigation/types";
import { EXAMPLE_POSTERS } from "./ExamplePosters";

/** ---- Types that ExamplePosters.ts also uses ---- */
export type PosterLink =
  | { type: "tab"; name: keyof BottomTabsParamList; params?: object }
  | { type: "stack"; name: keyof RootStackParamList; params?: object };

export type PosterMeta = {
  id: string;
  title: string;
  image: ImageSourcePropType;
  likes: number;
  link: PosterLink;
};

/** ---- Local utilities that used to live in ExamplePosters.ts ---- */

/** Map "likes" to pixel size (kept here so ExamplePosters is data-only). */
function likesToSize(likes: number) {
  const minHeight = 110;
  const maxHeight = 240;
  const scale = Math.min(1, Math.sqrt(likes) / Math.sqrt(600));
  const height = Math.round(minHeight + scale * (maxHeight - minHeight));
  const width = Math.round((2 / 3) * height);
  return { width, height };
}

/** Tiny deterministic PRNG for demo filler posters. */
function prng(seed: number) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

/** Demo-only filler posters (kept here; ExamplePosters stays dumb). */
function makeRandomPosters(baseCount: number, count: number, seed = 42): PosterMeta[] {
  const rnd = prng(seed);
  const out: PosterMeta[] = [];
  for (let i = 0; i < count; i++) {
    const likes = 10 + Math.floor(rnd() * 600);
    out.push({
      id: `g${baseCount + i + 1}`,
      title: `Sample Poster ${baseCount + i + 1}`,
      image: require("../../assets/tempposter.png"),
      likes,
      link: { type: "tab", name: "Trending" },
    });
  }
  return out;
}

/** ---- Component ---- */

type PosterBoardProps = {
  /** You can pass your own meta list, otherwise we use EXAMPLE_POSTERS. */
  posters?: PosterMeta[];
  /** How many demo filler posters to generate (0 for none). */
  fillerCount?: number;
  fillerSeed?: number;
  /** Spacing between posters inside the grid. */
  spacing?: number;
  /** Lower = tighter packing; higher = looser. */
  compactness?: number;
  /** Visual padding around the cluster for nicer centering. */
  canvasPadding?: number;
};

export default function PosterBoard({
  posters = EXAMPLE_POSTERS,
  fillerCount = 50,
  fillerSeed = 1337,
  spacing = 8,
  compactness = 0.25,
  canvasPadding = 80,
}: PosterBoardProps) {
  const tabNav = useNavigation<BottomTabNavigationProp<BottomTabsParamList>>();
  const rootNav = tabNav.getParent<NavigationProp<RootStackParamList>>();

  // Combine example + filler (for demo fullness)
  const allPosters: PosterMeta[] = useMemo(() => {
    const filler = fillerCount > 0 ? makeRandomPosters(posters.length, fillerCount, fillerSeed) : [];
    return [...posters, ...filler];
  }, [posters, fillerCount, fillerSeed]);

  // Build quick lookup and the sized ScatterItems used by the grid
  const { byId, items }: { byId: Record<string, PosterMeta>; items: ScatterItem[] } = useMemo(() => {
    const map = Object.fromEntries(allPosters.map((p) => [p.id, p]));
    const sized: ScatterItem[] = allPosters.map((p) => {
      const { width, height } = likesToSize(p.likes);
      return { id: p.id, width, height };
    });
    // Place bigger items first so the center is dense
    sized.sort((a, b) => b.width * b.height - a.width * a.height);
    return { byId: map, items: sized };
  }, [allPosters]);

  // The "canvas" is the panned area inside PanBoard. We size it to the grid content.
  const [canvas, setCanvas] = useState({ w: 2000, h: 2000 });

  const handleGridContentSize = useCallback(
    (contentW: number, contentH: number) => {
      // Add padding around the cluster for nicer centering and breathing room.
      const w = Math.max(canvas.w, Math.ceil(contentW + canvasPadding * 2));
      const h = Math.max(canvas.h, Math.ceil(contentH + canvasPadding * 2));
      if (w !== canvas.w || h !== canvas.h) setCanvas({ w, h });
    },
    [canvas, canvasPadding]
  );

  const handlePosterPress = useCallback(
    (id: string) => {
      const meta = byId[id];
      if (!meta) return;
      const link = meta.link;
      if (link.type === "tab") {
        tabNav.navigate(link.name as any, link.params as any);
      } else {
        rootNav?.navigate(link.name as any, link.params as any);
      }
    },
    [byId, tabNav, rootNav]
  );

  return (
    <View style={styles.container}>
      {/* PanBoard just pans whatever "canvas" you give it; it doesn't know about grids. */}
      <PanBoard canvasWidth={canvas.w} canvasHeight={canvas.h} backgroundColor="#faf7ef">
        {/* PackedScatterGrid lays out absolutely-positioned children and reports size. */}
        <PackedScatterGrid
          items={items}
          spacing={spacing}
          compactness={compactness}
          seed={42}
          onContentSize={handleGridContentSize}
          padding={canvasPadding}
          renderItem={(node) => {
            const poster = byId[node.id];
            return (
              <BulletinPoster
                title={poster?.title}
                image={poster?.image ?? require("../../assets/tempposter.png")}
                width={node.width}
                height={node.height}
                onPress={() => handlePosterPress(node.id)}
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
