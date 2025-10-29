// src/screens/CreateClubPage.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBanner from "../components/HeaderBanner";
import theme from "../theme";
import MyButton from "../components/MyButton";

export default function CreateClubPage() {
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [clubName, setClubName] = useState("");
  const [primaryAdvisor, setPrimaryAdvisor] = useState("");
  const [members, setMembers] = useState(""); // comma separated list or single line

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission required",
            "Please allow photo access to choose a club logo."
          );
        }
      }
    })();
  }, []);

  const pickLogo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1], // force square crop
      });

      // new expo shape: result.assets[0].uri ; older: result.uri
      // safe-check both shapes:
      // @ts-ignore
      const uri = result?.assets?.[0]?.uri ?? (result as any).uri;
      if (!result.cancelled && uri) {
        setLogoUri(uri);
      }
    } catch (err) {
      console.warn("Image picker error", err);
      Alert.alert("Image error", "Could not pick an image.");
    }
  };

  const handleCreate = () => {
    // Basic validation: require club name and at least 5 members (split by comma or newline)
    const memberList = members
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    if (!clubName.trim()) {
      Alert.alert("Validation", "Please enter a Club Name.");
      return;
    }
    if (!primaryAdvisor.trim()) {
      Alert.alert("Validation", "Please enter a Primary Advisor.");
      return;
    }

    // For now, just log — replace this with your API call or navigation
    console.log({
      clubName,
      primaryAdvisor,
      members: memberList,
      logoUri,
    });
    Alert.alert("Club created", `${clubName} has been created.`);
    // Optionally clear form:
    // setClubName(""); setPrimaryAdvisor(""); setMembers(""); setLogoUri(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBanner title="CREATE CLUB" />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inner}>
            <Text style={styles.label}>Logo</Text>
            <TouchableOpacity
              style={styles.logoContainer}
              onPress={pickLogo}
              activeOpacity={0.8}
            >
              {logoUri ? (
                <Image source={{ uri: logoUri }} style={styles.logoImage} />
              ) : (
                <View style={styles.logoPlaceholder}>
                  <Text style={styles.plus}>+</Text>
                </View>
              )}
            </TouchableOpacity>

            <Text style={[styles.label, { marginTop: 24 }]}>
              Club Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter club name"
              placeholderTextColor={theme.colors.darkGrey}
              value={clubName}
              onChangeText={setClubName}
              returnKeyType="done"
            />

            <Text style={[styles.label, { marginTop: 16 }]}>
              Primary Advisor <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Advisor name"
              placeholderTextColor={theme.colors.darkGrey}
              value={primaryAdvisor}
              onChangeText={setPrimaryAdvisor}
              returnKeyType="done"
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Add Members </Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Add member emails or names, separated by commas"
              placeholderTextColor={theme.colors.darkGrey}
              value={members}
              onChangeText={setMembers}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            {/* Spacer before button */}
            <View style={{ height: 28 }} />

            <MyButton title="Create Club" onPress={handleCreate} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const LOGO_SIZE = 120;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 36,
  },
  inner: {
    flex: 1,
    alignItems: "stretch",
  },
  label: {
    fontFamily: theme.fonts.body,
    color: theme.colors.darkGrey,
    fontSize: 18,
    marginBottom: 8,
  },
  required: {
    color: "#D9534F",
    fontSize: 16,
  },
  logoContainer: {
    alignSelf: "center",
    marginTop: 4,
  },
  logoPlaceholder: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.lightGrey,
    backgroundColor: theme.colors.highlight,
    alignItems: "center",
    justifyContent: "center",
  },
  plus: {
    fontSize: 36,
    color: theme.colors.darkGrey,
  },
  logoImage: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: 10,
    resizeMode: "cover",
  },
  input: {
    backgroundColor: "transparent",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.lightGrey,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    fontFamily: theme.fonts.body,
  },
  multilineInput: {
    minHeight: 60,
    maxHeight: 120,
  },
});
