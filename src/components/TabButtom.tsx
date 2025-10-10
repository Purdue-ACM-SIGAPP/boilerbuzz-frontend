import React from "react";
import { View, Image, Text } from "react-native";
import theme from "../theme";

export const TabIcon = ({
  focused,
  source,
  label,
}: {
  focused: boolean;
  source: any;
  label: string;
}) => {
    return (
      <View style={{marginTop: 40}}>
        <View
          style={{
            backgroundColor: focused ? theme.colors.highlight : "transparent",
            borderRadius: 8,
            width: 80,
            height: 60,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={source}
            style={{
              width: 25,
              height: 25,
              tintColor: "#000",
              marginBottom: 5,
            }} />
          <Text
            style={{
              color: "#000",
              fontWeight: "600",
              fontSize: 12,
            }}
          >
            {label}
          </Text>
        </View>
      </View>
    );
  };
