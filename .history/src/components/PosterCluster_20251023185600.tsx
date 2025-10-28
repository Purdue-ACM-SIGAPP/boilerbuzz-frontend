// src/components/PosterCluster.tsx
import React from "react";
import { View, StyleSheet } from "react-native";

type Props = {
  children: React.ReactNode;     // posters (variable width is fine)
  columns?: number;              // default: auto ~ square-ish
  hGap?: number;                 // horizontal gap between columns
  vGap?: number;                 // vertical gap between items in a column
};

export default function CenteredClusterAuto({
  children,
  columns,
  hGap = 16,
  vGap = 16,
}: Props) {
  const items = React.Children.toArray(children);
  const count = items.length;
  const cols = Math.max(1, columns ?? Math.ceil(Math.sqrt(count)));

  // Round-robin distribute into 'cols' columns
  const buckets: React.ReactNode[][] = Array.from({ length: cols }, () => []);
  items.forEach((child, i) => {
    buckets[i % cols].push(child);
  });

  return (
    // Fill the board area and center the cluster block
    <View style={styles.centerWrapper}>
      <View style={styles.row}>
        {buckets.map((col, ci) => (
          <View
            key={`col-${ci}`}
            style={[
              styles.column,
              { marginRight: ci === cols - 1 ? 0 : hGap },
            ]}
          >
            {col.map((child, ri) => (
              <View
                key={`cell-${ci}-${ri}`}
                style={{ marginBottom: ri === col.length - 1 ? 0 : vGap, alignItems: "center" }}
              >
                {child}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Makes the cluster sit at the *center of the board*
  centerWrapper: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  // Row of columns; group is centered as a block
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  // Each column stacks posters vertically; items can have variable width
  column: {
    flexDirection: "column",
    alignItems: "center",
  },
});
