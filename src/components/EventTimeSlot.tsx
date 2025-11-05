import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import type { BottomTabsParamList } from "../navigation/types";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import theme from "../theme";
import type { EventSlideProps } from "./EventSlide";
import EventSlide from "./EventSlide";

// type Props = BottomTabScreenProps<BottomTabsParamList, "Feed">;

const { width: screenWidth } = Dimensions.get("window");
const BASE_WIDTH = 375;
const scale = Math.min(screenWidth / BASE_WIDTH, 1) * 0.85; 


type EventTimeSlotProps = {
    events: any[],
    time?: string
}

export default function EventTimeSlot({ events, time }: EventTimeSlotProps) {
    const [showAll, setShowAll] = useState(false);

    const visibleEvents = showAll ? events : events.slice(0, 2);

    return (
    <>
    
    <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            <Text style={styles.time}>{time}:00-{time}:59</Text>
            <Text style={styles.eventCount}>{events.length} Event{events.length > 1 && "s"}</Text>
        </View>

        {/* Event List */}
        <ScrollView contentContainerStyle={styles.eventList}>
            {visibleEvents.map((event, index) => (
                <EventSlide key={index} data={event} />
            ))}

            {/* Show More Button */}
            <TouchableOpacity style={styles.showMore} onPress={() => setShowAll(!showAll)}>
                <Text style={styles.showMoreText}>{showAll?"Show Less":"Show More"}</Text>
            </TouchableOpacity>
        </ScrollView>
          
    </View>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  time: {
    fontSize: 18,
    fontWeight: '600',
  },
  eventCount: {
    fontSize: 16,
    color: '#888',
  },
  eventList: {
    paddingBottom: 24,
  },
  showMore: {
    marginTop: 12,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  showMoreText: {
    fontSize: 14,
    color: '#333',
  },

});

const EventPostShape = StyleSheet.create({
  container: {
    width: Math.min(screenWidth * 0.85, 320), //Math.min(screenWidth * 0.85, 320)
    minHeight: 70 * scale, 
    backgroundColor: "FFFCF4",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 6 * scale,
    marginVertical: 6 * scale,
    flexDirection: "row",
    borderColor: "black",
    borderWidth: 1,
    padding: 6 * scale,
    alignSelf: "center",
  },

  imageContainer: {
    width: 40 * scale,
    height: 55 * scale,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8 * scale,
  },

  textContainer: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    paddingHorizontal: 8 * scale, //8 * scale
    paddingVertical: 2 * scale,
    maxWidth: "60%", 
  },

  title: {
    fontSize: 13 * scale,
    fontWeight: "bold",
    color: "black",
    marginBottom: 2 * scale,
    flexShrink: 1,
  },

  location: {
    fontSize: 11 * scale,
    color: "black",
    flexShrink: 1,
  },

  locationicon: {
    width: 12 * scale,
    height: 12 * scale,
    marginRight: 4 * scale,
  },

  textImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4 * scale,
  },

  club: {
    fontSize: 10 * scale,
    color: "darkgrey",
    marginBottom: 4 * scale,
    flexShrink: 1,
  },

  tagContainerRow1: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 2 * scale,
  },

  tagContainerRow2: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  socialTag: {
    backgroundColor: "rgb(240, 216, 149)",
    borderRadius: 6 * scale,
    paddingHorizontal: 5 * scale,
    paddingVertical: 1 * scale,
    borderColor: "black",
    borderWidth: 1,
    marginRight: 5 * scale,
  },

  artsTag: {
    backgroundColor: "rgb(246,132,121)",
    borderRadius: 6 * scale,
    paddingHorizontal: 5 * scale,
    paddingVertical: 1 * scale,
    borderColor: "black",
    borderWidth: 1,
  },

  socialText: {
    fontSize: 10 * scale,
    fontWeight: "500",
    textAlign: "center",
    flexShrink: 1,
  },

  rightContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingLeft: 8 * scale,
    height: "100%",
    width: "20%",

  },

  rightImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4 * scale,
  },

  time: {
    fontSize: 11 * scale,
    color: "darkgrey",
    textAlign: "right",
  },

  participants: {
    fontSize: 11 * scale,
    color: "darkgrey",
    marginLeft: 4 * scale,
    textAlign: "right",
  },

  participantsicon: {
    width: 12 * scale,
    height: 12 * scale,
  },
});



