import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import type { BottomTabsParamList } from "../navigation/types";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import theme from "../theme";
import HeaderBanner from "../components/HeaderBanner";
import ClubBanner from "../unused/ClubBanner";
import SearchBar from "../components/SearchBar";

type Props = BottomTabScreenProps<BottomTabsParamList, "Search">;

export default function FeaturedPage({ navigation, route }: Props) {
  const eventData = [
    {
      eventTitle: "Event",
      eventHost: "Purdue Acm Sigapp",
      eventLocation: "LWSN",
      eventTime: "5:30 - 8:30",
      eventParticipants: 23,
      eventParticipantsMax: 50,
      socialTag: true,
      artsTag: true,
    },
  ];

  return (
    <>
      <View style={styles.container}>
        <HeaderBanner title="Find Events" />
        <SearchBar />
        <ClubBanner></ClubBanner>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 4,
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
});
