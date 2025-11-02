// components/BulletinPoster.tsx
import React, { useRef } from "react";
import { Animated, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NavigationProp } from "@react-navigation/native";
import type { BottomTabsParamList, RootStackParamList } from "../navigation/types";

/** ---- Types colocated with the poster, so callers only import from here ---- */
export type PosterLink =
  | { type: "tab"; name: keyof BottomTabsParamList; params?: object }
  | { type: "stack"; name: keyof RootStackParamList; params?: object };

export type PosterMeta = {
  id: string;
  title: string;
  image: number | { uri: string };
  likes: number;
  link: PosterLink;
};

/** ---- Utilities that used to be elsewhere (now owned by the poster) ---- */

/** Map "likes" to visual size for the grid layout. */
export function likesToSize(likes: number) {
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

/** Make filler posters for demos; keeps ExamplePosters.ts data-only. */
export function makeRandomPosters(baseCount: number, howMany: number, seed = 42): PosterMeta[] {
  const rnd = prng(seed);
  const out: PosterMeta[] = [];
  for (let i = 0; i < howMany; i++) {
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

/** ---- Poster component ----
 *  - Renders a poster image with a small press animation.
 *  - On press, will auto-navigate using meta.link unless autoNavigate={false}.
 *  - Width/height are provided by the grid (so layout happens before render).
 */
type Props = {
  meta: PosterMeta;
  width: number;
  height: number;
  autoNavigate?: boolean;      // default true
  onPressAfterNavigate?: (meta: PosterMeta) => void; // optional hook after nav
};

export default function BulletinPoster({
  meta,
  width,
  height,
  autoNavigate = true,
  onPressAfterNavigate,
}: Props) {
  const tabNav = useNavigation<BottomTabNavigationProp<BottomTabsParamList>>();
  const rootNav = tabNav.getParent<NavigationProp<RootStackParamList>>();
  const scale = useRef(new Animated.Value(1)).current;

  const springTo = (toValue: number) =>
    Animated.spring(scale, { toValue, friction: 3, useNativeDriver: true }).start();

  const handlePress = () => {
    if (autoNavigate) {
      const { link } = meta;
      if (link.type === "tab") {
        tabNav.navigate(link.name as any, link.params as any);
      } else {
        rootNav?.navigate(link.name as any, link.params as any);
      }
    }
    onPressAfterNavigate?.(meta);
  };

  return (
    <Animated.View style={[styles.wrap, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPressIn={() => springTo(0.96)}
        onPressOut={() => springTo(1)}
        onPress={handlePress}
        activeOpacity={0.9}
        accessibilityLabel={meta.title}
      >
        <Image
          source={meta.image}
          style={[styles.img, { width, height }]}
          // Use "cover" to preserve original aspect, "stretch" to force 2:3
          resizeMode="stretch"
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 0, overflow: "hidden" },
  img: { borderRadius: 0 },
});
