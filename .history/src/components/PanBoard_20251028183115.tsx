// src/components/PanBoard.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, LayoutChangeEvent, Animated } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type Props = {
  children: React.ReactNode;
  boardWidth?: number;   // fixed canvas size
  boardHeight?: number;
};

export default function PanBoard({
  children,
  boardWidth = 2000,
  boardHeight = 2000,
}: Props) {
  const [vp, setVp] = useState({ w: 0, h: 0 });     // measured viewport under your header
  const tx = useRef(new Animated.Value(0)).current;  // live translate X (JS Animated)
  const ty = useRef(new Animated.Value(0)).current;  // live translate Y
  const last = useRef({ x: 0, y: 0 });               // accumulated offset

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== vp.w || height !== vp.h) setVp({ w: width, h: height });
  };

  // Compute centered start + clamped bounds from fixed board + measured viewport
  const metrics = useMemo(() => {
    if (!vp.w || !vp.h) return null;
    const START_X = -(boardWidth - vp.w) / 2;
    const START_Y = -(boardHeight - vp.h) / 2;
    const MIN_X = vp.w - boardWidth; // leftmost (right edge aligns)
    const MAX_X = 0;                 // rightmost (left edge aligns)
    const MIN_Y = vp.h - boardHeight;
    const MAX_Y = 0;
    return { START_X, START_Y, MIN_X, MAX_X, MIN_Y, MAX_Y };
  }, [vp, boardWidth, boardHeight]);

  // Initialize centered
  useEffect(() => {
    if (!metrics) return;
    tx.setValue(metrics.START_X);
    ty.setValue(metrics.START_Y);
    last.current = { x: metrics.START_X, y: metrics.START_Y };
  }, [metrics]);

  const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

  // Build pan gesture (run on JS thread; no Reanimated needed)
  const pan = useMemo(() => {
    if (!metrics) return Gesture.Pan();
    return Gesture.Pan()
      .runOnJS(true)                       // force JS callbacks (no worklets needed)
      .activeOffsetX([-6, 6])              // small drag threshold so taps still work
      .activeOffsetY([-6, 6])
      .onUpdate((e) => {
        const nx = clamp(last.current.x + e.translationX, metrics.MIN_X, metrics.MAX_X);
        const ny = clamp(last.current.y + e.translationY, metrics.MIN_Y, metrics.MAX_Y);
        tx.setValue(nx);
        ty.setValue(ny);
      })
      .onEnd((e) => {
        const nx = clamp(last.current.x + e.translationX, metrics.MIN_X, metrics.MAX_X);
        const ny = clamp(last.current.y + e.translationY, metrics.MIN_Y, metrics.MAX_Y);
        last.current = { x: nx, y: ny };
        tx.setValue(nx);
        ty.setValue(ny);
      })
      .shouldCancelWhenOutside(false);
  }, [metrics, tx, ty]);

  if (!metrics) return <View style={styles.container} onLayout={onLayout} />;

  return (
    <View style={styles.container} onLayout={onLayout}>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.board,
            {
              width: boardWidth,
              height: boardHeight,
              transform: [{ translateX: tx }, { translateY: ty }],
            },
          ]}
        >
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: "hidden" },
  board: {
    backgroundColor: "#faf7ef",
  },
});
