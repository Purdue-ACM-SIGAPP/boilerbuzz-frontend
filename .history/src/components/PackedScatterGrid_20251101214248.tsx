// components/PackedScatterGrid.tsx
import React, { useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";

/**
 * PackedScatterGrid:
 * - Spiral placement with neighbor grid (spatial hash) to avoid overlaps.
 * - Deterministic; size-biased radius/step push small items outward.
 * - Virtualized render: only mounts nodes visible in the current viewport.
 */

// Item to place inside scatter grid. Posters for now
export type ScatterItem = { id: string; width: number; height: number };

type PlacedNode = { id: string; left: number; top: number; width: number; height: number };

type Props = {
  items: ScatterItem[]; // Poster array
  spacing?: number; // space between postesr
  compactness?: number;
  padding?: number;
  onContentSize?: (w: number, h: number) => void; // Tells PanBoard how large final layout is
  renderItem: (it: ScatterItem) => React.ReactNode; // Function to draw poster
  visibleRect?: { x: number; y: number; w: number; h: number }; // bisible area of screen
  renderDistance?: number; // how far outside the screen to pre-render
};


const TAU = Math.PI * 2; // Full circle in radian
const GOLDEN_ANGLE = TAU * (1 - 1 / 1.61803398875); //used for spiral

// integer hash key for (gx, gy)
const cellKey = (gx: number, gy: number) => ((gx * 73856093) ^ (gy * 19349663)) >>> 0;


// Function to check for collisions between rectangles in the grid when placing
function rectsOverlap(a: PlacedNode, b: PlacedNode, spacing: number) {

  const LeftA = a.left - spacing; // left edge of rectangle/grid
  const TopA = a.top - spacing; // top edge
  const RightA = a.left + a.width + spacing; // right edge
  const BottomA = a.top + a.height + spacing; // bottom edge

  const LeftB = b.left - spacing;
  const TopB = b.top - spacing;
  const RightB = b.left + b.width + spacing;
  const BottomB = b.top + b.height + spacing;

  // Check if left/right or top/bottom edges collide
  return (LeftA < RightB) && (RightA > LeftB) && (TopA < BottomB) && (BottomA > TopB);
}

// Used to check if poster is inside visible area.
// B is the visible rectangle/area
const intersects = (a: { l: number; t: number; r: number; b: number }, b: { l: number; t: number; r: number; b: number }) =>
  a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;

export default function PackedScatterGrid({
  items,
  spacing = 12,
  compactness = 0.25,
  padding = 0,
  onContentSize,
  renderItem,
  visibleRect,
  renderDistance = 160,
}: Props) {
  const layout = useMemo(() => { // if there's no items, just do an empty layout
    if (!items.length) {
      return { placed: [] as PlacedNode[], contentW: 0, contentH: 0, minX: 0, minY: 0 };
    }


    const minWidth = Math.max(1, Math.min(...items.map((d) => d.width)));
    const minHeight = Math.max(1, Math.min(...items.map((d) => d.height)));

    // function to pick a grid size based on the smallest item and spacing
    const cellSize = Math.max(32, Math.floor(Math.min(minWidth, minHeight) + spacing));
    
    // transform coordinate to a column/row in rectangular grid 
    const toCell = (x: number) => Math.floor(x / cellSize);
    
    const grid = new Map<number, number[]>();
    const placed: PlacedNode[] = [];

    // When placing a rectangle, mark all cells that it touches for future checks
    const addToGrid = (idx: number, r: PlacedNode) => {
      const gx0 = toCell(r.left), gy0 = toCell(r.top);
      const gx1 = toCell(r.left + r.width), gy1 = toCell(r.top + r.height);
      for (let gx = gx0; gx <= gx1; gx++) {
        for (let gy = gy0; gy <= gy1; gy++) {
          const k = cellKey(gx, gy);
          const arr = grid.get(k);
          arr ? arr.push(idx) : grid.set(k, [idx]);
        }
      }
    };


    // Function to search grid for all nearby items of a rectangle/node that could collide
    const neighbors = (r: PlacedNode) => {
      
      // calculate boundaries of grid area that needs to be checked
      const gx0 = toCell(r.left - spacing);
      const gy0 = toCell(r.top - spacing);
      const gx1 = toCell(r.left + r.width + spacing);
      const gy1 = toCell(r.top + r.height + spacing);
      const out: number[] = [];
      const seen = new Set<number>();

      // iterates through every cell in the start and end columns 
      for (let gx = gx0; gx <= gx1; gx++) {
        for (let gy = gy0; gy <= gy1; gy++) {
          const arr = grid.get(cellKey(gx, gy));
          if (!arr) continue;
          for (const id of arr) {
            if (!seen.has(id)) {
              seen.add(id);
              out.push(id);
            }
          }
        }
      }
      return out;
    };

    // --- Strong size bias + inner guard (deterministic) ---

    // Rank items (largest area first); we place in this order too for density.
    const areas = items.map((it) => it.width * it.height);
    const idxByAreaDesc = [...areas.keys()].sort((i, j) => areas[j] - areas[i]);
    const rankByIndex = new Map<number, number>();
    idxByAreaDesc.forEach((idx, rank) => rankByIndex.set(idx, rank));

    const n = items.length;

    // Estimate cluster radius from padded total area (empirical)
    const paddedAreas = items.map((it) => (it.width + spacing) * (it.height + spacing));
    const totalPadded = paddedAreas.reduce((a, b) => a + b, 0);
    const packEff = 0.62;
    const R_est = Math.sqrt(totalPadded / (Math.PI * packEff));

    const baseRingStep = Math.max(spacing, Math.round(Math.min(minWidth, minHeight) * compactness));
    const coreRadius = R_est * 0.35;
    const coreGate = 0.60;
    const outerBias = R_est;
    const gamma = 2;
    const maxRings = 1000;

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const rank = rankByIndex.get(i)!; // 0..n-1
      const percentile = 1 - rank / Math.max(1, n - 1); // largest≈1 → smallest≈0
      const sizeScore = Math.pow(percentile, gamma);

      let radius = Math.max((1 - sizeScore) * outerBias, sizeScore < coreGate ? coreRadius : 0);
      const ringStep = baseRingStep * (1 + (1 - sizeScore)); // small → bigger steps

      // Deterministic angular staggering (no randomness)
      let startAngle = (i * GOLDEN_ANGLE) % TAU;
      let chosen: PlacedNode | null = null;

      for (let ring = 0; ring < maxRings && !chosen; ring++) {
        const circumference = Math.max(1, TAU * Math.max(1, radius));
        const approxStep = Math.max(spacing, it.width * 0.6);
        const nAngles = Math.min(500, Math.max(12, Math.ceil(circumference / approxStep))); // cap at 48

        // rotate (cos,sin) incrementally to avoid heavy trig per step
        const delta = TAU / nAngles;
        const cosD = Math.cos(delta), sinD = Math.sin(delta);
        let cosT = Math.cos(startAngle), sinT = Math.sin(startAngle);

        for (let t = 0; t < nAngles; t++) {
          const cx = radius * cosT;
          const cy = radius * sinT;

          const candidate: PlacedNode = {
            id: it.id,
            left: Math.round(cx - it.width / 2),
            top: Math.round(cy - it.height / 2),
            width: it.width,
            height: it.height,
          };

          const neigh = neighbors(candidate);
          let hit = false;
          for (let k = 0; k < neigh.length; k++) {
            if (rectsOverlap(candidate, placed[neigh[k]], spacing)) {
              hit = true;
              break;
            }
          }
          if (!hit) {
            chosen = candidate;
            break;
          }

          // rotate (cosT, sinT) by delta
          const ncos = cosT * cosD - sinT * sinD;
          const nsin = sinT * cosD + cosT * sinD;
          cosT = ncos; sinT = nsin;
        }

        if (!chosen) {
          radius += ringStep;
          startAngle += (TAU / Math.min(48, Math.max(12, Math.ceil(circumference / Math.max(spacing, it.width * 0.6))))) * 0.37;
        }
      }

      if (!chosen) {
        chosen = { id: it.id, left: Math.round(radius), top: 0, width: it.width, height: it.height };
      }
// after: const idx = placed.push(chosen) - 1; addToGrid(idx, chosen);


// Printing where posters placed/rendered for debugging
if (__DEV__) {
  const count = i + 1;
  const cx = chosen.left + chosen.width / 2;
  const cy = chosen.top + chosen.height / 2;
  const r  = Math.round(Math.hypot(cx, cy)); // approx radius from center

  if (count <= 500 || count === items.length) {
    console.log(
      `[PackedScatterGrid] placed #${count}/${items.length} ` +
      `id=${it.id} pos=(${chosen.left},${chosen.top}) size=${chosen.width}x${chosen.height} r≈${r}`
    );
  }
}

      const idx = placed.push(chosen) - 1;
      addToGrid(idx, chosen);
    }

    // --- Bounds ---
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of placed) {
      minX = Math.min(minX, n.left);
      minY = Math.min(minY, n.top);
      maxX = Math.max(maxX, n.left + n.width);
      maxY = Math.max(maxY, n.top + n.height);
    }

    const contentW = Math.ceil(maxX - minX + padding * 2);
    const contentH = Math.ceil(maxY - minY + padding * 2);
if (__DEV__) {
  // Log if all posters are placed
  console.log(
    `[PackedScatterGrid] layout complete: placed=${placed.length}/${items.length} ` +
    `content=${contentW}x${contentH} bounds=(${minX},${minY})..(${maxX},${maxY})`
  );
}

    return { placed, contentW, contentH, minX, minY };
    
  }, [items, spacing, compactness, padding]);


  
  // Report content size
  useEffect(() => {
    onContentSize?.(layout.contentW, layout.contentH);
  }, [layout.contentW, layout.contentH, onContentSize]);

  // Shift so minX/minY land at "padding"
  const offsetX = Math.round(padding - layout.minX);
  const offsetY = Math.round(padding - layout.minY);

  // Virtualization window
  const vr = visibleRect
    ? {
        l: visibleRect.x - renderDistance,
        t: visibleRect.y - renderDistance,
        r: visibleRect.x + visibleRect.w + renderDistance,
        b: visibleRect.y + visibleRect.h + renderDistance,
      }
    : null;

  const nodesToRender = vr
    ? layout.placed.filter((n) =>
        intersects(
          { l: n.left + offsetX, t: n.top + offsetY, r: n.left + offsetX + n.width, b: n.top + offsetY + n.height },
          vr
        )
      )
    : layout.placed;
/*
    // log how many posters are currently rendered on screen. (This is based completely on the render distance and not actual posters on screen)
    useEffect(() => {
      if (!__DEV__) return;
      const vis = visibleRect
        ? `vis=(${Math.round(visibleRect.x)},${Math.round(visibleRect.y)}) ${Math.round(visibleRect.w)}x${Math.round(visibleRect.h)}`
        : "vis=ALL";
        console.log(
        `[PackedScatterGrid] render: showing ${nodesToRender.length}/${layout.placed.length} (${vis})`
      );
    }, [
      nodesToRender.length,
      layout.placed.length,
      visibleRect?.x,
      visibleRect?.y,
      visibleRect?.w,
      visibleRect?.h,
    ]);
    */


  return (
    <View style={{ width: layout.contentW, height: layout.contentH }}>
      {nodesToRender.map((n) => (
        <View
          key={n.id}
          style={[
            styles.absoluteNode,
            { left: n.left + offsetX, top: n.top + offsetY, width: n.width, height: n.height },
          ]}
        >
          {renderItem({ id: n.id, width: n.width, height: n.height })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteNode: { position: "absolute", overflow: "hidden", borderRadius: 0 },
});
