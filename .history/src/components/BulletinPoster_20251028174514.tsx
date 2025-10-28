// BulletinPoster.tsx
import React, { useRef } from "react";
import { Animated, TouchableOpacity, StyleSheet, Image } from "react-native";

type PosterProps = {
  title?: string;
  onPress: () => void;
  image: number | { uri: string };
  height?: number;
  width?: number;
};

export default function BulletinPoster({ 
  image, 
  title, 
  onPress, 
  height = 200, 
  width = 150 
}: PosterProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
  <Animated.View style={[styles.wrap, { transform: [{ scale }] }]}>
    <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress} activeOpacity={0.9}>
      <Image style={{ width, height }} source={image} />
    </TouchableOpacity>
  </Animated.View>
);

}

// BulletinPoster.tsx (styles)
const styles = StyleSheet.create({
  wrap: { borderRadius: 10, overflow: "hidden" },   // ensure content stays inside cell
  poster: { borderRadius: 10 },                     // <- no margin here
});

