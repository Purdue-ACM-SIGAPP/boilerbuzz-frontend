import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

export default function FilterMenu() {
    return <View style={styles.container}>
        <View style={styles.filterContainer}>
            <FontAwesome6 name="filter" size={40} color="black"/>
        </View>
        <ScrollView horizontal={true} style={styles.dateContainer}>
            <TouchableOpacity style={styles.dateFilterItem}>
                <Text>Day1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateFilterItem}>
                <Text>Day2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateFilterItem}>
                <Text>Day3</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateFilterItem}>
                <Text>Day4</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateFilterItem}>
                <Text>Day5</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateFilterItem}>
                <Text>Day6</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles.dateFilterItem, ...styles.lastDateFilterItem}}>
                <Text>Day7</Text>
            </TouchableOpacity>
        </ScrollView>
    </View>
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
    },
    filterContainer: {
        paddingRight: 8,
        borderRightColor: "black",
        borderRightWidth: 1,
    },
    dateContainer: {
        paddingBottom: 10,
    },
    dateFilterItem: {
        borderRightColor: "black",
        borderRightWidth: 1,
        padding: 8,
        height: 50,
        width: 60,
    },
    lastDateFilterItem: {
        borderRightWidth: 0,
    },
    hidden: {
        display: "none",
    }
});