import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../theme";

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

type Props = {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  description: string;
  clubName: string;
  clubLogo: string;
  attendees: User[];
  comments: Comment[];
  onPress?: () => void;
};

export default function EventCard({
  eventTitle,
  eventDate,
  eventLocation,
  description,
  clubName,
  clubLogo,
  attendees,
  comments,
  onPress,
}: Props) {
  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}> */}

      {/* Club Info */}
      <View style={styles.clubRow}>
        <Image source={{ uri: clubLogo }} style={styles.clubLogo} />
        <Text style={theme.h2Bold}>{clubName}</Text>
      </View>

      <View style={styles.poster}></View>
      {/* Description */}
      <Text style={theme.h2}>{description}</Text>

      {/* Attendees */}
      <View style={styles.attendeeRow}>
        {attendees.slice(0, 2).map((user) => (
          <Image
            key={user.id}
            source={{ uri: user.avatar }}
            style={styles.avatar}
          />
        ))}
        {attendees.length > 2 && (
          <Text style={theme.h2}> +{attendees.length - 2}</Text>
        )}
      </View>

      {/* Comments */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={theme.h2Bold}>{item.user}</Text>
            <Text style={theme.h2}>{item.text}</Text>
          </View>
        )}
      />
      {/* </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopColor: "black",
    borderTopWidth: 0.5,
    width: "95%",
    padding: 16,
    marginVertical: 20,
    alignSelf: "center",
  },
  clubRow: {
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
  attendeeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: -10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  comment: {
    backgroundColor: theme.colors.highlight,
    borderRadius: 10,
    padding: 8,
    marginTop: 6,
  },
  poster: {
    backgroundColor: theme.colors.highlight,
    width: "100%",
    height: 400,
  },
});
