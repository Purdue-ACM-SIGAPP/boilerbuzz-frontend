import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { BottomTabsParamList } from "../navigation/types";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import theme from "../theme"

type Props = BottomTabScreenProps<BottomTabsParamList, "Search">;

export default function BoardPage({ navigation, route }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>SearchPage Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,

  },
  text: { fontSize: 20 },
});
