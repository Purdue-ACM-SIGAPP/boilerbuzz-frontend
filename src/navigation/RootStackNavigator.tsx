// src/navigation/RootStackNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "@clerk/clerk-expo";

import BottomTabsNavigator from "./BottomTabsNavigator";
import LoginPage from "../screens/LoginPage";
import RegisterPage from "../screens/RegisterPage";
import type { RootStackParamList } from "./types";
import SettingsPage from "../screens/SettingsPage";
import ProfilePage from "../screens/ProfilePage";
import AddEventPage from "../screens/AddEventPage";
import CreateClubPage from "../screens/CreateClubPage";
import Clubs from "../screens/Clubs";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        //initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        {isSignedIn ? (
          // User is signed in
          <>
            <Stack.Screen name="Tabs" component={BottomTabsNavigator} />
            <Stack.Screen name="Settings" component={SettingsPage} />
            <Stack.Screen name="Profile" component={ProfilePage} />
            <Stack.Screen name="AddEvent" component={AddEventPage} />
            <Stack.Screen name="CreateClub" component={CreateClubPage} />
            <Stack.Screen name="Clubs" component={Clubs} />
          </>
        ) : (
          // User is not signed in
          <>
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="Register" component={RegisterPage} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
