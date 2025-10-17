import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text, Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";

import theme from "../theme";

type LoginPageNav = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function LoginPage() {
  const navigation = useNavigation<LoginPageNav>();

  const handleLogin = () => {
    navigation.navigate("Tabs");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.upper}></View>
      <View style={styles.container}>
        <View style={{ height: 50 }}></View>
        <Text style={theme.titleBlack}>BOILERBUZZ</Text>
        <View style={{ height: 20 }}></View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={theme.h1}>Login</Text>
        </TouchableOpacity>

        {/* Sign Up Text */}
        <Text style={theme.h2}>Don't have an account?</Text>
        <View style={{ height: 20 }}></View>
        <TouchableOpacity onPress={handleLogin}>
          <Text style={theme.h1}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.highlight,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  upper: {
    zIndex: 1,
    backgroundColor: theme.colors.background,
    width: "100%",
    height: "70%",
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    marginTop: -100,
  },
  loginButton: {
    width: 150,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 35,
  },
});
