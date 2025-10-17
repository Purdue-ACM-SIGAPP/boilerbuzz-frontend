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

    <View style = {EventDates.container}>
      <Text adjustsFontSizeToFit style = {EventDates.text}>7pm - 1 event</Text>
    </View>

    <View style={EventPostShape.container}>
      <Image source={require('../../assets/LongboardClub.webp')} style={EventPostShape.image} /> 

      <View style={EventPostShape.textContainer}>
      <Text style={EventPostShape.title}>Purdue Longboarding Callout</Text>
      <Text style = {EventPostShape.location}>Engineering Fountain</Text>
      <Text style = {EventPostShape.club}>Purdue ACM SIGAPP</Text>
      <Text style = {EventPostShape.time}>5:30 - 8:30</Text>
      <Text style = {EventPostShape.participants}>23/50</Text>
      
      </View>

      <Text style = {EventPostShape.socialTag}>Social</Text>
      


      
    </View>

    <View style = {EventDates.container}>
      <Text adjustsFontSizeToFit numberOfLines={1} style = {EventDates.text}>8pm - 2 events</Text>
    </View>

    <View style={EventPostShape.container}>
      <Image source={require('../../assets/ClimbingTeam.jpeg')} style={EventPostShape.image} />

      <View style={EventPostShape.textContainer}>
      <Text style={EventPostShape.title}>Purdue Climbing Team</Text>
      <Text style = {EventPostShape.location}>Rockwall @ Corec</Text>
      </View>
      
    </View>

    <View style={EventPostShape.container}>
      <Image source={require('../../assets/ImprovClub.jpeg')} style={EventPostShape.image} />

      <View style={EventPostShape.textContainer}>
      <Text style={EventPostShape.title}>Purdue Improv Club</Text>
      <Text style = {EventPostShape.location}>BRNG 1202</Text>
      </View>

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
    width: 295,
    height: 140,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 20,
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 1

    
  },
  title: {
    color: 'black',
    fontSize: 13,
    fontWeight: 'bold',
    paddingLeft: 100,
    paddingTop: 30,
    height: 16,
    marginBottom: 15
  },
  location: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'thin',
    paddingLeft: 100,

  },
  image: {
    width: 28,
    height: 43,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    resizeMode: 'cover',
    marginTop: 16,
    marginLeft:30

  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: -70,
    marginBottom: 50
  },

  club: {
    fontSize: 12,

  },

  socialTag: {
    backgroundColor: 'F0D895',



  },

  artsTag: {
    backgroundColor: 'F68479',


  },

  time: {
    fontSize: 15,
    

  },

  participants: {
    fontSize: 15,


  }



});

const EventDates = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 11,
    textAlign: 'center',
    height: 13

  },
  secondtext: {
    


  }


});

