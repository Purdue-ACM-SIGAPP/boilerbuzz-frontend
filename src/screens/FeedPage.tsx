// src/screens/FeedScreen.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { BottomTabsParamList } from "../navigation/types";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

type Props = BottomTabScreenProps<BottomTabsParamList, "Home">;

export default function FeedPage({ navigation, route }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Feed Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { fontSize: 20 },
});
