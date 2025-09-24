import React from "react";
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type MyButtonProps = {
  title: string;
  onPress: () => void;
};

export default function MyButton({ title, onPress }: MyButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#cfb991', //#daaa00 for brighter yellow
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: "Arial"
  },
});
