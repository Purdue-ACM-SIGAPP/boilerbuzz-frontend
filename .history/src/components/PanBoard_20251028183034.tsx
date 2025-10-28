// src/components/PanBoard.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, LayoutChangeEvent, Animated } from "react-native";
import { Gesture, GestureDetector, GestureStateChangeEvent, PanGestureHandlerEventPayload, PinchGestureHandlerEventPayload } from "react-native-gesture-handler";

type Props = {
  children: React.ReactNode;
  boardWidth?: number;   // content's logical width
  boardHeight?: number;  // content's logical height
};

export default function PanBoard({
  children,
  boardWidth = 2000,
  boardHeight = 2000,
}: Props) {
  const [vp, setVp] = useState({ w: 0, h: 0 }); // measured viewport
  const tx = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // Keep an imperative copy for math (avoid reading Animated's internal value)
  const cur = useRef({ x: 0, y: 0, s: 1 });
  const panStart = useRef({ x: 0, y: 0 });
  const pinchStartS = useRef(1);
  const isPinching = useRef(false);
  const hasInit = useRef(false);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== vp.w || height !== vp.h) setVp({ w: width, h: height });
  };

  // Compute bounds for given scale
  const getBounds = (s: number) => {
    const cw = boardWidth * s;
    const ch = boardHeight * s;

    // When content is smaller than viewport, lock centered (min==max)
    const minX = cw <= vp.w ? (vp.w - cw) / 2 : vp.w - cw;
    const maxX = cw <= vp.w ? (vp.w - cw) / 2 : 0;
    const minY = ch <= vp.h ? (vp.h - ch) / 2 : vp.h - ch;
    const maxY = ch <= vp.h ? (vp.h - ch) / 2 : 0;

    // "centered" start is the midpoint of each range
    const startX = (minX + maxX) / 2;
    const startY = (minY + maxY) / 2;

    return { minX, maxX, minY, maxY, startX, startY, cw, ch };
  };

  const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

  // Scale limits: don't let user zoom out smaller than "fit to screen"
  const limits = useMemo(() => {
    if (!vp.w || !vp.h) return { MIN: 1, MAX: 3 };
    const fit = Math.min(vp.w / boardWidth, vp.h / boardHeight);
    const MIN = Math.min(1, fit); // allow zooming out to fit (or 1 if board smaller)
    const MAX = 3;                // tweak if you want more zoom-in
    return { MIN, MAX };
  }, [vp, boardWidth, boardHeight]);

  // Initialize or re-clamp on viewport/board changes
  useEffect(() => {
    if (!vp.w || !vp.h) return;

    // Keep current scale within limits
    let s = clamp(cur.current.s, limits.MIN, limits.MAX);
    cur.current.s = s;
    scale.setValue(s);

    const b = getBounds(s);

    if (!hasInit.current) {
      // First time: center the content
      cur.current.x = b.startX;
      cur.current.y = b.startY;
      tx.setValue(cur.current.x);
      ty.setValue(cur.current.y);
      hasInit.current = true;
    } else {
      // Clamp current translation to new bounds (preserve position if possible)
      const nx = clamp(cur.current.x, b.minX, b.maxX);
      const ny = clamp(cur.current.y, b.minY, b.maxY);
      cur.current.x = nx; cur.current.y = ny;
      tx.setValue(nx); ty.setValue(ny);
    }
  }, [vp, boardWidth, boardHeight, limits.MIN, limits.MAX, tx, ty, scale]);

  // --- Gestures --------------------------------------------------------------

  // PAN (disabled while pinching)
  const pan = useMemo(() => {
    return Gesture.Pan()
      .runOnJS(true)
      .onBegin(() => {
        panStart.current = { x: cur.current.x, y: cur.current.y };
      })
      .onUpdate((e) => {
        if (!hasInit.current || isPinching.current) return;
        const b = getBounds(cur.current.s);
        const nx = clamp(panStart.current.x + e.translationX, b.minX, b.maxX);
        const ny = clamp(panStart.current.y + e.translationY, b.minY, b.maxY);
        cur.current.x = nx; cur.current.y = ny;
        tx.setValue(nx); ty.setValue(ny);
      })
      .onEnd((e) => {
        if (!hasInit.current) return;
        const b = getBounds(cur.current.s);
        const nx = clamp(panStart.current.x + e.translationX, b.minX, b.maxX);
        const ny = clamp(panStart.current.y + e.translationY, b.minY, b.maxY);
        cur.current.x = nx; cur.current.y = ny;
        tx.setValue(nx); ty.setValue(ny);
      })
      .shouldCancelWhenOutside(false);
  }, [tx, ty]);

  // PINCH (zoom to focal point, then clamp)
  const pinch = useMemo(() => {
    return Gesture.Pinch()
      .runOnJS(true)
      .onBegin((e: GestureStateChangeEvent<PinchGestureHandlerEventPayload>) => {
        isPinching.current = true;
        pinchStartS.current = cur.current.s;
      })
      .onUpdate((e) => {
        if (!hasInit.current) return;
        const nextS = clamp(pinchStartS.current * e.scale, limits.MIN, limits.MAX);

        // Adjust translation so the focal point stays stable while zooming.
        // Transform order is Scale -> Translate, so use:
        // t' = f - (f - t) * (S' / S)
        const fX = e.focalX;
        const fY = e.focalY;
        const s0 = cur.current.s;
        const s1 = nextS;
        let nx = fX - (fX - cur.current.x) * (s1 / s0);
        let ny = fY - (fY - cur.current.y) * (s1 / s0);

        // Clamp to new bounds at s1
        const b = getBounds(s1);
        nx = clamp(nx, b.minX, b.maxX);
        ny = clamp(ny, b.minY, b.maxY);

        cur.current.s = s1; cur.current.x = nx; cur.current.y = ny;
        scale.setValue(s1);
        tx.setValue(nx); ty.setValue(ny);
      })
      .onEnd(() => {
        isPinching.current = false;
        // Ensure still clamped (in case of rounding)
        const b = getBounds(cur.current.s);
        const nx = clamp(cur.current.x, b.minX, b.maxX);
        const ny = clamp(cur.current.y, b.minY, b.maxY);
        cur.current.x = nx; cur.current.y = ny;
        tx.setValue(nx); ty.setValue(ny);
      });
  }, [tx, ty, scale, limits.MIN, limits.MAX]);

  // Combine (allow both, but we ignore pan while pinching to avoid conflicts)
  const gesture = useMemo(() => Gesture.Simultaneous(pan, pinch), [pan, pinch]);

  if (!vp.w || !vp.h) return <View style={styles.container} onLayout={onLayout} />;

  return (
    <View style={styles.container} onLayout={onLayout}>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.board,
            {
              width: boardWidth,
              height: boardHeight,
              // IMPORTANT: scale first, then translate (so pan is in screen px)
              transform: [{ scale }, { translateX: tx }, { translateY: ty }],
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
  board: { backgroundColor: "#faf7ef" },
});
