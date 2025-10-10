import React from "react";
import { View, StyleSheet } from "react-native";
import type { BottomTabsParamList } from "../navigation/types";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import theme from "../theme";
import HeaderBanner from "../components/HeaderBanner";
import FilterMenu from "../components/FilterMenu";
import ClubBanner from "../components/ClubBanner";
import MyButton from "../components/MyButton";
import SearchBar from "../components/SearchBar";

type Props = BottomTabScreenProps<BottomTabsParamList, "Search">;

export default function FeaturedPage({ navigation, route }: Props) {
  return (
    <View style={styles.container}>
      <HeaderBanner title="Find Events" />
      <SearchBar />
      <FilterMenu></FilterMenu>
      <ClubBanner></ClubBanner>
      <MyButton title="test" onPress={()=>{}}></MyButton>
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
