import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "../screens/HomePage";
import TrendingPage from "../screens/TrendingPage";
import EventsPage from "../screens/EventsPage";
import PinnedPage from "../screens/PinnedPage";
import ProfilePage from "../screens/ProfilePage";

import type { BottomTabsParamList } from "./types";

const Tab = createBottomTabNavigator<BottomTabsParamList>();

export default function BottomTabsNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Trending" component={TrendingPage} />
      <Tab.Screen name="Events" component={EventsPage} />
      <Tab.Screen name="Pinned" component={PinnedPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}
