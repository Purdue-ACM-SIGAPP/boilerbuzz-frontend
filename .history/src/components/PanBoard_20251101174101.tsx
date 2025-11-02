// components/PanBoard.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, LayoutChangeEvent, Animated } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

/**
 * PanBoard:
 *  - Provides a pannable canvas region
 *  - Clamps panning so the canvas edges cannot be dragged past the edges of the visible area
 *  - Centers the starting position by default.
 */

type Props = {
  children: React.ReactNode;
  canvasWidth?: number;   // total width of the panned area
  canvasHeight?: number;  // total height of the panned area
  backgroundColor?: string;
};

export default function PanBoard({
  children,
  canvasWidth = 2000,
  canvasHeight = 2000,
  backgroundColor = "#faf7ef",
}: Props) {
  // Measured visible area (viewport) under headers/nav bars, etc.
  const [viewportSize, setViewportSize] = useState({ w: 0, h: 0 });

  // Animated translations (current pan)
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Accumulated pan offset after the last gesture ended
  const accumulatedOffset = useRef({ x: 0, y: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== viewportSize.w || height !== viewportSize.h) {
      setViewportSize({ w: width, h: height });
    }
  };

  /**
   * Compute clamping bounds and centered starting offset
   * based on the measured viewport and the known canvas size.
   */
  const bounds = useMemo(() => {
    if (!viewportSize.w || !viewportSize.h) return null;

    // If the canvas is bigger than the viewport, min is negative.
    // If the canvas is smaller, min will be positive; we clamp so it stays centered.
    const minX = Math.min(0, viewportSize.w - canvasWidth);
    const maxX = 0;
    const minY = Math.min(0, viewportSize.h - canvasHeight);
    const maxY = 0;

    // Center the canvas initially (works for both small and large canvases)
    const startX = Math.round((viewportSize.w - canvasWidth) / 2);
    const startY = Math.round((viewportSize.h - canvasHeight) / 2);

    return { minX, maxX, minY, maxY, startX, startY };
  }, [viewportSize, canvasWidth, canvasHeight]);

  // Initialize to centered start whenever viewport or canvas size changes
  useEffect(() => {
    if (!bounds) return;
    translateX.setValue(bounds.startX);
    translateY.setValue(bounds.startY);
    accumulatedOffset.current = { x: bounds.startX, y: bounds.startY };
  }, [bounds, translateX, translateY]);

  const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

  const panGesture = useMemo(() => {
    if (!bounds) return Gesture.Pan();

    return Gesture.Pan()
      .runOnJS(true)
      .activeOffsetX([-6, 6]) // avoid accidental taps registering as pan
      .activeOffsetY([-6, 6])
      .onUpdate((e) => {
        const nx = clamp(accumulatedOffset.current.x + e.translationX, bounds.minX, bounds.maxX);
        const ny = clamp(accumulatedOffset.current.y + e.translationY, bounds.minY, bounds.maxY);
        translateX.setValue(nx);
        translateY.setValue(ny);
      })
      .onEnd((e) => {
        const nx = clamp(accumulatedOffset.current.x + e.translationX, bounds.minX, bounds.maxX);
        const ny = clamp(accumulatedOffset.current.y + e.translationY, bounds.minY, bounds.maxY);
        accumulatedOffset.current = { x: nx, y: ny };
        translateX.setValue(nx);
        translateY.setValue(ny);
      })
      .shouldCancelWhenOutside(false);
  }, [bounds, translateX, translateY]);

  if (!bounds) return <View style={styles.container} onLayout={onLayout} />;

  return (
    <View style={styles.container} onLayout={onLayout}>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.canvas,
            {
              width: canvasWidth,
              height: canvasHeight,
              backgroundColor,
              transform: [{ translateX }, { translateY }],
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
  canvas: {},
});
