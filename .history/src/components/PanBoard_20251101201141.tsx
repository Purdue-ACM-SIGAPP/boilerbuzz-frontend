import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";

type ViewportRect = { x: number; y: number; w: number; h: number };

type Props = {
  children: React.ReactNode;
  canvasWidth?: number;
  canvasHeight?: number;
  backgroundColor?: string;
  /** Called when the visible world-rect changes (for virtualization). */
  onViewportChange?: (rect: ViewportRect) => void;
};

export default function PanBoard({
  children,
  canvasWidth = 2000,
  canvasHeight = 2000,
  backgroundColor = "#faf7ef",
  onViewportChange,
}: Props) {
  // --- JS state: measured viewport size
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== viewport.w || height !== viewport.h) {
      setViewport({ w: width, h: height });
    }
  };

  // Latest JS callback ref (avoid stale closures)
  const onViewportChangeRef = useRef<((rect: ViewportRect) => void) | null>(null);
  useEffect(() => {
    onViewportChangeRef.current = onViewportChange ?? null;
  }, [onViewportChange]);

  // Clamp bounds + centered start (JS)
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

  // --- UI-thread shared values
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const minX = useSharedValue(0);
  const maxX = useSharedValue(0);
  const minY = useSharedValue(0);
  const maxY = useSharedValue(0);
  const startXSV = useSharedValue(0);
  const startYSV = useSharedValue(0);
  const viewW = useSharedValue(0);
  const viewH = useSharedValue(0);

  // Gate flags inside worklets
  const measuredReady = useSharedValue(0);            // viewport measured
  const enabledSV = useSharedValue(enabled ? 1 : 0);  // parent-allowed
  useEffect(() => {
    enabledSV.value = enabled ? 1 : 0;
  }, [enabled, enabledSV]);

  // Throttle JS notifications
  const lastSentX = useSharedValue(0);
  const lastSentY = useSharedValue(0);
  const THRESH = 64; // px before notifying JS again

  const clamp = (v: number, lo: number, hi: number) => {
    "worklet";
    return Math.min(Math.max(v, lo), hi);
  };

  // Initialize shared values when bounds available
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

    measuredReady.value = viewport.w > 0 && viewport.h > 0 ? 1 : 0;

    // Initial viewport to JS (on JS thread)
    if (onViewportChangeRef.current && viewport.w > 0 && viewport.h > 0) {
      const payload = { x: -bounds.startX, y: -bounds.startY, w: viewport.w, h: viewport.h };
      onViewportChangeRef.current(payload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds, viewport.w, viewport.h]);

  // Worklet → JS notifier (typed, guarded)
  const notifyJS = (nx: number, ny: number, w: number, h: number) => {
    "worklet";
    const cb = onViewportChangeRef.current;
    if (cb && w > 0 && h > 0) {
      // Safe bridge via Reanimated
      runOnJS(cb)({ x: -nx, y: -ny, w, h });
    }
  };

  // Gesture (UI thread)
  const pan = Gesture.Pan()
    .onBegin(() => {
      if (!measuredReady.value || !enabledSV.value) return;
      startXSV.value = tx.value;
      startYSV.value = ty.value;
      lastSentX.value = tx.value;
      lastSentY.value = ty.value;

      notifyJS(tx.value, ty.value, viewW.value, viewH.value);
    })
    .onChange((e) => {
      if (!measuredReady.value || !enabledSV.value) return;
      const nx = clamp(startXSV.value + e.translationX, minX.value, maxX.value);
      const ny = clamp(startYSV.value + e.translationY, minY.value, maxY.value);
      tx.value = nx;
      ty.value = ny;

      const dx = Math.abs(nx - lastSentX.value);
      const dy = Math.abs(ny - lastSentY.value);
      if (dx > THRESH || dy > THRESH) {
        lastSentX.value = nx;
        lastSentY.value = ny;
        notifyJS(nx, ny, viewW.value, viewH.value);
      }
    })
    .onEnd(() => {
      if (!measuredReady.value || !enabledSV.value) return;
      notifyJS(tx.value, ty.value, viewW.value, viewH.value);
    })
    .shouldCancelWhenOutside(false);

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
