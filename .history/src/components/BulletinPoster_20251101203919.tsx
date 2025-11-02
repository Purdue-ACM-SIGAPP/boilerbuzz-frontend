// components/BulletinPoster.tsx
import React, { useRef } from "react";
import { Animated, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NavigationProp } from "@react-navigation/native";
import type { BottomTabsParamList, RootStackParamList } from "../navigation/types";

// It looks like posts haven't been completely implemented, 
// so a poster goes to a stack or bottom tab for now
export type PosterLink =
  | { type: "tab"; name: keyof BottomTabsParamList; params?: object }
  | { type: "stack"; name: keyof RootStackParamList; params?: object };

export type PosterData = {
  id: string;
  title: string;
  image: number | { uri: string }; // use a local image or a remote image
  likes: number; 
  link: PosterLink;
};

// Map amount of likes to size for the grid layout.
export function likesToSize(likes: number) {
  const minHeight = 120;
  const maxHeight = 280;
  
  const scale = Math.min(1, Math.sqrt(likes) / Math.sqrt(1200)); // create a scaling factor from 0 to 1
  
  const height = Math.round(minHeight + scale * (maxHeight - minHeight)); // Map likes to height range
  
  const width = Math.round((2 / 3) * height); // width is 2/3 the height, which is the standard poster size right?
  return { width, height };
}


// Make filler posters using images from picsum
export function makeRandomPosters(baseCount: number, howMany: number): PosterData[] {
  const out: PosterData[] = [];
  for (let i = 0; i < howMany; i++) {
    const id = String(baseCount + i + 1); // making sure id doesn't collide with existing id's
    const likes = 10 + Math.floor(Math.random() * 1000);

    out.push({
      id,
      title: `Sample Poster ${id}`,
      image: {uri: `https://picsum.photos/seed/${encodeURIComponent(id)}/400/600`},
      likes,
      link: {type: "tab", name: "Trending"},
    });
  }
  return out;
}



/* 
 * Poster component: Renders a poster image
 */

type Props = {
  data: PosterData; // all data for poster
  width: number;
  height: number;
  autoNavigate?: boolean; // Determines if pressing the poster will nagivate
  onPressAfterNavigate?: (data: PosterData) => void; // call back for poster (potential future feature) 
};

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

  // Animation for poster springing up or down when pressed or released
  const springTo = (toValue: number) =>
    Animated.spring(scale, { toValue, friction: 3, useNativeDriver: true }).start();

  // navigates when pressed
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


  // Rendering poster
  return (
    <Animated.View style={[styles.wrap, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPressIn={() => springTo(0.96)}
        onPressOut={() => springTo(1)}
        onPress={handlePress}
        activeOpacity={0.9}
        accessibilityLabel={data.title}
      >
        <Image
          source={data.image}
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
