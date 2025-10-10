import React, { useRef } from "react";
import { Animated, TouchableOpacity, Text, StyleSheet } from 'react-native';

// ! REVIEW NEEDED

type MyButtonProps = {
  title: string;
  onPress: () => void;
  image?: any;
};

export default function MyButton({ title, onPress }: MyButtonProps) {
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
        style={styles.button}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}


const styles = StyleSheet.create({
  button: {
    backgroundColor: '#cfb991',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    margin: 10,
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  image: {
    width: 24,
    height: 24, 
    marginRight: 8,
  },
  text: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: "Arial"
  },
});
