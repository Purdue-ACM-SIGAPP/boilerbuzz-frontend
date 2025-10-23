import React from "react";
import { View, StyleSheet } from "react-native";
import type { BottomTabsParamList } from "../navigation/types";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import theme from "../theme";
import HeaderBanner from "../components/HeaderBanner";
import BulletinPoster from "../components/BulletinPoster";

type Props = BottomTabScreenProps<BottomTabsParamList, "Pinned">;

export default function PinnedPage({ navigation, route }: Props) {
  return (    
    <View style={styles.container}>
      <HeaderBanner title="Bulletin" />
      <BulletinPoster 
        image={"../../assets/templogo.png"}
        onPress={() => navigation.navigate("Tabs", { screen: "Findr" })}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
});
