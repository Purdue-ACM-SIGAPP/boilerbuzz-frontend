// App.tsx
import React from "react";
import RootStackNavigator from "./src/navigation/RootStackNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts, JosefinSans_400Regular } from "@expo-google-fonts/josefin-sans";
import { Staatliches_400Regular } from "@expo-google-fonts/staatliches";

export default function App() {
  const _ = useFonts({
    JosefinSans_400Regular,
    Staatliches_400Regular,
  });

  return <GestureHandlerRootView>
    <RootStackNavigator />
  </GestureHandlerRootView>;
}
