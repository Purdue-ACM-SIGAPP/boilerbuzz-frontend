// src/screens/FeedScreen.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { BottomTabsParamList } from "../navigation/types";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import EventSlide from "../components/EventSlide";

type Props = BottomTabScreenProps<BottomTabsParamList, "Feed">;

export default function BoardPage({ navigation, route }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>EventSlide Page</Text>
      <EventSlide />
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
