import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedPage from "../screens/HomePage";
import FeaturedPage from "../screens/TrendingPage";
import BoardPage from "../screens/PinnedPage";
import SearchPage from "../screens/FindPage";
import ProfilePage from "../screens/ProfilePage";
import type { BottomTabsParamList } from "./types";
import Images from "../../assets";
import theme from "../theme";
import { TabIcon } from "../components/TabIcon";

const Tab = createBottomTabNavigator<BottomTabsParamList>();

export default function BottomTabsNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopWidth: 1,
          borderTopColor: "black",
          height: 100,
        },
        tabBarLabelStyle: { color: "black" },
      }}
    >
      <Tab.Screen
        name="Home"
        component={FeedPage}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              source={focused ? Images.home_pressed : Images.home}
              label="Home"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Trending"
        component={FeaturedPage}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              source={focused ? Images.podium_pressed : Images.podium}
              label="Trending"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchPage}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              source={focused ? Images.search_pressed : Images.search}
              label="Find Events"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Pinned"
        component={BoardPage}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              source={focused ? Images.thumbtack_pressed : Images.thumbtack}
              label="Pinned"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              source={focused ? Images.user_pressed : Images.user}
              label="Profile"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
