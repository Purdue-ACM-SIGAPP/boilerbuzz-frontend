// src/components/AddPopup.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  GestureResponderEvent,
} from "react-native";
import SpeechBubbleButton from "./SpeechBubbleButton";
import theme from "../theme";

type Props = {
  visible: boolean;
  onClose?: () => void;
  onAddEvent?: (e?: GestureResponderEvent) => void;
  onAddClub?: (e?: GestureResponderEvent) => void;
  // optional custom icons
  leftIcon?: any;
  rightIcon?: any;
};

export default function AddPopup({
  visible,
  onClose,
  onAddEvent,
  onAddClub,
  leftIcon,
  rightIcon,
}: Props) {
  const anim = useRef(new Animated.Value(0)).current; // 0 hidden, 1 visible

  useEffect(() => {
    Animated.spring(anim, {
      toValue: visible ? 1 : 0,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [visible, anim]);

  // opacity and translateY
  const opacity = anim;
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });
  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  if (!visible) {
    // keep in tree for animation, but you can early return (we keep it so overlay onClose works)
  }

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <Animated.View
        pointerEvents={visible ? "auto" : "none"}
        style={[
          styles.overlay,
          {
            opacity,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY }, { scale }],
            },
          ]}
        >
          {/* Left bubble (Add Event) */}
          <SpeechBubbleButton
            isLeft
            label="Event"
            icon={leftIcon ?? "calendar"}
            onPress={onAddEvent ?? (() => console.log("Add Event"))}
            style={styles.leftBubble}
          />

          {/* Right bubble (Add Club) */}
          <SpeechBubbleButton
            isRight
            label="Club"
            icon={rightIcon ?? "club"}
            onPress={onAddClub ?? (() => console.log("Add Club"))}
            style={styles.rightBubble}
          />
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    // allow touches outside to close
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  container: {
    width: "100%",
    // place the bubbles just above a bottom tab bar height ~82 px
    paddingBottom: 86,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  leftBubble: {
    marginRight: 34,
    // shift left a bit to match screenshot
    transform: [{ translateX: -48 }],
  },
  rightBubble: {
    marginLeft: 34,
    transform: [{ translateX: 48 }],
  },
});
