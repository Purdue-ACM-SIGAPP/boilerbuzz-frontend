// src/screens/LoginPage.tsx

/* Official Purdue colors: 
   #cfb991
   #000000 
   #8e6f3e
   #DAAA00
   #DDB945
   #EBD99F
   #555960
   #6F727B
   #9D9795
   #C4BFC0
*/

import React, { useState } from "react";
import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import MyButton from "../components/MyButton";
import { useNavigation } from "@react-navigation/native";

// Use this to set an image as the background if needed. It just defaults to #ebd99fff when empty
const BACKGROUND_IMAGE_URI = "";

export default function LoginPage() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
    } else {
      navigation.navigate("Tabs");
    }
  };

  const Container = BACKGROUND_IMAGE_URI ? ImageBackground : View;
  const containerProps = BACKGROUND_IMAGE_URI
    ? { source: { uri: BACKGROUND_IMAGE_URI }, style: styles.container }
    : { style: styles.container };

  return (
    <SafeAreaProvider>
      <ImageBackground
        source={BACKGROUND_IMAGE_URI ? { uri: BACKGROUND_IMAGE_URI } : undefined}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.card}>
          <Text style={styles.headerTitle}>
            Login
          </Text>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.textbox}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.textbox}
          />
          <MyButton title="Login" onPress={handleLogin} />
          <MyButton title="Register" onPress={() => navigation.navigate("Register")} />
        </View>
      </ImageBackground>

    </SafeAreaProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebd99f",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#000",
    padding:20
  },
  card: {
    width: "85%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#f2ecd7ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
  },
  textbox: {
    width: "100%",
    height: 50,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#ffffff",
    fontSize: 16,
  },
});
