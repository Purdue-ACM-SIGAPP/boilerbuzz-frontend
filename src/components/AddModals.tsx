// src/components/AddModals.tsx
import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  GestureResponderEvent,
  Platform,
} from "react-native";
import SpeechBubbleButton from "./SpeechBubbleButton";
import theme from "../theme";

type Props = {
  visible: boolean;
  onClose?: () => void;
  onAddEvent?: (e?: GestureResponderEvent) => void;
  onAddClub?: (e?: GestureResponderEvent) => void;
  leftIcon?: any;
  rightIcon?: any;
  // diameter optional
  size?: number;
};

export default function AddModals({
  visible,
  onClose,
  onAddEvent,
  onAddClub,
  leftIcon,
  rightIcon,
  size = 140,
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* outer overlay: touching it will close via TouchableWithoutFeedback */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* inner container holds the two bubble buttons above the tab bar */}
          <View style={styles.container}>
            <View style={styles.bubbleWrapper}>
              <SpeechBubbleButton
                isLeft
                label="Event"
                icon={leftIcon ?? "calendar"}
                onPress={(e?: GestureResponderEvent) => {
                  onAddEvent?.(e);
                }}
                size={size}
                style={styles.leftBubble}
              />
            </View>

            <View style={styles.bubbleWrapper}>
              <SpeechBubbleButton
                isRight
                label="Club"
                icon={rightIcon ?? "club"}
                onPress={(e?: GestureResponderEvent) => {
                  onAddClub?.(e);
                }}
                size={size}
                style={styles.rightBubble}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const TAB_HEIGHT = 86; // approximate tab bar height used in your app
const BOTTOM_PADDING = Platform.select({ ios: 18, android: 8 });

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent", // keep it transparent; adjust if you want a dim
    justifyContent: "flex-end",
    alignItems: "center",
  },
  container: {
    width: "100%",
    // position the bubbles just above the bottom tab bar
    paddingBottom: TAB_HEIGHT,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  bubbleWrapper: {
    // wrapper so we can shift left/right easily
    alignItems: "center",
    justifyContent: "center",
  },
  leftBubble: {
    marginRight: 12,
    transform: [{ translateX: -40 }],
  },
  rightBubble: {
    marginLeft: 12,
    transform: [{ translateX: 40 }],
  },
});
