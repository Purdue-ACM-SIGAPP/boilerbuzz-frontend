import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { BottomTabsParamList } from "../navigation/types";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import SearchBar from "../components/SearchBar";
import FilterMenu from "../components/FilterMenu";
import theme from "../theme"
import HeaderBanner from "../components/HeaderBanner";

type Props = BottomTabScreenProps<BottomTabsParamList, "Search">;

export default function FindPage({ navigation, route }: Props) {
  return (
    <View style={styles.container}>
      <HeaderBanner
        title="FIND EVENTS"
        // showBack and showSearch are optional; they remain hidden unless you enable them
        // showBack={true} onBack={() => navigation.goBack()}
        // showSearch={true} onSearchChange={(q) => console.log('search', q)}
      />
      <View style={styles.innerContainer}>
        <SearchBar />
        <FilterMenu />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
        backgroundColor: theme.colors.background,

  },
  text: { fontSize: 20 },
});
