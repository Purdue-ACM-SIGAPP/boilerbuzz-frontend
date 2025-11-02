// components/PanBoard.tsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { View, StyleSheet, LayoutChangeEvent, Animated } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

/**
 * PanBoard:
 *  - Pannable canvas (canvasWidth x canvasHeight)
 *  - Emits the current visible rect via onViewportChange
 *  - Clamps panning to the canvas bounds
 */

type Props = {
  children: React.ReactNode;
  canvasWidth?: number;
  canvasHeight?: number;
  backgroundColor?: string;
  onViewportChange?: (rect: { x: number; y: number; w: number; h: number }) => void; // NEW
};

export default function PanBoard({
  children,
  canvasWidth = 2000,
  canvasHeight = 2000,
  backgroundColor = "#faf7ef",
  onViewportChange, // <-- make sure this is destructured
}: Props) {
  // Measured viewport (the visible area in screen coords)
  const [viewportSize, setViewportSize] = useState({ w: 0, h: 0 });

  // Animated pan state
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Accumulated pan offset after the last gesture
  const accumulated = useRef({ x: 0, y: 0 });

  // Keep the latest callback in a ref to avoid stale closures in gesture handlers
  const viewportCbRef = useRef<typeof onViewportChange>(onViewportChange);
  useEffect(() => {
    viewportCbRef.current = onViewportChange;
  }, [onViewportChange]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== viewportSize.w || height !== viewportSize.h) {
      setViewportSize({ w: width, h: height });
    }
  };

  // Compute clamping bounds & centered start
  const bounds = useMemo(() => {
    if (!viewportSize.w || !viewportSize.h) return null;

    const minX = Math.min(0, viewportSize.w - canvasWidth);
    const maxX = 0;
    const minY = Math.min(0, viewportSize.h - canvasHeight);
    const maxY = 0;

    // Center canvas initially (works for both smaller & larger than viewport)
    const startX = Math.round((viewportSize.w - canvasWidth) / 2);
    const startY = Math.round((viewportSize.h - canvasHeight) / 2);

    return { minX, maxX, minY, maxY, startX, startY };
  }, [viewportSize, canvasWidth, canvasHeight]);

  // Helper: clamp a number
  const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

  // Remember the last rect we emitted to avoid redundant parent state updates
  const lastSentRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null);

  // Emit visible rect (world coords) based on current translation and viewport size
  const emitViewport = useCallback(
    (tx: number, ty: number) => {
      const cb = viewportCbRef.current;
      if (!cb || !viewportSize.w || !viewportSize.h) return;

      // Visible width/height cannot exceed canvas size
      const w = Math.min(viewportSize.w, canvasWidth);
      const h = Math.min(viewportSize.h, canvasHeight);

      // Convert from translation to world-space origin:
      // translateX/translateY move the canvas; the visible origin is the negative translation.
      let x = Math.max(0, -tx);
      let y = Math.max(0, -ty);

      // Clamp so the rect stays inside the canvas
      const maxX = Math.max(0, canvasWidth - w);
      const maxY = Math.max(0, canvasHeight - h);
      x = Math.min(x, maxX);
      y = Math.min(y, maxY);

      const rect = { x, y, w, h };

      // Avoid spamming identical rects
      const prev = lastSentRef.current;
      if (!prev || prev.x !== x || prev.y !== y || prev.w !== w || prev.h !== h) {
        lastSentRef.current = rect;
        cb(rect);
      }
    },
    [viewportSize, canvasWidth, canvasHeight]
  );

  // Initialize to centered start
  useEffect(() => {
    if (!bounds) return;
    translateX.setValue(bounds.startX);
    translateY.setValue(bounds.startY);
    accumulated.current = { x: bounds.startX, y: bounds.startY };
    emitViewport(bounds.startX, bounds.startY); // initial emit
  }, [bounds, emitViewport, translateX, translateY]);

  // If the viewport size changes (e.g., rotation), re-emit current rect
  useEffect(() => {
    if (!bounds) return;
    emitViewport(accumulated.current.x, accumulated.current.y);
  }, [viewportSize, bounds, emitViewport]);

  const panGesture = useMemo(() => {
    if (!bounds) return Gesture.Pan();
    return Gesture.Pan()
      .runOnJS(true)
      .activeOffsetX([-6, 6])
      .activeOffsetY([-6, 6])
      .onUpdate((e) => {
        const nx = clamp(accumulated.current.x + e.translationX, bounds.minX, bounds.maxX);
        const ny = clamp(accumulated.current.y + e.translationY, bounds.minY, bounds.maxY);
        translateX.setValue(nx);
        translateY.setValue(ny);
        emitViewport(nx, ny); // live updates
      })
      .onEnd((e) => {
        const nx = clamp(accumulated.current.x + e.translationX, bounds.minX, bounds.maxX);
        const ny = clamp(accumulated.current.y + e.translationY, bounds.minY, bounds.maxY);
        accumulated.current = { x: nx, y: ny };
        translateX.setValue(nx);
        translateY.setValue(ny);
        emitViewport(nx, ny); // final position
      })
      .shouldCancelWhenOutside(false);
  }, [bounds, translateX, translateY, emitViewport]);

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
