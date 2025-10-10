// src/screens/FeedScreen.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { BottomTabsParamList } from "../navigation/types";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import SearchBar from "../components/SearchBar";
import FilterMenu from "../components/FilterMenu";
import theme from "../theme"

type Props = BottomTabScreenProps<BottomTabsParamList, "Search">;

export default function FindPage({ navigation, route }: Props) {
  return (
    <View style={styles.container}>
      <SearchBar/>
      <FilterMenu/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
        backgroundColor: theme.colors.background,

  },
  text: { fontSize: 20 },
});
