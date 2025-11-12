import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import type { BottomTabsParamList } from "../navigation/types";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import theme from "../theme";

const { width: screenWidth } = Dimensions.get("window");
const BASE_WIDTH = 375;
const scale = Math.min(screenWidth / BASE_WIDTH, 1) * 0.85; 


type EventSlideProps = {
  data: {
    eventTitle?: string;
    eventHost?: string;
    eventLocation?: string;
    eventTime?: string;
    eventParticipants?: number;
    eventParticipantsMax?: number;
    socialTag?: boolean;
    artsTag?: boolean;

  };

  

}

export default function EventSlide({ data }: EventSlideProps) {
  const {
    eventTitle, 
    eventHost, 
    eventLocation, 
    eventTime, 
    eventParticipants, 
    eventParticipantsMax, 
    socialTag, 
    artsTag
  } = data;
  

  return (
    <>
    
    <View style={EventPostShape.container}>
 
    <Image source={require('../../assets/LongboardClub.webp')} style={EventPostShape.imageContainer} resizeMode="cover" /> 
    
    <View style={EventPostShape.textContainer}>
      <Text style={EventPostShape.title} numberOfLines={1} >{eventTitle}.</Text>

      <View style = {EventPostShape.textImageContainer}>
        <Image source = {require('../../assets/location.png')} style = {EventPostShape.locationicon} />
        <Text style = {EventPostShape.location}>{eventLocation}</Text>
      </View>
    
      <Text style = {EventPostShape.club} numberOfLines={1}>{eventHost}</Text>

      
      <View style = {EventPostShape.tagContainerRow1}>
        

        {socialTag && (<View style = {EventPostShape.socialTag}>
          <Text style = {EventPostShape.socialText}>social</Text>
        </View>)}

      </View>

      <View style = {EventPostShape.tagContainerRow2}>
        
        {artsTag && (<View style = {EventPostShape.artsTag}>
          <Text style = {EventPostShape.socialText}>Arts & Crafts</Text>
        </View>)}

      </View>

    </View>

    <View style = {EventPostShape.rightContainer}>
    
    <Text style = {EventPostShape.time} >{eventTime}</Text>

    <View style = {EventPostShape.rightImageContainer}>
      <Image source = {require('../../assets/group.png')} style = {EventPostShape.participantsicon} />
      <Text style = {EventPostShape.participants}>{eventParticipants}/{eventParticipantsMax}</Text>
    </View>

    </View>

          
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



