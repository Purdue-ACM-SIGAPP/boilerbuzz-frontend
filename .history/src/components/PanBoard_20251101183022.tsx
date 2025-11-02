// src/components/PanBoard.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle } from "react-native-reanimated";

/**
 * PanBoard (UI-thread panning with Reanimated):
 * - Pans a fixed-size canvas (canvasWidth x canvasHeight).
 * - Clamps movement so edges can’t be dragged past the viewport.
 * - Starts centered by default.
 * - Runs input/animation on the UI thread (no JS jank).
 */

type Props = {
  children: React.ReactNode;
  canvasWidth?: number;
  canvasHeight?: number;
  backgroundColor?: string;
  // Optional: report current viewport in world coords (useful for virtualization)
  onViewportChange?: (rect: { x: number; y: number; w: number; h: number }) => void;
};

export default function PanBoard({
  children,
  canvasWidth = 2000,
  canvasHeight = 2000,
  backgroundColor = "#faf7ef",
  onViewportChange,
}: Props) {
  // Measured viewport under headers, etc. (JS state is fine here)
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== viewport.w || height !== viewport.h) setViewport({ w: width, h: height });
  };

  // Compute clamping bounds + centered start (JS side)
  const bounds = useMemo(() => {
    if (!viewport.w || !viewport.h) return null;
    const minX = Math.min(0, viewport.w - canvasWidth);
    const maxX = 0;
    const minY = Math.min(0, viewport.h - canvasHeight);
    const maxY = 0;
    const startX = Math.round((viewport.w - canvasWidth) / 2);
    const startY = Math.round((viewport.h - canvasHeight) / 2);
    return { minX, maxX, minY, maxY, startX, startY };
  }, [viewport, canvasWidth, canvasHeight]);

  // --- UI-thread shared values ---
  const tx = useSharedValue(0);     // current translateX
  const ty = useSharedValue(0);     // current translateY
  const minX = useSharedValue(0);
  const maxX = useSharedValue(0);
  const minY = useSharedValue(0);
  const maxY = useSharedValue(0);
  const startXSV = useSharedValue(0);  // gesture start X
  const startYSV = useSharedValue(0);  // gesture start Y
  const viewW = useSharedValue(0);
  const viewH = useSharedValue(0);

  // Clamp usable inside worklets
  const clamp = (v: number, lo: number, hi: number) => {
    "worklet";
    return Math.min(Math.max(v, lo), hi);
  };

  // When bounds change (after measuring), initialize shared values and center
  useEffect(() => {
    if (!bounds) return;
    minX.value = bounds.minX;
    maxX.value = bounds.maxX;
    minY.value = bounds.minY;
    maxY.value = bounds.maxY;
    viewW.value = viewport.w;
    viewH.value = viewport.h;

    tx.value = bounds.startX;
    ty.value = bounds.startY;
    startXSV.value = bounds.startX;
    startYSV.value = bounds.startY;

    // emit initial viewport rect (JS thread)
    onViewportChange?.({ x: -bounds.startX, y: -bounds.startY, w: viewport.w, h: viewport.h });
  }, [bounds, viewport.w, viewport.h, minX, maxX, minY, maxY, tx, ty, startXSV, startYSV, viewW, viewH, onViewportChange]);

  // Pan gesture runs on UI thread; no JS involvement per frame
  const pan = Gesture.Pan()
    .onBegin(() => {
      startXSV.value = tx.value;
      startYSV.value = ty.value;
    })
    .onChange((e) => {
      const nx = clamp(startXSV.value + e.translationX, minX.value, maxX.value);
      const ny = clamp(startYSV.value + e.translationY, minY.value, maxY.value);
      tx.value = nx;
      ty.value = ny;
    })
    .onEnd(() => {
      // no-op; we already stored final values in tx/ty
    })
    .onFinalize(() => {
      // Optionally notify JS about final viewport (debounced at gesture end)
      if (onViewportChange) {
        // We can’t call JS directly from a worklet without runOnJS; simplest: let the next layout/useEffect tick handle it.
        // If you want immediate callback, import runOnJS from reanimated and call runOnJS(onViewportChange)({ ... }).
      }
    })
    .shouldCancelWhenOutside(false);

  // Animated style for the canvas transform (UI thread)
  const canvasStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }],
  }));

  if (!bounds) return <View style={styles.container} onLayout={onLayout} />;

  return (
    <View style={styles.container} onLayout={onLayout}>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.canvas,
            { width: canvasWidth, height: canvasHeight, backgroundColor },
            canvasStyle,
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
