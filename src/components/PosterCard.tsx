import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../theme";
import Images from "../../assets";

// ==============================
// Type Definitions
// ==============================
type User = {
  id: string;
  name: string;
  avatar: string;
};

type Comment = {
  id: string;
  user: string;
  text: string;
};

interface PosterCardProps {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  description: string;
  clubName: string;
  clubLogo: string;
  attendees: User[];
  comments: Comment[];
  onPress?: () => void;
}

/**
 * Component
 */
export default function PosterCard({
  eventTitle,
  eventDate,
  eventLocation,
  description,
  clubName,
  clubLogo,
  attendees,
  comments,
  onPress,
}: PosterCardProps) {
  return (
    <View style={styles.container}>
      {/* Club Header */}
      <View style={styles.clubHeader}>
        <Image source={{ uri: clubLogo }} style={styles.clubLogo} />
        <Text style={theme.h2Bold}>{clubName}</Text>

        <View style={styles.rightAlignedRow}>
          <Pressable style={styles.followBtn}>
            <Text style={theme.h2Bold}>Follow</Text>
          </Pressable>
        </View>
      </View>

      {/* Poster Image */}
      <View style={styles.poster} />

      {/* Action Row (Likes, Comments, etc.) */}
      <View style={styles.actionRow}>
        <Image source={Images.favorite} style={styles.icon} resizeMode="contain" />
        <Text style={[theme.h2Bold, styles.likeCount]}>101</Text>
        <Text style={[theme.h2Bold, styles.likeLabel]}>Likes</Text>

        <View style={styles.rightAlignedRow}>
          <Image source={Images.comment} style={styles.icon} resizeMode="contain" />
          <Image source={Images.send} style={styles.icon} resizeMode="contain" />
          <Image source={Images.pin} style={styles.icon} resizeMode="contain" />
        </View>
      </View>

      {/* Description + Event Button */}
      <View style={styles.footerRow}>
        <View style={styles.descriptionContainer}>
          <Text style={theme.h2}>{description}</Text>
        </View>

        <View style={styles.seeMoreRow}>
          <Pressable style={styles.seeEventBtn}>
            <Text style={theme.h2Bold}>See Event</Text>
            <Image source={Images.toEvent} style={styles.toEventIcon} resizeMode="contain" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "95%",
    alignSelf: "center",
    padding: 16,
    marginVertical: 20,
    borderTopWidth: 0.5,
    borderTopColor: "black",
  },

  // --- Club Header ---
  clubHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  clubLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  followBtn: {
    backgroundColor: "#feb210",
    height: 30,
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  // --- Poster ---
  poster: {
    backgroundColor: theme.colors.highlight,
    width: "100%",
    height: 400,
    marginVertical: 8,
  },

  // --- Action Row ---
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    width: 30,
    height: 30,
    margin: 5,
  },
  likeCount: {
    marginLeft: 10,
  },
  likeLabel: {
    marginLeft: 5,
    color: "rgba(0, 0, 0, 0.4)",
  },

  // --- Footer ---
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  descriptionContainer: {
    flexShrink: 1,
    marginRight: 10,
  },
  seeEventBtn: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "gray",
    height: 30,
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  toEventIcon: {
    width: 15,
    height: 15,
    marginLeft: 2,
  },

  // --- Shared Helpers ---
  rightAlignedRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  seeMoreRow: {
    flexShrink: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
