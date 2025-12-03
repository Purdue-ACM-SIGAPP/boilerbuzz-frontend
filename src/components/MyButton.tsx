import React, { useRef } from "react";
import {
  Animated,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import theme from "../theme";

type MyButtonProps = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function MyButton({
  title,
  onPress,
  style,
  textStyle,
}: MyButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.button, style]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#F6A21A", // orange pill like your design (keeps theme for other colors)
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 999, // pill
    marginHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    // shadow for iOS
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    // elevation for Android
    elevation: 3,
  },
  text: {
    color: "#000000",
    fontSize: 20,
    // prefer heading font for large button text if available
    fontFamily: theme.fonts.body,
    includeFontPadding: false,
  },
});
