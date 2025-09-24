import React from "react";
import { Image, View, StyleSheet } from "react-native";

const FeedPoster = ({ source, style }) => {
  return <Image source={source} style={[styles.image, style]} />;
};

 
  

const styles = StyleSheet.create({
  image: {
    resizeMode: "contain",
  },
});

export default FeedPoster;