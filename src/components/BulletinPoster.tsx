// components/BulletinPoster.tsx
import React, { useRef } from "react";
import { Animated, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NavigationProp } from "@react-navigation/native";
import type { BottomTabsParamList, RootStackParamList } from "../navigation/types";


const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const POSTERS_ENDPOINT = `${API_BASE_URL}/posters`;

function imageAPISrc(img_path: string) {
  if (img_path.startsWith("http://") || img_path.startsWith("https://")) {
    return { uri: img_path };
  }
  return { uri: `${API_BASE_URL}${img_path}` };
}


export type PosterLink =
  | { type: "tab"; name: keyof BottomTabsParamList; params?: object }
  | { type: "stack"; name: keyof RootStackParamList; params?: object };


export type PosterData = {
  id: string;
  club_id: string;
  user_id: string;
  location: string;
  img_path: string;
  date: string;
  likes?: number // i'll just fetch likes when posts are completed
}




function hashString(s: string) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function posterToSize(poster: PosterData) {
  const minHeight = 120;
  const maxHeight = 280;

  const hash = hashString(poster.id + poster.club_id + poster.location);
  const scale = (hash % 1000) / 1000; // 0–0.999

  const height = Math.round(minHeight + scale * (maxHeight - minHeight));
  const width = Math.round((2 / 3) * height);
  return { width, height };
}


// Make filler posters using images from picsum
export function makeRandomPosters(baseCount: number, howMany: number): PosterData[] {
  const out: PosterData[] = [];
  for (let i = 0; i < howMany; i++) {
    const id = String(baseCount + i + 1);
    out.push({
      id,
      club_id: `Sample Club ${id}`,
      user_id: "sample-user",
      location: "Sample Location",
      img_path: `https://picsum.photos/seed/${encodeURIComponent(id)}/400/600`,
      date: new Date().toISOString(),
    });
  }
  return out;
}



/* 
 * Poster component: Renders a poster image
 */

type Props = {
  data: PosterData;
  width: number;
  height: number;
  onPress?: (data: PosterData) => void;
};

export default function BulletinPoster({
  data,
  width,
  height,
  onPress
}: Props) {

  const tabNav = useNavigation<BottomTabNavigationProp<BottomTabsParamList>>();
  const rootNav = tabNav.getParent<NavigationProp<RootStackParamList>>();
  const scale = useRef(new Animated.Value(1)).current;

  // Animation for poster springing up or down when pressed or released
  const springTo = (toValue: number) =>
    Animated.spring(scale, { toValue, friction: 3, useNativeDriver: true }).start();

  // navigates when pressed
  const handlePress = () => {
    onPress?.(data);
  };


  const source = { uri: data.img_path }; // might need to add base url before the path

  // Rendering poster
  return (
    <Animated.View style={[styles.wrap, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPressIn={() => springTo(0.96)}
        onPressOut={() => springTo(1)}
        onPress={handlePress}
        activeOpacity={0.9}
        accessibilityLabel={`${data.club_id} @ ${data.location}`}
      >
        <Image
          source={source}
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


