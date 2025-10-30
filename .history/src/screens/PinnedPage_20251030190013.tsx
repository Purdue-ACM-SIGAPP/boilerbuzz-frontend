import React, { useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NavigationProp } from "@react-navigation/native";
import PanBoard from "../components/PanBoard";
import BulletinPoster from "../components/BulletinPoster";
import PackedScatterGrid, { ScatterItem } from "../components/PackedScatterGrid";
import { POSTERS, POSTERS_BY_ID, likesToSize, ALL_POSTERS} from "../components/ExamplePosters";
import type { BottomTabsParamList, RootStackParamList } from "../navigation/types";

export default function PinnedPage() {
  const tabNav = useNavigation<BottomTabNavigationProp<BottomTabsParamList>>();
  const rootNav = tabNav.getParent<NavigationProp<RootStackParamList>>();

  // making the scatter grid from the poster data
  const items = useMemo<ScatterItem[]>(
    () => ALL_POSTERS.map(p => {
      const { width, height } = likesToSize(p.likes); // make the width and height of a poster proportional to likes
      return { id: p.id, width, height };
    }),
    []
  );

  // board size
  const [board, setBoard] = useState({ w: 2000, h: 2000 });
  
  const poster_nav_handler = (posterId: string) => {
    const p = POSTERS_BY_ID[posterId];
    if (!p) return;
    const link = p.link;

    if (link.type === "tab") {
      // Switch tabs
      tabNav.navigate(link.name as any, link.params as any);
    } else {
      // Navigate to a stack screen instead
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
            const poster = POSTERS_BY_ID[it.id];
            return (
              <BulletinPoster
                title={poster.title}
                image={poster.image}
                width={it.width}
                height={it.height}
                onPress={() => poster_nav_handler(it.id)}
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
