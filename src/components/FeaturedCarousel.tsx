import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import theme from "../theme";

const { width } = Dimensions.get("window");

/**
 * Type Definitions
 */
interface FeaturedCarouselProps {
  items: { id: number; color: string; title?: string }[];
  autoScrollInterval?: number; // in milliseconds
}

/**
 * Component
 */
const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  items,
  autoScrollInterval = 3000,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * Auto-scroll effect
   */
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % items.length;
      scrollRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, autoScrollInterval);

    return () => clearInterval(timer);
  }, [currentIndex, autoScrollInterval, items.length]);

  /**
   * Scroll event listener
   */
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      {/* Top Spacer */}
      <View style={styles.spacer} />

      {/* Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        contentContainerStyle={styles.scrollContent}
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
        {items.map((_, index) => {
          const isActive = currentIndex === index;
          return (
            <View
              key={index}
              style={[styles.dot, isActive && styles.activeDot]}
            />
          );
        })}
      </View>
    </View>
  );
};

export default FeaturedCarousel;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },

  spacer: {
    height: 70,
  },

  scrollContent: {
    alignItems: "center",
  },

  card: {
    width: width * 0.85,
    height: 400,
    borderRadius: 10,
    marginHorizontal: width * 0.075,
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
    marginHorizontal: 6,
    backgroundColor: theme.colors.lightGrey,
  },

  activeDot: {
    width: 10,
    height: 10,
    backgroundColor: theme.colors.darkGrey,
  },
});
