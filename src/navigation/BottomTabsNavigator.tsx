import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedPage from "../screens/FeedPage";
import FeaturedPage from "../screens/FeaturedPage";
import BoardPage from "../screens/BoardPage";
import SearchPage from "../screens/SearchPage";
import ProfilePage from "../screens/ProfilePage";
import type { BottomTabsParamList } from "./types";

const Tab = createBottomTabNavigator<BottomTabsParamList>();

export default function BottomTabsNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Home"
        component={FeedPage}
        options={{
          tabBarLabel: "Home",
          // tabBarIcon: ({ focused }) => (
            // <Image
            //   source={
            //     focused
                  // ? require("../../../assets/icons/home_pressed.png")
                  // : require("../../../assets/icons/home.png")
            //   }
            //   style={{
            //     width: 24,
            //     height: 24,
            //     tintColor: focused ? "#007AFF" : "#8e8e93", // optional tint
            //   }}
            // />
          // ),
        }}
      />
      <Tab.Screen name="Trending" component={FeaturedPage} />
      <Tab.Screen name="Search" component={SearchPage} />
      <Tab.Screen name="Pinned" component={BoardPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}
