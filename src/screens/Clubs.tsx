import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import HeaderBanner from "../components/HeaderBanner";
import ClubCard from "../components/ClubCard";
import theme from "../theme";

type SortOption = "recent" | "name";

const clubList = [
  {
    name: "Book Club",
    description: "A club for book lovers to discuss their favorite reads.",
    imageSource: require("../../assets/Clubs.png"),
    followed: true,
  },
  {
    name: "Fitness Club",
    description: "A club for fitness enthusiasts to share tips and workouts.",
    imageSource: require("../../assets/group.png"),
    followed: false,
  },
];

export default function Clubs() {
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const clubs = useMemo(() => {
    if (sortBy === "name") {
      return [...clubList].sort((a, b) => a.name.localeCompare(b.name));
    }

    return [...clubList].sort(
      (a, b) => Number(b.followed) - Number(a.followed),
    );
  }, [sortBy]);

  return (
    <View style={styles.container}>
      <HeaderBanner title="CLUBS" />

      <View style={styles.topRow}>
        <Text style={styles.countText}>{clubs.length} Clubs</Text>

        <TouchableOpacity
          accessibilityRole="button"
          onPress={() =>
            setSortBy((current) => (current === "recent" ? "name" : "recent"))
          }
          style={styles.sortButton}
        >
          <Text style={styles.sortButtonText}>
            {sortBy === "recent" ? "Recently Followed" : "A-Z"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={clubs}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <ClubCard
            name={item.name}
            description={item.description}
            imageSource={item.imageSource}
            followed={item.followed}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  countText: {
    fontSize: 16,
    color: "#9C9C9C",
    fontFamily: theme.fonts.body,
  },
  sortButton: {
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  sortButtonText: {
    fontFamily: theme.fonts.body,
    color: "#111111",
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
});
