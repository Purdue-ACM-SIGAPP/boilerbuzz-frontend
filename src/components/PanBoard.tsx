// src/components/PanBoard.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, LayoutChangeEvent, Animated } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";


/*
 * I couldn't get the library I wanted to work. I'm not too good with
 * understanding the math behind actual rendering and animation 
 * so I decided to just take some code from a library that someone made
 * and have AI optimize it so that it fit what I already had.
 * I'll try to make some comments to help with debugging if needed
 */


type Props = { // Initialize with a board width/height
  children: React.ReactNode;
  boardWidth?: number;
  boardHeight?: number;
};

export default function PanBoard({
  children,
  boardWidth = 2000,
  boardHeight = 2000,
}: Props) {
  const [visibleRegion, setvisibleRegion] = useState({ w: 0, h: 0 });     // visible area under header
  const tx = useRef(new Animated.Value(0)).current;  // live translate X
  const ty = useRef(new Animated.Value(0)).current;  // live translate Y
  const last = useRef({ x: 0, y: 0 });               // accumulated offset

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if ((width !== visibleRegion.w) || (height !== visibleRegion.h)) setvisibleRegion({ w: width, h: height });
  };

  // find centered start + clamped bounds from fixed board + measured visibleRegion
  const metrics = useMemo(() => {
    if (!visibleRegion.w || !visibleRegion.h) return null;
    const START_X = -(boardWidth - visibleRegion.w) / 2;
    const START_Y = -(boardHeight - visibleRegion.h) / 2;
    const MIN_X = visibleRegion.w - boardWidth; // right edge align
    const MAX_X = 0;                 // left edge align
    const MIN_Y = visibleRegion.h - boardHeight;
    const MAX_Y = 0;
    return { START_X, START_Y, MIN_X, MAX_X, MIN_Y, MAX_Y };
  }, [visibleRegion, boardWidth, boardHeight]);

  // Initialize centered area
  useEffect(() => {
    if (!metrics) return;
    tx.setValue(metrics.START_X);
    ty.setValue(metrics.START_Y);
    last.current = { x: metrics.START_X, y: metrics.START_Y };
  }, [metrics]);

  const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

  const pan = useMemo(() => {
    if (!metrics) return Gesture.Pan();
    return Gesture.Pan()
      .runOnJS(true)
      .activeOffsetX([-6, 6])
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
