import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../theme";
import Images from "../../assets";

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
  id?: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  description: string;
  clubName: string;
  clubLogo: string;
  attendees: User[];
  comments: Comment[];
  onPressComment?: (id?: string) => void;
  onPress?: () => void;
};

export default function PosterCard({
  id,
  eventTitle,
  eventDate,
  eventLocation,
  description,
  clubName,
  clubLogo,
  attendees,
  comments,
  onPressComment,
  onPress,
}: Props) {
  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}> */}

      {/* Club Info */}
      <View style={styles.clubRow}>
        <Image source={{ uri: clubLogo }} style={styles.clubLogo} />
        <Text style={theme.h2Bold}>{clubName}</Text>
        <View
          style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}
        >
          <Pressable
            style={styles.followBtn}
            // onPress={onPressFunction}
          >
            <Text style={theme.h2Bold}>Follow</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.poster}></View>
      {/* Buttons */}
      <View style={styles.clubRow}>
        <Image
          source={Images.favorite}
          style={styles.icons}
          resizeMode="contain"
        />
        <Text style={[theme.h2Bold, { marginLeft: 10 }]}>101</Text>
        <Text
          style={[theme.h2Bold, { color: "rgba(0, 0, 0, 0.4)", marginLeft: 5 }]}
        >
          Likes
        </Text>
        <View
          style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}
        >
          <TouchableOpacity
            onPress={() => onPressComment?.(id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Image
              source={Images.comment}
              style={styles.icons}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Image
            source={Images.send}
            style={styles.icons}
            resizeMode="contain"
          />
          <Image
            source={Images.pin}
            style={styles.icons}
            resizeMode="contain"
          />
        </View>
      </View>
      {/* Description */}
      <View style={styles.clubRow}>
        <View style={styles.description}>
          <Text style={theme.h2}>{description}</Text>
        </View>
        <View
          style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}
        >
          <Pressable
            style={styles.seeEventBtn}
            // onPress={onPressFunction}
          >
            <Text style={theme.h2Bold}>See Event</Text>
            <Image
              source={Images.toEvent}
              style={styles.toEvent}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>

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
  description: {
    marginRight: 10,
  },
  poster: {
    backgroundColor: theme.colors.highlight,
    width: "100%",
    height: 400,
  },
  followBtn: {
    backgroundColor: "#feb210",
    height: 30,
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  seeEventBtn: {
    flexDirection: "row",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "gray",
    height: 30,
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  icons: {
    width: 30,
    height: 30,
    margin: 5,
  },
  toEvent: {
    width: 15,
    height: 15,
    marginLeft: 2,
  },
});
