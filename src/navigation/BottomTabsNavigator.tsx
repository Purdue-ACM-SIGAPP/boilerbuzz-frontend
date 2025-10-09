import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "../screens/HomePage";
import TrendingPage from "../screens/TrendingPage";
import EventsPage from "../screens/EventsPage";
import PinnedPage from "../screens/PinnedPage";
import ProfilePage from "../screens/ProfilePage";
import { Ionicons } from '@expo/vector-icons';

import type { BottomTabsParamList } from "./types";

const Tab = createBottomTabNavigator<BottomTabsParamList>();

export default function BottomTabsNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Trending') {
            iconName = focused ? 'podium' : 'podium-outline';
          } else if (route.name === 'Events') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Pinned') {
            iconName = focused ? 'pin' : 'pin-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = focused ? 'add' : 'add-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Trending" component={TrendingPage} />
      <Tab.Screen name="Events" component={EventsPage} />
      <Tab.Screen name="Pinned" component={PinnedPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}
