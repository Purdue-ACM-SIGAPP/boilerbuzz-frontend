// src/screens/FeedScreen.tsx
import React, {useState} from "react"; //imported {useState} for textbox
import { View, Text, StyleSheet, Image, TextInput } from "react-native";
import type { BottomTabsParamList } from "../navigation/types";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";


type Props = BottomTabScreenProps<BottomTabsParamList, "Feed">;


export default function AddEventPage({ navigation, route }: Props) {
  function setText(newText: string): void {
    throw new Error("Function not implemented.");
  }
  const [number, onChangeNumber] = React.useState(''); //Dunno what this does, just added after looking through the react native textinput example
  const [number2, onChangeNumber2] = React.useState(''); //Nvm, after experimenting, each of these variables seems to represent a unique textbox
  const [number3, onChangeNumber3] = React.useState(''); 

  return (

    <>
    {/* <View style={styles.container}>
      <Text style={styles.text}>AddEventPage</Text>
    </View> */}

    <View style = {AddEventText.container}>
          <Text style = {AddEventText.titleFont}>Add Event</Text>
          <Text style = {AddEventText.subtitleFont}>Add your own club event</Text>
    </View>


    <View style={AddEventImages.container}>
          <Image source={require('../../assets/uploadicon.png')} style={AddEventImages.uploadImage} />
    </View>


    <View style = {AddEventText.container}>
        <Text style = {AddEventText.subtitleFont}>Organization Name</Text>
    </View>

    <TextInput
        style={Textbox.container}
        onChangeText={onChangeNumber}
        value={number}
        placeholder="Type in organization name here"
        keyboardType="numeric"
      />

    <View style = {AddEventText.container}>
        <Text style = {AddEventText.subtitleFont}>Event Name</Text>
    </View>

    <TextInput
        style={Textbox.container}
        onChangeText={onChangeNumber2}
        value={number2}
        placeholder="Type in event name here"
        keyboardType="numeric"
      />

    <View style = {AddEventText.container}>
        <Text style = {AddEventText.subtitleFont}>Description</Text>
    </View>

    <TextInput
        style={Textbox.container}
        onChangeText={onChangeNumber3}
        value={number3}
        placeholder="Type in description here"
        keyboardType="numeric"
      />

    <View style = {AddEventText.container}>
        <Text style = {AddEventText.subtitleFont}>Date and Time</Text>
    </View>

    <View style={AddEventImages.container}>
          <Image source={require('../../assets/CalenderIcon.png')} style={AddEventImages.calenderImage} />
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


const AddEventText = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    left: 495
    
    
  },
  titleFont: {
    fontWeight: 'light',
    fontSize: 32,
    textAlign: 'left'
  },
  subtitleFont: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'left',



  }


});

const AddEventImages = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 5,
  },
  uploadImage: {
    width: 159,
    height: 159,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  calenderImage: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    left: 495
  }
});

const Textbox = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 500,
    height: 50,
    backgroundColor: 'gray',
    borderRadius:10,
    alignSelf:'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    textAlign:'center',
  },
});