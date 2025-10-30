// src/navigation/types.ts
import type { NavigatorScreenParams } from "@react-navigation/native";

export type BottomTabsParamList = {
  Home: undefined;
  Trending: undefined;
  Search: undefined;
  Pinned: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<BottomTabsParamList> | undefined;
  Login: undefined;
  Register: undefined;
  Settings: undefined;
};
