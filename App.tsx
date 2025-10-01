// App.tsx
import React from "react";
import RootStackNavigator from "./src/navigation/RootStackNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return <GestureHandlerRootView>
    <RootStackNavigator />
  </GestureHandlerRootView>;
}
