import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Images from "../../assets";
import theme from "../theme";

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);
  const textInputRef = useRef<TextInput | null>(null);

  const handleClear = () => {
    if (textInputRef.current) {
      textInputRef.current.clear();
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss(); // closes keyboard
        setIsFocused(false); // resets state
      }}
    >
      <View style={styles.container}>
        <View style={styles.bar}>
          <TextInput
            ref={textInputRef}
            style={[theme.h2, styles.input]}
            placeholder="Search something..."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            returnKeyType="search"
          />

          <TouchableOpacity
            style={styles.iconContainer}
            onPress={isFocused ? handleClear : undefined}
          >
            <Image
              source={isFocused ? Images.cross : Images.search}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    backgroundColor: theme.colors.navyBlue,
    paddingBottom: 15,
  },
  bar: {
    width: "85%",
    height: 40,
    backgroundColor: "white",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingRight: 10,
  },
  iconContainer: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 25,
    height: 25,
  },
});
