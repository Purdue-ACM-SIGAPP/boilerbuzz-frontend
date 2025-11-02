import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";


// viewable area of screen
type ViewportRect = { x: number; y: number; w: number; h: number };

type Props = {
  children: React.ReactNode;
  canvasWidth?: number;
  canvasHeight?: number;

  backgroundColor?: string; // background color for pannable area

  onViewportChange?: (rect: ViewportRect) => void; // Called when the visible region changes

  enabled?: boolean;   // disable or enable panning
};

export default function PanBoard({
  children,
  canvasWidth = 2000,
  canvasHeight = 2000,
  backgroundColor = "#faf7ef",
  onViewportChange,
  enabled = true,
}: Props) {
  

  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  
  // tracks visisble area and bounds
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== viewport.w || height !== viewport.h) {
      setViewport({ w: width, h: height });
    }
  };

  // Makes sure most recent version of viewable area is updated
  const onViewportChangeRef = useRef<((rect: ViewportRect) => void) | null>(null);
  useEffect(() => {
    onViewportChangeRef.current = onViewportChange ?? null;
  }, [onViewportChange]);


  // Find the bounds of the canvas in order to not pan outside canvas.
  // Also center the board on initial load
  const bounds = useMemo(() => {
    if (!viewport.w || !viewport.h) return null;
    const minX = Math.min(0, viewport.w - canvasWidth); // Furthest left you can pan
    const maxX = 0; // right most coordinate
    const minY = Math.min(0, viewport.h - canvasHeight); // Farthest down you can pan
    const maxY = 0; // top most coordinate
    const startX = Math.round((viewport.w - canvasWidth) / 2);
    const startY = Math.round((viewport.h - canvasHeight) / 2);
    return { minX, maxX, minY, maxY, startX, startY };
  }, [viewport, canvasWidth, canvasHeight]);

  // --- UI-thread shared values
  const tx = useSharedValue(0); // x position track
  const ty = useSharedValue(0); // y position tracker

  // Boundaries (will be updated later when board size is calculated)
  const minX = useSharedValue(0);
  const maxX = useSharedValue(0);
  const minY = useSharedValue(0);
  const maxY = useSharedValue(0);

  // Used to remember coordinates where inital drag/pan started
  const startXSV = useSharedValue(0);
  const startYSV = useSharedValue(0);

  // Store visible screen size
  // tells how much of the grid is on screen
  const viewW = useSharedValue(0);
  const viewH = useSharedValue(0);

  // Gate flags to prevent updates before read
  const measuredReady = useSharedValue(0);            // true if layout is measured and we know the size
  const enabledSV = useSharedValue(enabled ? 1 : 0);  // true if panning enabled
  useEffect(() => {
    enabledSV.value = enabled ? 1 : 0;
  }, [enabled, enabledSV]);


  // last x and y coords sent to react when visible area changes/pans
  const lastSentX = useSharedValue(0);
  const lastSentY = useSharedValue(0);

  // threshold for how often to update screen (update every 64 pixels for now)
  const THRESH = 64;

  // function to show what values are in the safe range of the canvas
  const clamp = (v: number, lo: number, hi: number) => {
    "worklet";
    return Math.min(Math.max(v, lo), hi);
     // if the user should only move between -500 and 0, then
     // clamp(-700, -500, 0) = -500, which never lets you past -500
  };

  // initialize shared values when bounds available
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
      // This section packedScatterGrid which part of the grid the screen is on
      // so that it can decide which posters to render first
    }
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
