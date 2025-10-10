import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedPage from "../screens/FeedPage";
import FeaturedPage from "../screens/FeaturedPage";
import BoardPage from "../screens/BoardPage";
import SearchPage from "../screens/SearchPage";
import ProfilePage from "../screens/ProfilePage";
import type { BottomTabsParamList } from "./types";
import Images from "../../assets";
import { Image } from "react-native";

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
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? Images.home_pressed : Images.home}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? "#00000" : "#00000",
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Trending"
        component={FeaturedPage}
        options={{
          tabBarLabel: "Trending",
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? Images.podium_pressed : Images.podium}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? "#00000" : "#00000",
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchPage}
        options={{
          tabBarLabel: "Find Events",
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? Images.search_pressed : Images.search}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? "#00000" : "#00000",
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Pinned"
        component={BoardPage}
        options={{
          tabBarLabel: "Pinned",
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? Images.thumbtack_pressed : Images.thumbtack}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? "#00000" : "#00000",
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? Images.user_pressed : Images.user}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? "#00000" : "#00000",
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
