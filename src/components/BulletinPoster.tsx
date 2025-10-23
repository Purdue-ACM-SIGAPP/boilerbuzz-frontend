// BulletinPoster.tsx
import React, { useRef } from "react";
import { Animated, TouchableOpacity, Text, StyleSheet, Image } from "react-native";


type posterProps = {
  title?: string;
  onPress: () => void;
  image?: any;
};

export default function BulletinPoster({ image, title, onPress }: posterProps) {
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
        <Image style={styles.poster}
            source={require('../../assets/templogo.png')}
            />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  poster: {
    width: 100,
    height: 100,
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
