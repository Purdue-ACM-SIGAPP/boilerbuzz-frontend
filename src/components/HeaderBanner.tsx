import React from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../theme";

/**
 *
 * Top banner component of each page with a header title
 *
 */

export const HeaderBanner = ({ title }: { title: string }) => {
  return (
    <View style={styles.container}>
      <Text style={theme.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: theme.colors.navyBlue,
    paddingTop: 60,
    paddingBottom: 18,
    paddingHorizontal: 16,
  },
});

export default HeaderBanner;
