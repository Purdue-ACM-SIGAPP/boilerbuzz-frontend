import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView, SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const Banner = ({ title, onBack }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.banner, { paddingTop: insets.top }]}>
      <TouchableOpacity
        onPress={onBack}
        style={[styles.backButton, { top: insets.top }]}
      >
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

export default function SettingsPage() {
  const navigation = useNavigation();
  const handleBack = () => navigation.goBack();

  // Switch states
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <Banner title="Settings" onBack={handleBack} />

        {/* Centered card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notifications</Text>

          {/* Notification Switch */}
          <View style={styles.row}>
            <Text style={styles.label}>Enable notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#ccc", true: "#cbb88aff" }}
              thumbColor={notificationsEnabled ? "#fff" : "#fff"}
            />
          </View>

          {/* Email Notification Switch */}
          <View style={styles.row}>
            <Text style={styles.label}>Enable email notifications</Text>
            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              trackColor={{ false: "#ccc", true: "#cbb88aff" }}
              thumbColor={emailEnabled ? "#fff" : "#fff"}
            />
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity style={styles.signOutButton} onPress={() => alert("Sign Out")}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fef8ef",
    alignItems: "center",
  },
  banner: {
    width: "100%",
    backgroundColor: "#000361ff",
    height: 100,
    justifyContent: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 15,
    justifyContent: "center",
    height: "100%",
  },
  backText: {
    color: "#fff",
    fontSize: 24,
  },
  titleContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginTop: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  signOutButton: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#e74c3c",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  signOutText: {
    color: "#e74c3c",
    fontSize: 16,
    fontWeight: "bold",
  },
});
