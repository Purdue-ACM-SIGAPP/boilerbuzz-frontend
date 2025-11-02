// components/BulletinPoster.tsx
import React, { useRef } from "react";
import { Animated, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NavigationProp } from "@react-navigation/native";
import type { BottomTabsParamList, RootStackParamList } from "../navigation/types";

// 
export type PosterLink =
  | { type: "tab"; name: keyof BottomTabsParamList; params?: object }
  | { type: "stack"; name: keyof RootStackParamList; params?: object };

export type PosterData = {
  id: string;
  title: string;
  image: number | { uri: string };
  likes: number;
  link: PosterLink;
};

// Map likes to size for the grid layout.
export function likesToSize(likes: number) {
  const minHeight = 120;
  const maxHeight = 240;
  const scale = Math.min(1, Math.sqrt(likes) / Math.sqrt(600));
  const height = Math.round(minHeight + scale * (maxHeight - minHeight));
  const width = Math.round((2 / 3) * height); // width is 2/3 the height, which is the standard poster size right?
  return { width, height };
}


// Make filler posters
export function makeRandomPosters(baseCount: number, howMany: number): PosterData[] {
  const out: PosterData[] = [];
  for (let i = 0; i < howMany; i++) {
    const id = String(baseCount + i + 1); // making sure id doesn't collide with existing id's
    const likes = 10 + Math.floor(Math.random() * 1000);

    out.push({
      id,
      title: `Sample Poster ${id}`,
      image: { uri: `https://picsum.photos/seed/${encodeURIComponent(id)}/400/600` }, 
      likes,
      link: { type: "tab", name: "Trending" },
    });
  }
  return out;
}



/* 
 * Poster component
 * Renders a poster image with a small press animation.
 * On press, will auto-navigate using meta.link unless autoNavigate={false}.
 * Width/height are provided by the grid (so layout happens before render).
 */

type Props = {
  meta: PosterData;
  width: number;
  height: number;
  autoNavigate?: boolean;
  onPressAfterNavigate?: (meta: PosterData) => void;
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
          // Stretch forces the ratio into 2:3, but if you guys
          // ever want to preserve the original size of the posters,
          // you can use 'contain' instead of 'stretch'
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
