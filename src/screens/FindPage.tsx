import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import type { BottomTabsParamList } from "../navigation/types";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import theme from "../theme";
import HeaderBanner from "../components/HeaderBanner";
import FilterMenu from "../components/FilterMenu";
import ClubBanner from "../components/ClubBanner";
import MyButton from "../components/MyButton";
import SearchBar from "../components/SearchBar";
import EventSlide from "../components/EventSlide";

type Props = BottomTabScreenProps<BottomTabsParamList, "Search">;

export default function FeaturedPage({ navigation, route }: Props) {

  const eventData = [
    {
    eventTitle: "Event", 
    eventHost: "Sigapp", 
    eventLocation: "LWSN", 
    eventTime: "5:30 - 8:30", 
    eventParticipants: 23, 
    eventParticipantsMax: 50, 
    socialTag: true, 
    artsTag: true 

    }

  ];  

  return (
    <>
    <View style={styles.container}>
      <HeaderBanner title="Find Events" />
      <SearchBar />
      <FilterMenu></FilterMenu>
      <ClubBanner></ClubBanner>
      <MyButton title="test" onPress={()=>{}}></MyButton>
      {eventData.map((event, index) => (
        <EventSlide key={index} data={event} />
      ))}
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

