import React, { useRef } from "react";
import { Animated, TouchableOpacity, Text, StyleSheet } from 'react-native';

type MyButtonProps = {
  title: string;
  onPress: () => void;
  image?: any; // optional image if needed
};



export default function MyButton({ title, onPress }: MyButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => { // Animation for holding/pressing button
    Animated.spring(scale, { // get a bouncy animation
      toValue: 0.95, // Shrink button to 95% of size
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => { //letting go of button
    Animated.spring(scale, {
      toValue: 1, // Scale back to original size
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={styles.button}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}


const styles = StyleSheet.create({
  button: {
    backgroundColor: '#cfb991', //#daaa00 is also a purdue color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    margin: 10,
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  image: {
    width: 24,
    height: 24, 
    marginRight: 8,
  },
  text: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: "Arial"
  },
});


/*

copy and paste for use

import MyButton from "../components/button";


<MyButton title="Go to Board Page" onPress={() => {
        navigation.navigate('Board'); }} />

*/
