import React from "react";
import { View, Image, Text } from "react-native";
import theme from "../theme";

/**
 *
 * Tab icon components that renders a round-bordered rectangle with
 * screen icon and labels
 *
 */

export const TabIcon = ({
  focused, // signifies whether user is on the screen or not
  source,
  label,
}: {
  focused: boolean;
  source: any;
  label: string;
}) => {
  return (
    <View style={{ marginTop: 40 }}>
      <View // round-bordered rectangle
        style={{
          backgroundColor: focused ? theme.colors.highlight : "transparent",
          borderRadius: 8,
          width: 75,
          height: 60,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image // screen icon
          source={source}
          style={{
            width: 25,
            height: 25,
            tintColor: "#000",
            marginBottom: 5,
          }}
        />
        <Text // screen label
          style={theme.h3}
        >
          {label}
        </Text>
      </View>
    </View>
  );
};
