import React from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../theme";

type Props = {
  id?: string;
  user: string;
  text: string;
};

export default function Comment({ user, text }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.user}>{user}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  user: {
    ...theme.h2Bold,
    marginBottom: 2,
  },
  text: {
    ...theme.h2,
  },
});
