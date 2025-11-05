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
import EventTimeSlot from "../components/EventTimeSlot";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";

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
    artsTag: true 

    },{
    eventTitle: "Event", 
    eventHost: "Purdue Acm Sigapp", 
    eventLocation: "LWSN", 
    eventTime: "5:30 - 8:30", 
    eventParticipants: 23, 
    eventParticipantsMax: 50, 
    socialTag: true, 
    artsTag: true 

    }

  ];  

  const splitEventData = () => {
    let splitData = [];
    for (let i = 0; i < 24; i++) {
      splitData[i] = eventData.filter((event) => event.eventTime.startsWith(i.toString() + ":"));
    }
    return splitData;
  } 

  return (
    <>
    <View style={styles.container}>
      <HeaderBanner title="Find Events" />
      <SearchBar />
      <FilterMenu></FilterMenu>
      <ClubBanner></ClubBanner>
      <MyButton title="test" onPress={()=>{}}></MyButton>
      {splitEventData().map((hour, index) => (
        hour.length == 0 ? null : <EventTimeSlot events={hour} time={index.toString()} />
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

