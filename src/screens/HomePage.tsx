import React from "react";
import { View, StyleSheet } from "react-native";
import type { BottomTabsParamList } from "../navigation/types";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import theme from "../theme";
import HeaderBanner from "../components/HeaderBanner";

type Props = BottomTabScreenProps<BottomTabsParamList, "Home">;

export default function FeaturedPage({ navigation, route }: Props) {
  return (
    <View style={styles.container}>
      <HeaderBanner title="Home" />
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
