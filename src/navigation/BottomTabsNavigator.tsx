// src/navigation/BottomTabsNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedPage from "../screens/FeedPage";
import FeaturedPage from "../screens/FeaturedPage";
import BoardPage from "../screens/BoardPage";

import type { BottomTabsParamList } from "./types";

const Tab = createBottomTabNavigator<BottomTabsParamList>();

export default function BottomTabsNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        headerShown: false, // so stack header shows if used above
        // you can customize tab bar icons / styles here
      }}
    >
      <Tab.Screen name="Feed" component={FeedPage} />
      <Tab.Screen name="Featured" component={FeaturedPage} />
      <Tab.Screen name="Board" component={BoardPage} />
    </Tab.Navigator>
  );
}
