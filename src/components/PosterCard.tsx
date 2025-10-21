import React, { useState } from "react";
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
}: Props) {
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [following, setFollowing] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}> */}

      {/* Club Info */}
      <View style={styles.clubRow}>
        <Image source={{ uri: clubLogo }} style={styles.clubLogo} />
        <Text style={theme.h2Bold}>{clubName}</Text>
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
          <Pressable 
            style={styles.followBtn}
            onPress={()=>setFollowing(!following)}
          >
            <Text style={theme.h2Bold}>
              {following?"Following":"Follow"}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.poster}></View>
      {/* Buttons */}
      <View style={styles.clubRow}>
        {/* Need to make a filled in version of the heart for favorite_filled */}
        <Pressable onPress={()=>{
          liked ? setLikes(likes-1) : setLikes(likes+1);
          setLiked(!liked);
        }}>
          {liked ? (
            <Image source={Images.favorite_filled} style={styles.icons} resizeMode="contain"/>
            ) : (
            <Image source={Images.favorite} style={styles.icons} resizeMode="contain"/>
          )}
        </Pressable>
        <Text style={[theme.h2Bold, { marginLeft: 10 }]}>{likes}</Text>
        <Text style={[theme.h2Bold, { color: "rgba(0, 0, 0, 0.4)", marginLeft: 5 }]}>Likes</Text>
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
          <Pressable onPress={()=>console.log("comment")}>
            <Image source={Images.comment} style={styles.icons} resizeMode="contain"/>
          </Pressable>
          <Pressable onPress={()=>console.log("share")}>
            <Image source={Images.send} style={styles.icons} resizeMode="contain"/>
          </Pressable>
          <Pressable onPress={()=>console.log("pin")}>
            <Image source={Images.pin} style={styles.icons} resizeMode="contain"/>
          </Pressable>
        </View>
      </View>
      {/* Description */}
      <View style={styles.clubRow}>
        <Text style={theme.h2}>{description}</Text>
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
          <Pressable 
            style={styles.seeEventBtn}
            onPress={()=>console.log("go to event page")}
          >
            <Text style={theme.h2Bold}>See Event</Text>
            <Image source={Images.toEvent} style={styles.toEvent} resizeMode="contain"/>
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
    margin: 5
  },
  toEvent: {
    width: 15,
    height: 15,
    marginLeft: 2,
  },
});
