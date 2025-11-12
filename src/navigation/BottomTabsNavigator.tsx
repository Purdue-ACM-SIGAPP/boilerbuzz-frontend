// src/navigation/BottomTabsNavigator.tsx
import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";

import FeedPage from "../screens/HomePage";
import FeaturedPage from "../screens/TrendingPage";
import BoardPage from "../screens/PinnedPage";
import SearchPage from "../screens/FindPage";
import ProfilePage from "../screens/ProfilePage";
import AddEventPage from "../screens/AddEventPage";
import CreateClubPage from "../screens/CreateClubPage";

// placeholder empty screen for the Add tab (it won't be navigated to)
const EmptyScreen = () => null;

import AddModals from "../components/AddModals";

import type { BottomTabsParamList } from "./types";
import Images from "../../assets";
import theme from "../theme";
import { TabIcon } from "../components/TabIcon";

const Tab = createBottomTabNavigator<BottomTabsParamList>();

export default function BottomTabsNavigator() {
  const [popupOpen, setPopupOpen] = useState(false);
  const navigation = useNavigation<any>();

  const openPopup = () => setPopupOpen(true);
  const closePopup = () => setPopupOpen(false);

  const handleAddEvent = () => {
    closePopup();
    navigation.navigate("AddEvent" as never); // ensure registered in root stack
  };

  const handleAddClub = () => {
    closePopup();
    navigation.navigate("CreateClub" as never); // ensure registered in root stack
  };

  return (
    <View style={styles.wrapper}>
      <AddModals
        visible={popupOpen}
        onClose={closePopup}
        onAddEvent={handleAddEvent}
        onAddClub={handleAddClub}
        // leftIcon={Images.calendar} // optional, adjust keys to your assets
        // rightIcon={Images.group} // optional, adjust keys to your assets
        size={120} // optional size for bubbles
      />

      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            borderTopWidth: 1,
            borderTopColor: theme.colors.lightGrey,
            height: 100,
          },
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

        {/* Add tab: override tabBarButton to toggle popup instead of navigating */}
        <Tab.Screen
          name="Add"
          component={EmptyScreen}
          options={{
            tabBarButton: (
              props: React.ComponentProps<typeof TouchableOpacity> & ViewProps
            ) => {
              return (
                <TouchableOpacity
                  {...props}
                  activeOpacity={0.9}
                  onPress={openPopup}
                  style={styles.centerButtonWrapper}
                >
                  <View
                    style={[
                      styles.centerButton,
                      popupOpen ? styles.centerButtonActive : undefined,
                    ]}
                  >
                    <TabIcon
                      focused={popupOpen}
                      source={popupOpen ? Images.add_pressed : Images.add}
                      label="Add"
                    />
                  </View>
                </TouchableOpacity>
              );
            },
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerButtonWrapper: {
    // align center, allow the button to float above the tab bar
    position: "absolute",
    alignSelf: "center",
    bottom: Platform.select({ ios: 18, android: 8 }),
    zIndex: 50,
  },
  centerButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.highlight,
    borderWidth: 1,
    borderColor: theme.colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  centerButtonActive: {
    // active style while popup is open
    backgroundColor: theme.colors.navyBlue,
  },
});
