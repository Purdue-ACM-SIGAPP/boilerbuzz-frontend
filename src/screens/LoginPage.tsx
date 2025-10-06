import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Alert,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MyButton from "../components/MyButton";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";

import theme from "../theme";

type LoginPageNav = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function LoginPage() {
  const navigation = useNavigation<LoginPageNav>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
    } else {
      navigation.navigate("Tabs");
    }
  };

  const handleRegister = () => {
    navigation.navigate("Tabs");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.circle} />
      {/* Uncomment below when ready */}
      {/* <TextInput
        onChangeText={setUsername}
        value={username}
        style={styles.textbox}
        placeholder="Username"
      />
      <TextInput
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry
        style={styles.textbox}
      />
      <MyButton title="Login" onPress={handleLogin} />
      <MyButton title="Register" onPress={handleRegister} /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  textbox: {
    margin: 10,
    height: 40,
    fontSize: 16,
    width: 300,
    borderColor: "black",
    borderWidth: 2,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
  },
});
