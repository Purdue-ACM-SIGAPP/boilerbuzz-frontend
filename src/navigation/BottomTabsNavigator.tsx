import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedPage from "../screens/FeedPage";
import FeaturedPage from "../screens/FeaturedPage";
import BoardPage from "../screens/BoardPage";
import AddEventPage from "../screens/AddEventPage";

import type { BottomTabsParamList } from "./types";

const Tab = createBottomTabNavigator<BottomTabsParamList>();

export default function BottomTabsNavigator() {
  return (
    <Tab.Navigator initialRouteName="Feed" screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Feed" component={FeedPage} />
      <Tab.Screen name="Featured" component={FeaturedPage} />
      <Tab.Screen name="Board" component={BoardPage} />
      <Tab.Screen name = "AddEvent" component={AddEventPage} />
      {/* <Tab.Screen name="AddEvent" component = {AddEventPage} /> */}
      
    </Tab.Navigator>
  );
}
