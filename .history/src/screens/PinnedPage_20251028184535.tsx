// src/components/PanBoard.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type Props = {
  children: React.ReactNode;
  boardWidth?: number;   // logical content size (px)
  boardHeight?: number;
  maxScale?: number;     // default 3
};

export default function PanBoard({
  children,
  boardWidth = 2000,
  boardHeight = 2000,
  maxScale = 3,
}: Props) {
  const [vp, setVp] = useState({ w: 0, h: 0 });

  // Shared values (used on UI thread)
  const s = useSharedValue(1);    // scale
  const tx = useSharedValue(0);   // translateX (screen px)
  const ty = useSharedValue(0);   // translateY

  const startS = useSharedValue(1);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const isPinching = useSharedValue(false);

  // Keep last known for JS-side centering/clamp decisions
  const last = useRef({ s: 1, tx: 0, ty: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== vp.w || height !== vp.h) setVp({ w: width, h: height });
  };

  const getMinScale = useCallback(() => {
    if (!vp.w || !vp.h) return 1;
    const fitW = vp.w / boardWidth;
    const fitH = vp.h / boardHeight;
    return Math.min(1, Math.min(fitW, fitH)); // fit-to-viewport or 1, whichever is smaller
  }, [vp, boardWidth, boardHeight]);

  const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

  const clampToBounds = useCallback((tx0: number, ty0: number, sc: number) => {
    "worklet";
    const cw = boardWidth * sc;
    const ch = boardHeight * sc;

    const minX = cw <= vp.w ? (vp.w - cw) / 2 : vp.w - cw;
    const maxX = cw <= vp.w ? (vp.w - cw) / 2 : 0;
    const minY = ch <= vp.h ? (vp.h - ch) / 2 : vp.h - ch;
    const maxY = ch <= vp.h ? (vp.h - ch) / 2 : 0;

    const nx = Math.min(Math.max(tx0, minX), maxX);
    const ny = Math.min(Math.max(ty0, minY), maxY);
    return { nx, ny };
  }, [boardWidth, boardHeight, vp]);

  // Initialize/adjust on size changes: center and clamp
  useEffect(() => {
    if (!vp.w || !vp.h) return;
    const minScale = getMinScale();

    // Keep current scale within limits
    let nextS = clamp(last.current.s, minScale, maxScale);
    s.value = nextS;

    // Center if first time; else clamp to new bounds
    const centered = clampToBounds(last.current.tx, last.current.ty, nextS);
    tx.value = centered.nx;
    ty.value = centered.ny;

    last.current = { s: nextS, tx: centered.nx, ty: centered.ny };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vp.w, vp.h, boardWidth, boardHeight, maxScale]);

  // ----- Gestures -----
  const pan = useMemo(() => {
    return Gesture.Pan()
      .onBegin(() => {
        startX.value = tx.value;
        startY.value = ty.value;
      })
      .onUpdate((e) => {
        if (isPinching.value) return;
        const nx = startX.value + e.translationX;
        const ny = startY.value + e.translationY;
        const { nx: cx, ny: cy } = clampToBounds(nx, ny, s.value);
        tx.value = cx; ty.value = cy;
      })
      .onEnd((e) => {
        if (isPinching.value) return;
        const nx = startX.value + e.translationX;
        const ny = startY.value + e.translationY;
        const { nx: cx, ny: cy } = clampToBounds(nx, ny, s.value);
        tx.value = withTiming(cx, { duration: 120 });
        ty.value = withTiming(cy, { duration: 120 });
        runOnJS(() => (last.current = { s: last.current.s, tx: cx, ty: cy }))();
      })
      .shouldCancelWhenOutside(false);
  }, [clampToBounds, s, tx, ty]);

  const pinch = useMemo(() => {
    return Gesture.Pinch()
      .onBegin(() => {
        isPinching.value = true;
        startS.value = s.value;
        startX.value = tx.value;
        startY.value = ty.value;
      })
      .onUpdate((e) => {
        const minScale = getMinScale();
        const nextS = clamp(startS.value * e.scale, minScale, maxScale);

        // Keep focal point stable while scaling (scale then translate transform order)
        const fX = e.focalX;
        const fY = e.focalY;
        const tX = fX - (fX - startX.value) * (nextS / startS.value);
        const tY = fY - (fY - startY.value) * (nextS / startS.value);

        const { nx, ny } = clampToBounds(tX, tY, nextS);
        s.value = nextS;
        tx.value = nx; ty.value = ny;
      })
      .onEnd(() => {
        isPinching.value = false;
        // minor settle animation
        s.value = withTiming(s.value, { duration: 80 });
        tx.value = withTiming(tx.value, { duration: 80 });
        ty.value = withTiming(ty.value, { duration: 80 });
        runOnJS(() => (last.current = { s: s.value as number, tx: tx.value as number, ty: ty.value as number }))();
      });
  }, [clampToBounds, getMinScale, maxScale, s, tx, ty]);

  const doubleTap = useMemo(() => {
    return Gesture.Tap()
      .numberOfTaps(2)
      .maxDelay(250)
      .onEnd((e, success) => {
        if (!success) return;
        const minScale = getMinScale();
        const target = (last.current.s < 1 ? 1 : Math.min(last.current.s * 1.6, maxScale));
        // zoom around tap point
        const fX = e.x, fY = e.y;
        const tX = fX - (fX - last.current.tx) * (target / last.current.s);
        const tY = fY - (fY - last.current.ty) * (target / last.current.s);
        const { nx, ny } = clampToBounds(tX, tY, target);
        s.value = withTiming(Math.max(target, minScale), { duration: 180 });
        tx.value = withTiming(nx, { duration: 180 });
        ty.value = withTiming(ny, { duration: 180 });
        last.current = { s: Math.max(target, minScale), tx: nx, ty: ny };
      });
  }, [clampToBounds, getMinScale, maxScale]);

  const composed = useMemo(() => Gesture.Simultaneous(pinch, pan, doubleTap), [pinch, pan, doubleTap]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: s.value },         // scale first (so translations are in screen px)
      { translateX: tx.value },
      { translateY: ty.value },
    ],
  }));

  if (!vp.w || !vp.h) return <View style={styles.container} onLayout={onLayout} />;

  return (
    <View style={styles.container} onLayout={onLayout}>
      <GestureDetector gesture={composed}>
        <Animated.View
          style={[
            styles.board,
            { width: boardWidth, height: boardHeight },
            animatedStyle,
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
  board: { backgroundColor: "#faf7ef" },
});
