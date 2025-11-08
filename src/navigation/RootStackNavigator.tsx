// src/navigation/RootStackNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabsNavigator from "./BottomTabsNavigator";
import LoginPage from "../screens/LoginPage";
import RegisterPage from "../screens/RegisterPage";
import SettingsPage from "../screens/SettingsPage";
import ProfilePage from "../screens/ProfilePage";
import type { RootStackParamList } from "./types";
import ClubsPage from "../screens/ClubsPage";
const Stack = createNativeStackNavigator<RootStackParamList>();
 
function ProfilePages() {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Profile" component={ProfilePage} />
      <Stack.Screen name="Clubs" component={ClubsPage} />
      <Stack.Screen name="Settings" component={SettingsPage} />
    </Stack.Navigator>
  );
}
export default function RootStackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Tabs" component={BottomTabsNavigator} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="ProfilePages" component={ProfilePages} />
        {/* Add other screens here as needed, e.g.: */}
        {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
