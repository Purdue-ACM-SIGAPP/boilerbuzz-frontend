import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import type { BottomTabsParamList } from "../navigation/types";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import theme from "../theme";

type Props = BottomTabScreenProps<BottomTabsParamList, "Feed">;

type EventSlideProps = {
  eventTitle?: string;
  eventHost?: string;
  eventLocation?: string;
  eventTime?: string;
  eventParticipants?: number;
  eventParticipantsMax?: number;
  socialTag?: boolean;
  artsTag?: boolean;

};

export default function EventSlide({eventTitle, 
  eventHost, 
  eventLocation, 
  eventTime, 
  eventParticipants, 
  eventParticipantsMax, 
  socialTag, 
  artsTag}: EventSlideProps) {



  return (
    <>
    
    <View style={EventPostShape.container}>
 
    <Image source={require('../../assets/LongboardClub.webp')} style={EventPostShape.imageContainer} /> 
    
    <View style={EventPostShape.textContainer}>
      <Text style={EventPostShape.title} numberOfLines={1} >{eventTitle}.</Text>

      <View style = {EventPostShape.textImageContainer}>
        <Image source = {require('../../assets/location.png')} style = {EventPostShape.locationicon} />
        <Text style = {EventPostShape.location}>{eventLocation}</Text>
      </View>
    
      <Text style = {EventPostShape.club}>{eventHost}</Text>

      
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
    
    <Text style = {EventPostShape.time}>{eventTime}</Text>

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
    width: 320,
    height: 140,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 20,
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    

    
  },
  
  title: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1
  },
  location: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'condensedBold',
    flex: 1,
    height: 15,
    width: 82,
    alignSelf:'center'

  },
  resizeImage: {
    width: '100%',
    height: '100%',



  },

  imageContainer: {
    width: 45,
    height: 63,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 10,
    marginTop: -50
  },
  
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 10,
    marginLeft: 0,
    marginTop: 10,
    flexDirection: 'column',
    gap: 0,
    padding: 10,

    
  },

  textImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5

  },

  rightContainer: {
    justifyContent: 'flex-end',
    flex: 1,
    flexDirection: 'column',
    gap: 0,
    alignItems: 'flex-end',
    marginTop: -65,
    
  },

  rightImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5

  },

  tagContainerRow1: {
    alignItems:'flex-end',
    flexDirection: 'row',

  },

  tagContainerRow2: {
    alignItems:'flex-end',
    flexDirection: 'row'


  },


  club: {
    fontSize: 12,
    color: 'darkgrey',
    flex: 1,
    width: 140,
    height: 12,

  },

  socialTag: {
    backgroundColor: 'rgb(240, 216, 149)',
    borderRadius: 10,
    padding: 10,
    borderColor: 'black',
    width: 57,
    height: 21,
    margin: 5
    
  },


  socialText: {
    fontSize: 15,
    alignSelf: 'center',
    marginTop: -7,
    fontWeight: 'medium'

  },

  artsTag: {
    backgroundColor: 'rgb(246,132,121)',
    borderRadius: 10,
    padding: 10,
    borderColor: 'black',
    width: 110,
    height: 21,
    margin: 5

  },

  time: {
    fontSize: 15,
    color: 'darkgrey',
    flex: 1,
    
    

  },

  participants: {
    fontSize: 15,
    color: 'darkgrey',
    flex: 1,

  },

  participantsicon: {
    width: 17,
    height: 17,

  },

  locationicon: {
    width: 18,
    height: 18,

  }






});

