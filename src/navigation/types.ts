// src/navigation/types.ts
import type { NavigatorScreenParams } from "@react-navigation/native";

export type BottomTabsParamList = {
  Feed: undefined;
  Featured: undefined;
  Board: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<BottomTabsParamList> | undefined;
  Login: undefined;
  // Add more stack-level screens here if needed
};