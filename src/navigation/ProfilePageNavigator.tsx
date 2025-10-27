// src/navigation/RootStackNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfilePage from "../screens/ProfilePage";
import type { ProfilePageParamList } from "./types";
import ClubsPage from "../screens/ClubsPage";
const Stack = createNativeStackNavigator<ProfilePageParamList>();

export default function ProfilePageNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Profile"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Profile" component={ProfilePage} />
        <Stack.Screen name="Clubs" component={ClubsPage} />
        {/*<Stack.Screen name="Settings" component={ProfileSettings} />*/}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
