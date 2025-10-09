// src/screens/RegisterPage.tsx

import React, { useState } from "react";
import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import MyButton from "../components/MyButton";
import { useNavigation } from "@react-navigation/native";

export default function RegisterPage() {
  const navigation = useNavigation();
  const [firstName, setFirst] = React.useState("");
  const [lastName, setLast] = React.useState("");
  const [password, setPassword] = React.useState("");
   const [day, setDay] = useState("");
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState("");
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
         <Text style={styles.heading}>
          Sign up
         </Text> 
          <Text style = {styles.subsection}>
            Basic Details
          </Text>
          <View style={styles.line} />
         <Text style = {styles.generalText}>
          First Name
         </Text>
        <TextInput
          onChangeText={setFirst}
          value={firstName}
          style={styles.textbox}
        />
        <Text style = {styles.generalText}>
          Last Name
         </Text>
         <TextInput
          onChangeText={setLast}
          value={lastName}
          style={styles.textbox}
        />

        <Text style = {styles.generalText}>
          Email
        </Text>
         <TextInput
          onChangeText={setLast}
          value={lastName}
          style={styles.textbox}
        />



        <TextInput
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          keyboardType="default"
          style={styles.textbox}
        />
        <MyButton
          title="Complete registration"
          onPress={() => {
            if (!username || !password) {
              Alert.alert("Error", "Please enter both username and password.");
            } else {
              navigation.navigate("Tabs");
            }
          }}
        />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebd99fff",
  },
  generalText: {
    margin: 15,
    fontSize: 15
  },
  subsection: {
    margin: 10,
    fontSize: 20
  },
  heading:{ 
    fontSize: 32,
    textAlign: 'center',
    fontFamily: "sans-serif"
  },
  textbox: {
    marginHorizontal: 15,
    marginVertical: 5,
    paddingLeft: 10,
    height: 55,
    fontSize: 16,
    width: "92%",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    backgroundColor: "#ffffffff",
    alignSelf: "flex-start",
},
line: {
    borderBottomWidth: 1, // Controls the thickness of the line, a smaller value makes it fainter
    borderBottomColor: '#000', // Sets a light gray color for a faint appearance
    marginVertical: 5, // Adds vertical spacing above and below the line
    marginHorizontal: 8,
    width: '95%', // Makes the line span the full width of its parent container
  },
})
