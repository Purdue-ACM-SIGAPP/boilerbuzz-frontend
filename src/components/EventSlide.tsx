import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import type { BottomTabsParamList } from "../navigation/types";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

type Props = BottomTabScreenProps<BottomTabsParamList, "Feed">;

export default function EventSlide({ navigation, route }: Props) {
  return (
    <>
      {/* <View style={styles.container}>
      <Text style={styles.text}>EventSlide Page</Text>
      </View> */}

      <View style={EventDates.container}>
        <Text style={EventDates.text}>7pm - 1 event</Text>
      </View>

      <View style={EventPostShape.container}>
        <Text style={EventPostShape.title}>Purdue Longboarding Callout</Text>
        <Text style={EventPostShape.caption}>Engineering Fountain</Text>
        <Image
          source={require("../../assets/LongboardClub.webp")}
          style={EventPostShape.image}
        />
      </View>

      <View style={EventDates.container}>
        <Text style={EventDates.text}>8pm - 2 events</Text>
      </View>

      <View style={EventPostShape.container}>
        <Text style={EventPostShape.title}>Purdue Climbing Team</Text>
        <Text style={EventPostShape.caption}>Rockwall @ Corec</Text>
        <Image
          source={require("../../assets/ClimbingTeam.jpeg")}
          style={EventPostShape.image}
        />
      </View>

      <View style={EventPostShape.container}>
        <Text style={EventPostShape.title}>Purdue Improv Club</Text>
        <Text style={EventPostShape.caption}>BRNG 1202</Text>
        <Image
          source={require("../../assets/ImprovClub.jpeg")}
          style={EventPostShape.image}
        />
      </View>
    </>
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

const EventPostShape = StyleSheet.create({
  container: {
    width: 500,
    height: 100,
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "flex-start",
    borderRadius: 10,
    margin: 20,
  },
  title: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: 100,
    paddingTop: 30,
  },
  caption: {
    color: "black",
    fontSize: 12,
    fontWeight: "thin",
    paddingLeft: 100,
  },
  image: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignSelf: "flex-start",
    top: -30,
  },
});

const EventDates = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
