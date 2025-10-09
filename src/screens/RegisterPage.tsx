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
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const inputCheck = () => {
    if (!firstName || !lastName || !email || !username || !password) {
      Alert.alert("Error", "Please fill out all fields.");
    } else {
      navigation.navigate("Tabs");
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Register</Text>
            <Text style={styles.headerSubtitle}>Create a BoilerBuzz Account</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personal Info</Text>
            <Text style={styles.cardSubtitle}>
              Enter your information to create an account.
            </Text>

            {/* First name */}
            <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 5 }}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.textbox}
                value={firstName}
                onChangeText={setFirst}
              />
            </View>

            {/* Last name */}
            <View style={{ flex: 1, marginLeft: 5 }}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.textbox}
                value={lastName}
                onChangeText={setLast}
              />
            </View>
          </View>

            {/* Email */}
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.textbox}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Username */}
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.textbox}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.textbox}
                secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {/* Buttons */}
            <MyButton title="Save & Continue" 
            onPress={inputCheck}
            style={{ marginTop: 50 }} />
            <MyButton
              title="Back to Login"
              onPress={() => navigation.navigate("Login")}
            />
          </View>
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
  scrollContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  header: {
    marginBottom: 25,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#000",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#333",
  },
  card: {
    width: "90%",
    backgroundColor: "#f2ecd7ff",
    borderRadius: 20,
    padding: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
    marginTop: 10,
  },
  textbox: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fafafa",
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backToLogin: {
    textAlign: "center",
    marginTop: 15,
    color: "#555",
    fontSize: 15,
    textDecorationLine: "underline",
  },
});
