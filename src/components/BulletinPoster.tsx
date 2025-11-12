import React, { useRef } from "react";
import { Animated, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NavigationProp } from "@react-navigation/native";
import type {
  BottomTabsParamList,
  RootStackParamList,
} from "../navigation/types";

/**
 * PosterLink — Describes where a poster navigates when tapped.
 * It can point to a tab or a stack screen.
 */
export type PosterLink =
  | { type: "tab"; name: keyof BottomTabsParamList; params?: object }
  | { type: "stack"; name: keyof RootStackParamList; params?: object };

/**
 * PosterData — The data model for a single poster.
 */
export type PosterData = {
  id: string;
  title: string;
  image: number | { uri: string }; // supports both local and remote images
  likes: number;
  link: PosterLink;
};

/**
 * Maps number of likes → poster size (height/width).
 * Produces a natural scaling effect in a grid layout.
 */
export function likesToSize(likes: number) {
  const minHeight = 120;
  const maxHeight = 280;

  const scale = Math.min(1, Math.sqrt(likes) / Math.sqrt(1200));
  const height = Math.round(minHeight + scale * (maxHeight - minHeight));
  const width = Math.round((2 / 3) * height); // Standard 2:3 poster ratio

  return { width, height };
}

/**
 * Generates a list of random posters using placeholder images from Picsum.
 */
export function makeRandomPosters(
  baseCount: number,
  howMany: number
): PosterData[] {
  return Array.from({ length: howMany }, (_, i) => {
    const id = String(baseCount + i + 1);
    const likes = 10 + Math.floor(Math.random() * 1000);

    return {
      id,
      title: `Sample Poster ${id}`,
      image: {
        uri: `https://picsum.photos/seed/${encodeURIComponent(id)}/400/600`,
      },
      likes,
      link: { type: "tab", name: "Trending" },
    };
  });
}

type Props = {
  data: PosterData;
  width: number;
  height: number;
  autoNavigate?: boolean; // whether pressing the poster navigates automatically
  onPressAfterNavigate?: (data: PosterData) => void; // optional callback after navigation
};

/**
 * BulletinPoster — Displays a single poster with spring animation and navigation.
 */
export default function BulletinPoster({
  data,
  width,
  height,
  autoNavigate = true,
  onPressAfterNavigate,
}: Props) {
  const tabNav = useNavigation<BottomTabNavigationProp<BottomTabsParamList>>();
  const rootNav = tabNav.getParent<NavigationProp<RootStackParamList>>();
  const scale = useRef(new Animated.Value(1)).current;

  /**
   * Animations
   */
  const springTo = (toValue: number) =>
    Animated.spring(scale, {
      toValue,
      friction: 3,
      useNativeDriver: true,
    }).start();

  /**
   * Navigation Logic
   */
  const handlePress = () => {
    if (autoNavigate) {
      const { link } = data;

      if (link.type === "tab") {
        tabNav.navigate(link.name as any, link.params as any);
      } else {
        rootNav?.navigate(link.name as any, link.params as any);
      }
    }

    onPressAfterNavigate?.(data);
  };

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPressIn={() => springTo(0.96)}
        onPressOut={() => springTo(1)}
        onPress={handlePress}
        activeOpacity={0.9}
        accessibilityLabel={data.title}
      >
        <Image
          source={data.image}
          style={[styles.image, { width, height }]}
          resizeMode="stretch" // use "contain" to preserve original aspect ratio
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 0,
    overflow: "hidden",
  },
  image: {
    borderRadius: 0,
  },
});
