// ProfilePage.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import ClubBanner from "../components/ClubBanner"; // adjust path if needed

type FilterKey = "pinned" | "rsvp" | "past" | "invited";

const defaultBio =
  "Description Description\nDescription Description\nDescription";

// NOTE: Replace the default avatar import with your local asset if you have one.
const defaultAvatarUri = require("../../assets/profile.png"); // fallback to placeholder

export default function ProfilePage() {
  const navigation = useNavigation<any>();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [username, setUsername] = useState("Name");
  const [bio, setBio] = useState(defaultBio);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("rsvp");

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission required",
            "Please allow photo access to change your profile image."
          );
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!result.cancelled) {
        // expo v48+ uses result.assets[0].uri; older versions use result.uri
        // handle both shapes defensively
        // @ts-ignore
        const uri = result.assets?.[0]?.uri ?? (result as any).uri;
        if (uri) setAvatarUri(uri);
      }
    } catch (err) {
      console.warn("Image picker error", err);
    }
  };

  const onEditProfile = () => {
    // navigate to your edit profile screen or open a modal
    // example navigation to an EditProfile screen (you can change)
    navigation.navigate?.("EditProfile" as never);
  };

  const onOpenClubs = () => {
    // empty navigate as requested
    navigation.navigate?.("Clubs" as never);
  };

  // Example stub for filter logic — you can plug your events array in here.
  const getFilteredEvents = (filter: FilterKey) => {
    // Replace this with your real event data and filtering logic.
    // For now, return an empty array, but the function demonstrates how you'd select data.
    // Example:
    // if (filter === 'pinned') return events.filter(e => e.pinned);
    // else if (filter === 'rsvp') return events.filter(e => e.rsvpStatus === 'going');
    return [];
  };

  // Applies when user taps a filter button
  const onSelectFilter = (filter: FilterKey) => {
    setActiveFilter(filter);
    const filtered = getFilteredEvents(filter);
    // TODO: set state with filtered events and feed into your FlatList below
    // setFilteredEvents(filtered);
    console.log("Selected filter", filter, "filtered count", filtered.length);
  };

  return (
    <View style={styles.page}>
      {/* Header section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.pageTitle}>PROFILE</Text>
        </View>

        <View style={styles.profileRow}>
          {/* Avatar */}
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : defaultAvatarUri ? (
              <Image source={defaultAvatarUri as any} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {username?.[0]?.toUpperCase() ?? "?"}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Name + bio */}
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.username}>{username}</Text>
              <TouchableOpacity
                style={styles.settingsBtn}
                onPress={onEditProfile}
              >
                <Text style={styles.settingsText}>Settings {">"}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.bio}>{bio}</Text>
          </View>
        </View>
      </View>

      {/* Clubs banner */}
      <ClubBanner onPress={onOpenClubs} title="Clubs" subtitle="20 Following" />

      {/* Divider */}
      <View style={styles.hr} />

      {/* Filter buttons */}
      <View style={styles.filterRow}>
        <FilterButton
          label="Pinned"
          isActive={activeFilter === "pinned"}
          onPress={() => onSelectFilter("pinned")}
        />
        <FilterButton
          label="RSVP"
          isActive={activeFilter === "rsvp"}
          onPress={() => onSelectFilter("rsvp")}
        />
        <FilterButton
          label="Past"
          isActive={activeFilter === "past"}
          onPress={() => onSelectFilter("past")}
        />
        <FilterButton
          label="Invited"
          isActive={activeFilter === "invited"}
          onPress={() => onSelectFilter("invited")}
        />
      </View>

      {/* Placeholder: below this point you will put your FlatList of events filtered by `activeFilter`. */}
      <View style={styles.placeholder}>
        <Text style={{ color: "#777" }}>
          Events list goes here (FlatList) — filtered by: {activeFilter}
        </Text>
      </View>
    </View>
  );
}

type FilterButtonProps = {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
};
const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  isActive = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[filterStyles.button, isActive ? filterStyles.active : undefined]}
    >
      <Text
        style={[
          filterStyles.label,
          isActive ? filterStyles.activeLabel : undefined,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fbf8f3",
  },
  header: {
    paddingBottom: 12,
    backgroundColor: "#fbf8f3",
    // top bar / dark section is optional — replicate the image if you want
  },
  headerTop: {
    backgroundColor: "#07112a", // dark/navy header color (approx)
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  pageTitle: {
    color: "#fff",
    fontSize: 44,
    fontWeight: "800",
    letterSpacing: 2,
  },
  profileRow: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: "#ddd",
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 36,
    color: "#777",
    fontWeight: "700",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 20,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  username: {
    fontSize: 34,
    fontWeight: "700",
  },
  settingsBtn: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderColor: "#bdbdbd",
  },
  settingsText: {
    fontSize: 16,
    fontWeight: "600",
  },
  bio: {
    marginTop: 10,
    color: "#9b9b9b",
    lineHeight: 20,
  },
  hr: {
    height: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 16,
    marginVertical: 10,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  placeholder: {
    marginTop: 24,
    paddingHorizontal: 24,
    alignItems: "flex-start",
  },
});

const filterStyles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70,
  },
  active: {
    backgroundColor: "#ecefe2",
  },
  label: {
    fontSize: 14,
    color: "#222",
  },
  activeLabel: {
    fontWeight: "700",
  },
});
