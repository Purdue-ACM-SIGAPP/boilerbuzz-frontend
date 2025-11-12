// src/screens/FeedScreen.tsx
import React, { useState } from "react"; //imported {useState} for textbox
import { View, Text, StyleSheet, Image, TextInput, Dimensions, Button, Alert} from "react-native";
import type { BottomTabsParamList } from "../navigation/types";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import HeaderBanner from "../components/HeaderBanner";
import MyButton from "../components/MyButton";
import theme from "../theme";
import * as DocumentPicker from 'expo-document-picker';
import { TouchableOpacity } from "react-native";

type Props = BottomTabScreenProps<BottomTabsParamList, "AddEvent">;

const { width: screenWidth } = Dimensions.get("window");
const BASE_WIDTH = 375;
const scale = Math.min(screenWidth / BASE_WIDTH, 1) * 0.85; 

export default function AddEventPage({ navigation, route }: Props) {
  function setText(newText: string): void {
    throw new Error("Function not implemented.");
  }
  const [number, onChangeNumber] = React.useState(""); //Dunno what this does, just added after looking through the react native textinput example
  const [number2, onChangeNumber2] = React.useState(""); //Nvm, after experimenting, each of these variables seems to represent a unique textbox
  const [number3, onChangeNumber3] = React.useState("");
  const [number4, onChangeNumber4] = React.useState("");
  const [number5, onChangeNumber5] = React.useState("");
  const [number6, onChangeNumber6] = React.useState("");

  return (
    <>
      <View style={AddEventText.container}>
        <Text style={AddEventText.subtitleFont}>Event Name<Text style = {{color: 'red'}}>*</Text></Text>
      </View>

      <TextInput
        style={Textbox.container}
        onChangeText={onChangeNumber}
        value={number}
        keyboardType="numeric"
        
      />

      <View style={AddEventText.container}>
        <Text style={AddEventText.subtitleFont}>Flyer</Text>
      </View>

      <TouchableOpacity style={ImportButton.container} onPress={pickDocument}>
        <Text style={{ fontWeight: "thin", fontSize: scale * 75}}>+</Text>
        <Text style={{ fontWeight: "bold"}}>Upload File</Text>
      </TouchableOpacity>

      <View style={AddEventText.container}>
        <Text style={AddEventText.subtitleFont}>Location<Text style = {{color: 'red'}}>*</Text></Text>
      </View>

      <TextInput
        style={Textbox.container}
        onChangeText={onChangeNumber3}
        value={number3}
        keyboardType="numeric"
      />

      <View style={AddEventText.container}>
        <Text style={AddEventText.subtitleFont}>Date</Text>
      </View>

      <View style = {DateDescriptions.container}>

        <View style = {DateColumns.container}>
          <Text>Month</Text>

          <TextInput style = {SmallerTextbox.container} 
          onChangeText = {onChangeNumber2} 
          value = {number2} 
          keyboardType = "numeric"/>
        </View>


        <View style = {DateColumns.container}>
          <Text> </Text>
          <Text>/</Text>
        </View>
        

        <View style = {DateColumns.container}>
          <Text>Day</Text>
          <TextInput style = {SmallerTextbox.container} 
          onChangeText = {onChangeNumber4} 
          value = {number4} 
          keyboardType = "numeric"/>
        </View>

        <View style = {DateColumns.container}>
          <Text> </Text>
          <Text>/</Text>
        </View>
        


        <View style = {DateColumns.container}>
          <Text>Year</Text>
          <Text>2025</Text>
        </View>

      
        <Image source = {require('../../assets/CalenderIcon.png')} style = {CalenderImage.container}/>


      </View>


      <View style={AddEventText.container}>
        <Text style={AddEventText.subtitleFont}>Club<Text style = {{color: 'red'}}>*</Text></Text>
      </View>

      <TextInput
        style={Textbox.container}
        onChangeText={onChangeNumber5}
        value={number5}
        keyboardType="numeric"
      />

      <Text> </Text>
      <Text> </Text>
      <Text> </Text>
      <Text> </Text>

      <MyButton title="Add Event" onPress={()=>{}}></MyButton>

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

const AddEventText = StyleSheet.create({
  container: {
    padding: 10,
    alignSelf: "center",
    width: Math.min(screenWidth * 0.85, 500)
    
    
    
    
  },
  subtitleFont: {
    fontWeight: "bold",
    fontSize: scale * 20,
    textAlign: "left",
  },
});



const Textbox = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F0E5',
    borderRadius:10,
    alignSelf:'center',
    borderWidth: 1,
    minHeight: 35 * scale,
    width: Math.min(screenWidth * 0.85, 500)
    
  },
  input: {
    paddingHorizontal: 10,
    textAlign: "center",
    paddingLeft: 100
    
    
  },
});

const UniqueTextbox = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F0E5',
    borderRadius:10,
    alignSelf:'center',
    borderWidth: 1,
    minHeight: 140 * scale,
    width: Math.min(screenWidth * 0.85, 500)
    
  },
  input: {
    paddingHorizontal: 10,
    textAlign: "center",
  },
});

const SmallerTextbox = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F0E5',
    borderRadius:10,
    alignSelf:'center',
    borderWidth: 1,
    minHeight: 35 * scale,
    width: Math.min(screenWidth * 0.35, 100),
    
    
  },
  input: {
    paddingHorizontal: 10,
    textAlign: "center",

  },
});


const DateDescriptions = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: scale * 10

  },

});

const DateColumns = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 5

  },


});

const CalenderImage = StyleSheet.create({
  container: {
    width: 40 * scale,
    height: 40 * scale,
    resizeMode: 'contain',
    marginTop: 10 * scale

  }

});


const pickDocument = async () => {

  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*', // Allow all file types
      copyToCacheDirectory: true, // Copy the file to the app's cache directory
    });

    if (result.canceled) {
      Alert.alert('Document picking cancelled');
    } else {
      // Handle the selected file
      console.log('Selected file URI:', result.assets[0].uri);
      console.log('Selected file name:', result.assets[0].name);
      console.log('Selected file size:', result.assets[0].size);
      // You can then read the file content using libraries like expo-file-system
      // or upload it to a server.
      Alert.alert('File selected', `Name: ${result.assets[0].name}`);
    }
  } catch (err) {
    console.error('Error picking document:', err);
    Alert.alert('Error', 'Failed to pick document.');
  }
};

const ImportButton = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F0E5',
    borderRadius:10,
    alignSelf:'center',
    borderWidth: 1,
    minHeight: 140 * scale,
    width: Math.min(screenWidth * 0.85, 500)
  }

});