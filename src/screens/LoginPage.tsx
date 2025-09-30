// src/screens/LoginPage.tsx

//Remember to also transfer from login page to questions about demographics and clubs
import React, {useState} from "react";
import {ImageBackground, View, Text, StyleSheet, TextInput, Alert} from "react-native";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import MyButton from "../components/button";
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from "@react-navigation/native";



export default function LoginPage() {
    const navigation = useNavigation();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TextInput
          onChangeText={setUsername}
          value={username}
          style={styles.textbox}
          placeholder="Username"
        />
        <TextInput
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          keyboardType="default"
          style={styles.textbox}
        />
        <MyButton 
        title="Login" 
        onPress={() => {
          if (!username || !password) {
            Alert.alert('Error', 'Please enter both username and password.');
          }
          else {
            navigation.navigate('Tabs');
          }
        }
        } />
        
        <MyButton
        title="Register" 
        onPress={() => {
        navigation.navigate('Tabs'); }} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe138ff",
    alignItems: "center",
    justifyContent: "center",
  },
  textbox: { 
    margin: 10,
    height: 30,
    fontSize: 16,
    width: 300,
    borderColor: "black",
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffffff',
},
});
