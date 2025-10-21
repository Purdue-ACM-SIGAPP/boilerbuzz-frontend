// src/screens/SettingsPage.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import HeaderBanner from "../components/HeaderBanner";
import theme from "../theme";

// Easy way to test and change different color schemes/themes
const COLORS = {
  background: "#faf7ef",
  cardBackground: "#f9f6ed",
  switchOn: "#cfb991",
  switchOff: "#ccc",
  headerBackground: "#0b142a",
  headerText: "#fff",
};

/* Header Banner (not used anymore, kept here just in case though.)
function SettingsHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  // getting insets to apply top padding so header banner can reach iphone notchs
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backArrow}>❮</Text>
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
    </View>
  );
}
*/


/* Toggle switch functionality */
function ToggleSwitch({
  value,
  onToggle,
}: {
  value: boolean;
  onToggle: (v: boolean) => void;
}) {
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;

  // knob animation
  const toggle = () => {
    const newValue = !value;
    onToggle(newValue);
    Animated.timing(animation, {
      toValue: newValue ? 1 : 0,
      duration: 250, // duration in milliseconds
      useNativeDriver: false,
    }).start();
  };

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.switchOff, COLORS.switchOn],
  });
  const knobPosition = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 32],
  });

  return (
    <TouchableOpacity onPress={toggle} activeOpacity={0.8}>
      <Animated.View style={[styles.switch, { backgroundColor }]}>
        <Animated.View style={[styles.switchKnob, { left: knobPosition }]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

/* Settings page component */
export default function SettingsPage() {
  const navigation = useNavigation();

  // Toggle states for on/off settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] =
    useState(false);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {/* --- HEADER SECTION --- */}
        <View style={{position: "relative"}}>
          
          {/* I changed the banner so that it uses the component in the files,
              but I couldn't find another way to center the title, so
              I'll just leave this temporary fix until there's a
              way to change the banner component to allow for centered
              text and have a button*/}
          <HeaderBanner title="                SETTINGS" /> 

          {/* Back Arrow Overlay */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Tabs", { screen: "Profile" })}
            style={styles.backButton}
          >
            <Text style={styles.backArrow}>❮</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Notifications Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notifications</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Enable notifications:</Text>

              {/* Notifications toggle switch */}
              <ToggleSwitch
                value={notificationsEnabled}
                onToggle={setNotificationsEnabled}
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Enable Email notifications:</Text>

              {/* Email notificaiton toggle switch */}
              <ToggleSwitch
                value={emailNotificationsEnabled}
                onToggle={setEmailNotificationsEnabled}
              />
            </View>
          </View>

          {/* More settings Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>PROFILE</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Content:</Text>
              <ToggleSwitch
                value={notificationsEnabled}
                onToggle={setNotificationsEnabled}
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Feed:</Text>
              <ToggleSwitch
                value={notificationsEnabled}
                onToggle={setNotificationsEnabled}
              />
            </View>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
}

/* Style sheets */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  headerContainer: {
    width: "100%",
    backgroundColor: COLORS.headerBackground,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 35,
    paddingHorizontal: 15,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 15,
    bottom: 15,
    padding: 8,
  },
  backArrow: {
    fontSize: 42,
    color: "#fff",
    fontWeight: "bold",
    fontFamily: theme.fonts.heading,
    marginBottom: 5
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.headerText,
    fontFamily: theme.fonts.heading,
    letterSpacing: 2,
  },

  scrollContainer: {
    alignItems: "center",
    paddingVertical: 25,
  },
  card: {
    width: "90%",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 15,
    padding: 20,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    color: "#000",
    fontFamily: theme.fonts.heading,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
    color: "#333",
    fontFamily: theme.fonts.body,
  },

  switch: {
    width: 54,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  switchKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    position: "absolute",
    top: 2,
  },

  signOutButton: {
    borderWidth: 1.5,
    borderColor: "red",
    borderRadius: 50,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    paddingVertical: 12,
  },
  signOutText: {
    color: "red",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: theme.fonts.body,
  },
});
