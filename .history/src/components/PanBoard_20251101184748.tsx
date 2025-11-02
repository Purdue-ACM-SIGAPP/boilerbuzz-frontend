// ...
const [canvas, setCanvas] = useState({ w: 2000, h: 2000 });
const [viewport, setViewport] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

// NEW: disable panning until the first layout finishes
const [contentReady, setContentReady] = useState(false);

return (
  <View style={styles.container}>
    <PanBoard
      canvasWidth={canvas.w}
      canvasHeight={canvas.h}
      onViewportChange={setViewport}
      enabled={contentReady}              // <<— prevent pan while loading
    >
      <PackedScatterGrid
        items={items}
        spacing={8}
        compactness={0.25}
        padding={80}
        visibleRect={viewport ?? undefined}
        overscan={300}
        onContentSize={(w, h) => {
          const nextW = Math.max(canvas.w, w);
          const nextH = Math.max(canvas.h, h);
          if (nextW !== canvas.w || nextH !== canvas.h) setCanvas({ w: nextW, h: nextH });
          // Mark as ready after the first size is known
          if (!contentReady) setContentReady(true);
        }}
        renderItem={(node) => {
          const meta = POSTERS_BY_ID[node.id];
          return <BulletinPoster meta={meta} width={node.width} height={node.height} />;
        }}
      />
    </PanBoard>
  </View>
);
// ...
