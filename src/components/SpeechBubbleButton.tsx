// src/components/SpeechBubbleButton.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  GestureResponderEvent,
  ViewStyle,
} from "react-native";
import theme from "../theme";

type Props = {
  isLeft?: boolean;
  isRight?: boolean;
  label: string;
  icon?: any; // image source or React element / svg component
  onPress: (e?: GestureResponderEvent) => void;
  size?: number; // diameter of bubble
  style?: ViewStyle;
};

export default function SpeechBubbleButton({
  isLeft = false,
  isRight = false,
  label,
  icon,
  onPress,
  size = 140,
  style,
}: Props) {
  const bubbleStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  // tail placement offset (centered at bottom of bubble)
  const tailLeft = size / 2 - 18;

  return (
    <View
      style={[
        styles.wrapper,
        isLeft ? { marginRight: 12 } : undefined,
        isRight ? { marginLeft: 12 } : undefined,
        style,
      ]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[styles.bubble, bubbleStyle]}
      >
        {icon ? (
          // support: SVG component, JSX element, local require, or uri string
          React.isValidElement(icon) ? (
            icon
          ) : typeof icon === "function" ? (
            // svg component import (pass size)
            React.createElement(icon, { width: 56, height: 56 })
          ) : typeof icon === "number" ? (
            <Image source={icon} style={styles.icon} resizeMode="contain" />
          ) : (
            <Image
              source={{ uri: icon }}
              style={styles.icon}
              resizeMode="contain"
            />
          )
        ) : (
          <Text style={styles.emoji}>📅</Text>
        )}

        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bubble: {
    backgroundColor: theme.colors.highlight,
    borderWidth: 1,
    borderColor: theme.colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  icon: {
    width: 56,
    height: 56,
    marginBottom: 8,
    // tints don't always apply to svgs, but keep it for PNGs
    tintColor: theme.colors.darkGrey,
  },
  emoji: {
    fontSize: 44,
    marginBottom: 6,
  },
  label: {
    fontFamily: theme.fonts.body,
    fontSize: 16,
    color: theme.colors.darkGrey,
    marginTop: 4,
  },
});
