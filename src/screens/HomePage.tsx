import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import type { BottomTabsParamList } from "../navigation/types";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import theme from "../theme";
import HeaderBanner from "../components/HeaderBanner";
import PosterCard from "../components/PosterCard";

type Props = BottomTabScreenProps<BottomTabsParamList, "Home">;

export default function FeaturedPage({ navigation, route }: Props) {

  // ============================== DUMMY DATA ==============================
  const events = [
    {
      id: "1",
      eventTitle: "Mid-Autumn Festival Celebration",
      eventDate: "Oct 12, 2025",
      eventLocation: "Union Ballroom",
      description: "Join us for mooncakes, lanterns, and live performances!",
      clubName: "Asian Student Union",
      clubLogo: "https://i.pravatar.cc/150?img=1",
      attendees: [
        { id: "1", name: "Soleil", avatar: "https://i.pravatar.cc/150?img=2" },
        { id: "2", name: "Alex", avatar: "https://i.pravatar.cc/150?img=3" },
        { id: "3", name: "Linh", avatar: "https://i.pravatar.cc/150?img=4" },
      ],
      comments: [
        { id: "1", user: "Jamie", text: "Can’t wait!" },
        { id: "2", user: "Linh", text: "This looks amazing 💛" },
      ],
    },
    {
      id: "2",
      eventTitle: "Club Fair 2025",
      eventDate: "Sep 30, 2025",
      eventLocation: "Campus Quad",
      description: "Explore 100+ clubs, get free swag, and meet new friends.",
      clubName: "Student Council",
      clubLogo: "https://i.pravatar.cc/150?img=5",
      attendees: [
        { id: "1", name: "Soleil", avatar: "https://i.pravatar.cc/150?img=6" },
        { id: "2", name: "Mia", avatar: "https://i.pravatar.cc/150?img=7" },
      ],
      comments: [{ id: "1", user: "Eli", text: "I’ll definitely stop by!" }],
    },
    {
      id: "3",
      eventTitle: "Coding Hackathon 2025",
      eventDate: "Nov 1, 2025",
      eventLocation: "Innovation Hub",
      description: "24 hours. One project. Free pizza. Let’s build something awesome.",
      clubName: "Tech Club",
      clubLogo: "https://i.pravatar.cc/150?img=8",
      attendees: [
        { id: "1", name: "Soleil", avatar: "https://i.pravatar.cc/150?img=9" },
        { id: "2", name: "Aria", avatar: "https://i.pravatar.cc/150?img=10" },
        { id: "3", name: "Kai", avatar: "https://i.pravatar.cc/150?img=11" },
        { id: "4", name: "Devon", avatar: "https://i.pravatar.cc/150?img=12" },
      ],
      comments: [
        { id: "1", user: "Riley", text: "Team up with me?" },
        { id: "2", user: "Taylor", text: "Hackathon = caffeine + chaos ☕" },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <HeaderBanner title="Home" />
       <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PosterCard {...item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
});
