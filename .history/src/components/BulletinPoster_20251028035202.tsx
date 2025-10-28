// BulletinPoster.tsx
import React, { useRef } from "react";
import { Animated, TouchableOpacity, StyleSheet, Image } from "react-native";

type PosterProps = {
  onPress: () => void;
  image: number | { uri: string };
  height?: number;
  width?: number;
  likes?: number;
};

export default function BulletinPoster({ 
  image,  
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
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Image 
          style={[
            styles.poster, 
            { width, height }
          ]}
          source={image}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  poster: {
    margin: 10,
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Arial",
  },
});
