import React, { useRef, useState } from "react";
import { View, TextInput, StyleSheet, Dimensions, Button, TouchableOpacity } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function SearchBar() {
    const [isFocused, setIsFocused] = useState(false);
    const textInputRef = useRef<null | TextInput>(null);
    return <View style={styles.bar}>
        <TextInput
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            ref={textInputRef}
            placeholder="Search for an event..."/>
        <View style={isFocused ? styles.clear : styles.hidden}>
            <TouchableOpacity
                onPress={() => {
                    if (textInputRef && textInputRef.current) {
                        textInputRef.current.setNativeProps({ text: "" });
                    }
                }}>
                <AntDesign name="close" size={5} color="black"/>
            </TouchableOpacity>
        </View>
    </View>
}

const styles = StyleSheet.create({
    bar: {
        width: Dimensions.get("window").width * 0.8,
        height: 35,
        borderRadius: 25,
        borderColor: "black",
        borderWidth: 2,
        padding: 5,
        paddingLeft: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    clear: {
        width: 20,
        height: 20,
        borderRadius: 25,
        borderColor: "black",
        borderWidth: 2,
    },
    hidden: {
        display: "none",
    }
});