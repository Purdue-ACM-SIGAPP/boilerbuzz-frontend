// src/components/PanBoard.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, LayoutChangeEvent, Animated } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type Props = {
  children: React.ReactNode;
  boardWidth?: number;    // logical content width (unscaled)
  boardHeight?: number;   // logical content height (unscaled)
  maxBeyondFit?: number;  // how many times beyond "fit" you can zoom (default 3)
};

export default function PanBoard({
  children,
  boardWidth = 2000,
  boardHeight = 2000,
  maxBeyondFit = 3,
}: Props) {
  const [vp, setVp] = useState({ w: 0, h: 0 });

  // Outer translates, inner scales
  const tx = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // Imperative mirrors
  const cur = useRef({ x: 0, y: 0, s: 1 });
  const panStart = useRef({ x: 0, y: 0 });
  const pinchStartS = useRef(1);
  const isPinching = useRef(false);
  const hasInit = useRef(false);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== vp.w || height !== vp.h) setVp({ w: width, h: height });
  };

  // Bounds for given scale (screen px; translate clamps happen here)
  const getBounds = (s: number) => {
    const cw = boardWidth * s;
    const ch = boardHeight * s;

    // If content < viewport, lock centered
    const minX = cw <= vp.w ? (vp.w - cw) / 2 : vp.w - cw;
    const maxX = cw <= vp.w ? (vp.w - cw) / 2 : 0;
    const minY = ch <= vp.h ? (vp.h - ch) / 2 : vp.h - ch;
    const maxY = ch <= vp.h ? (vp.h - ch) / 2 : 0;

    return {
      minX, maxX, minY, maxY,
      startX: (minX + maxX) / 2,
      startY: (minY + maxY) / 2,
      cw, ch,
    };
  };

  const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

  // Min/Max scale: MIN = fit-to-screen, MAX = fit * maxBeyondFit
  const limits = useMemo(() => {
    if (!vp.w || !vp.h) return { MIN: 1, MAX: 3 };
    const fit = Math.min(vp.w / boardWidth, vp.h / boardHeight); // scale that fits whole board
    // Ensure MAX is at least a little bigger than MIN; cap to avoid absurd zoom
    const MAX = Math.min(fit * Math.max(1.01, maxBeyondFit), 8);
    return { MIN: fit, MAX };
  }, [vp, boardWidth, boardHeight, maxBeyondFit]);

  // Init/reclamp on size changes
  useEffect(() => {
    if (!vp.w || !vp.h) return;
    const s = clamp(cur.current.s, limits.MIN, limits.MAX);
    cur.current.s = s; scale.setValue(s);

    const b = getBounds(s);
    if (!hasInit.current) {
      cur.current.x = b.startX; cur.current.y = b.startY;
      tx.setValue(cur.current.x); ty.setValue(cur.current.y);
      hasInit.current = true;
    } else {
      const nx = clamp(cur.current.x, b.minX, b.maxX);
      const ny = clamp(cur.current.y, b.minY, b.maxY);
      cur.current.x = nx; cur.current.y = ny;
      tx.setValue(nx); ty.setValue(ny);
    }
  }, [vp, boardWidth, boardHeight, limits.MIN, limits.MAX, tx, ty, scale]);

  // PAN (disabled while pinching)
  const pan = useMemo(() => {
    return Gesture.Pan()
      .runOnJS(true)
      .onBegin(() => { panStart.current = { x: cur.current.x, y: cur.current.y }; })
      .onUpdate((e) => {
        if (!hasInit.current || isPinching.current) return;
        const b = getBounds(cur.current.s);
        const nx = clamp(panStart.current.x + e.translationX, b.minX, b.maxX);
        const ny = clamp(panStart.current.y + e.translationY, b.minY, b.maxY);
        cur.current.x = nx; cur.current.y = ny; tx.setValue(nx); ty.setValue(ny);
      })
      .onEnd((e) => {
        const b = getBounds(cur.current.s);
        const nx = clamp(panStart.current.x + e.translationX, b.minX, b.maxX);
        const ny = clamp(panStart.current.y + e.translationY, b.minY, b.maxY);
        cur.current.x = nx; cur.current.y = ny; tx.setValue(nx); ty.setValue(ny);
      })
      .shouldCancelWhenOutside(false);
  }, [tx, ty]);

  // PINCH (zoom to focal point and clamp every frame)
  const pinch = useMemo(() => {
    return Gesture.Pinch()
      .runOnJS(true)
      .onBegin(() => {
        isPinching.current = true;
        pinchStartS.current = cur.current.s;
      })
      .onUpdate((e) => {
        if (!hasInit.current) return;
        const sPrev = cur.current.s;
        // Clamp scale strictly between MIN and MAX computed from board+viewport
        const target = clamp(pinchStartS.current * e.scale, limits.MIN, limits.MAX);

        // Keep the pinch focal point stable:
        // t' = f - (f - t) * (S' / S_prev)
        const fX = e.focalX, fY = e.focalY;
        let nx = fX - (fX - cur.current.x) * (target / sPrev);
        let ny = fY - (fY - cur.current.y) * (target / sPrev);

        // Clamp translation for the new scale
        const b = getBounds(target);
        nx = clamp(nx, b.minX, b.maxX);
        ny = clamp(ny, b.minY, b.maxY);

        cur.current.s = target; cur.current.x = nx; cur.current.y = ny;
        scale.setValue(target); tx.setValue(nx); ty.setValue(ny);
      })
      .onEnd(() => {
        isPinching.current = false;
        const b = getBounds(cur.current.s);
        const nx = clamp(cur.current.x, b.minX, b.maxX);
        const ny = clamp(cur.current.y, b.minY, b.maxY);
        cur.current.x = nx; cur.current.y = ny; tx.setValue(nx); ty.setValue(ny);
      });
  }, [tx, ty, scale, limits.MIN, limits.MAX]);

  const gesture = useMemo(() => Gesture.Simultaneous(pan, pinch), [pan, pinch]);

  if (!vp.w || !vp.h) return <View style={styles.container} onLayout={onLayout} />;

  return (
    <View style={styles.container} onLayout={onLayout}>
      <GestureDetector gesture={gesture}>
        {/* Outer: translate only */}
        <Animated.View style={{ transform: [{ translateX: tx }, { translateY: ty }] }}>
          {/* Inner: scale only */}
          <Animated.View
            style={[
              styles.board,
              { width: boardWidth, height: boardHeight, transform: [{ scale }] },
            ]}
          >
            {children}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: "hidden" },
  board: { backgroundColor: "#faf7ef" },
});
