import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import theme from "../theme";
import HeaderBanner from "../components/HeaderBanner";

const { width } = Dimensions.get("window");

const items = [
  { id: 1, title: "Item 1", color: "#EDECDD" },
  { id: 2, title: "Item 2", color: "#F5D6C6" },
  { id: 3, title: "Item 3", color: "#C8E1E7" },
  { id: 4, title: "Item 4", color: "#DDEED1" },
  { id: 5, title: "Item 5", color: "#FBE2E5" },
];

export default function FeaturedPage() {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % items.length;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  // Update index when user scrolls manually
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.page}>
      <HeaderBanner title="Trending" />

      {/* Horizontal Scroll Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {items.map((item) => (
          <View
            key={item.id}
            style={[styles.card, { backgroundColor: item.color }]}
          />
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        {items.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    width: width * 0.85,
    marginHorizontal: width * 0.075,
    height: 450,
    borderRadius: 10,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    paddingBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: theme.colors.lightGrey,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: theme.colors.darkGrey,
    width: 10,
    height: 10,
  },
});
