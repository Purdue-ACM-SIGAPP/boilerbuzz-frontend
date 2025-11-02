// src/components/PanBoard.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

/**
 * PanBoard (UI-thread panning):
 * - Pans a fixed-size canvas (canvasWidth x canvasHeight) inside the viewport.
 * - Movement is clamped so you cannot drag the canvas past its edges.
 * - Starts centered by default.
 * - Exposes onViewportChange({ x, y, w, h }) to drive virtualization upstream.
 *
 * Notes:
 * - Requires Reanimated (with the babel plugin) and RNGH installed.
 * - We throttle viewport notifications to JS to avoid spam while panning.
 */

type Props = {
  children: React.ReactNode;
  canvasWidth?: number;
  canvasHeight?: number;
  backgroundColor?: string;
  onViewportChange?: (rect: { x: number; y: number; w: number; h: number }) => void;
};

export default function PanBoard({
  children,
  canvasWidth = 2000,
  canvasHeight = 2000,
  backgroundColor = "#faf7ef",
  onViewportChange,
}: Props) {
  // 1) Measure the visible viewport (area under headers, etc.)
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== viewport.w || height !== viewport.h) setViewport({ w: width, h: height });
  };

  // 2) Compute clamping bounds + centered start (JS side, once viewport is known)
  const bounds = useMemo(() => {
    if (!viewport.w || !viewport.h) return null;

    // If the canvas is smaller than the viewport, we allow centering (min could be > 0),
    // so clamp mins with Math.min to keep "no drag beyond edge" semantics.
    const minX = Math.min(0, viewport.w - canvasWidth);
    const maxX = 0;
    const minY = Math.min(0, viewport.h - canvasHeight);
    const maxY = 0;

    const startX = Math.round((viewport.w - canvasWidth) / 2);
    const startY = Math.round((viewport.h - canvasHeight) / 2);

    return { minX, maxX, minY, maxY, startX, startY };
  }, [viewport, canvasWidth, canvasHeight]);

  // 3) UI-thread state (shared values)
  const tx = useSharedValue(0); // current translateX
  const ty = useSharedValue(0); // current translateY

  const minX = useSharedValue(0);
  const maxX = useSharedValue(0);
  const minY = useSharedValue(0);
  const maxY = useSharedValue(0);

  const startXSV = useSharedValue(0); // gesture start X
  const startYSV = useSharedValue(0); // gesture start Y

  const viewW = useSharedValue(0);
  const viewH = useSharedValue(0);

  // Throttling for JS notifications
  const lastSentX = useSharedValue(0);
  const lastSentY = useSharedValue(0);
  const THRESH = 64; // px movement before notifying JS again (tune 32–96)

  // Worklet-safe clamp
  const clamp = (v: number, lo: number, hi: number) => {
    "worklet";
    return Math.min(Math.max(v, lo), hi);
  };

  // 4) Initialize shared values when bounds/viewport change
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

    lastSentX.value = bounds.startX;
    lastSentY.value = bounds.startY;

    // Initial viewport to JS (schedule on RN thread)
    if (onViewportChange) {
      scheduleOnRN(() =>
        onViewportChange({
          x: -bounds.startX,
          y: -bounds.startY,
          w: viewport.w,
          h: viewport.h,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds, viewport.w, viewport.h]);

  // 5) Gesture runs fully on UI thread, transforms are applied without JS involvement
  const pan = Gesture.Pan()
    .onBegin(() => {
      startXSV.value = tx.value;
      startYSV.value = ty.value;
      lastSentX.value = tx.value;
      lastSentY.value = ty.value;

      if (onViewportChange) {
        const curX = tx.value, curY = ty.value;
        const w = viewW.value, h = viewH.value;
        scheduleOnRN(() => onViewportChange({ x: -curX, y: -curY, w, h }));
      }
    })
    .onChange((e) => {
      const nx = clamp(startXSV.value + e.translationX, minX.value, maxX.value);
      const ny = clamp(startYSV.value + e.translationY, minY.value, maxY.value);
      tx.value = nx;
      ty.value = ny;

      // Throttled viewport notifications to JS (for virtualization)
      const dx = Math.abs(nx - lastSentX.value);
      const dy = Math.abs(ny - lastSentY.value);
      if ((dx > THRESH || dy > THRESH) && onViewportChange) {
        lastSentX.value = nx;
        lastSentY.value = ny;
        const w = viewW.value, h = viewH.value;
        scheduleOnRN(() => onViewportChange({ x: -nx, y: -ny, w, h }));
      }
    })
    .onEnd(() => {
      if (onViewportChange) {
        const nx = tx.value, ny = ty.value;
        const w = viewW.value, h = viewH.value;
        scheduleOnRN(() => onViewportChange({ x: -nx, y: -ny, w, h }));
      }
    })
    .shouldCancelWhenOutside(false);

  // 6) Animated style (UI thread)
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
