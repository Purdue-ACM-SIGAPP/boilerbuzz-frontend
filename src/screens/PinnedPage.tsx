// PinnedPage.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import type { BottomTabsParamList } from "../navigation/types";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import theme from "../theme";
import HeaderBanner from "../components/HeaderBanner";
import BulletinPoster from "../components/BulletinPoster";
import PanBoard from "../components/PanBoard";
import CenteredCluster from "../components/PosterCluster";

type Props = BottomTabScreenProps<BottomTabsParamList, "Pinned">;

export default function PinnedPage({ navigation }: Props) {
  const posters = Array.from({ length: 12 }, () =>
    require("../../assets/tempposter.png")
  );

  return (
    <View style={styles.container}>
      <HeaderBanner title="Bulletin" />
      <PanBoard boardWidth={2000} boardHeight={2000}>
        <CenteredCluster itemWidth={150} gap={16} /* columns={3} */>
          {posters.map((img, i) => (
            <BulletinPoster
              key={i}
              image={img}
              onPress={() => navigation.navigate("Tabs", { screen: "Search" })}
            />
          ))}
          <BulletinPoster
              image={require("../../assets/tempposter.png")}
              onPress={() => navigation.navigate("Tabs", { screen: "Search" })}
            />
        </CenteredCluster>
      </PanBoard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
});
