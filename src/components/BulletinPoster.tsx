// components/BulletinPoster.tsx
import React, { useRef } from "react";
import { Animated, TouchableOpacity, StyleSheet, Image } from "react-native";

type PosterProps = {
  title?: string; // Just to keep track of what the poster is about
  onPress: () => void;
  image: number | { uri: string };
  height?: number;
  width?: number;
};

export default function BulletinPoster({
  image,
  title,
  onPress,
  height,
  width,
}: PosterProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.96, friction: 3, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.wrap, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={0.9} // 
      >
        <Image
          source={image}
          style={[
            styles.img,
            width && height ? { width, height } : { width: "100%", height: "100%" }, // if there's a set width/height, keep it, else, set width/height to 100%
          ]}
           // If you want the image sizes to be similar to the
           // original image file and not adhereing to the 2:3 ratio,
           // then change the mode to cover instead of stretch
          resizeMode="stretch"
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 0, overflow: "hidden" },
  img: { borderRadius: 0 }, // Soleil said to have sharper poster edges
});
