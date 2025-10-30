import React, { useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NavigationProp } from "@react-navigation/native";
import PanBoard from "../components/PanBoard";
import BulletinPoster from "../components/BulletinPoster";
import PackedScatterGrid, { ScatterItem } from "../components/PackedScatterGrid";
import { POSTERS, POSTERS_BY_ID, likesToSize } from "../data/posters";
import type { BottomTabsParamList, RootStackParamList } from "../navigation/types";

export default function PinnedPage() {
  // Tab navigator (current) and parent (root stack) navigator
  const tabNav = useNavigation<BottomTabNavigationProp<BottomTabsParamList>>();
  const rootNav = tabNav.getParent<NavigationProp<RootStackParamList>>();

  // Build scatter items from the poster data
  const items = useMemo<ScatterItem[]>(
    () => POSTERS.map(p => {
      const { width, height } = likesToSize(p.likes);
      return { id: p.id, width, height };
    }),
    []
  );

  // Board size is 2000 x 2000 px initially; PackedScatterGrid may resize it via onBoardSize
  const [board, setBoard] = useState({ w: 2000, h: 2000 });

  // Centralized navigation for a poster
  const go = (posterId: string) => {
    const p = POSTERS_BY_ID[posterId];
    if (!p) return;
    const link = p.link;

    if (link.type === "tab") {
      // Switch tabs
      tabNav.navigate(link.name as any, link.params as any);
    } else {
      // Navigate to a stack screen in the parent navigator (RootStack)
      rootNav?.navigate(link.name as any, link.params as any);
    }
  };

  return (
    <View style={styles.container}>
      <PanBoard boardWidth={board.w} boardHeight={board.h}>
        <PackedScatterGrid
          items={items}
          boardWidth={board.w}
          boardHeight={board.h}
          minSpacing={5}
          seed={42}
          onBoardSize={(w, h) =>
            setBoard((cur) => (cur.w === w && cur.h === h ? cur : { w, h }))
          }
          renderItem={(it) => {
            const meta = POSTERS_BY_ID[it.id];
            return (
              <BulletinPoster
                title={meta.title}
                image={meta.image}
                width={it.width}
                height={it.height}
                onPress={() => go(it.id)}
              />
            );
          }}
        />
      </PanBoard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0c" },
});
