// src/navigation/types.ts
import type { NavigatorScreenParams } from "@react-navigation/native";

export type BottomTabsParamList = {
  Home: undefined;
  Search: undefined;
  Add: undefined;
  Pinned: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<BottomTabsParamList> | undefined;
  Login: undefined;
  Register: undefined;
  Settings: undefined;
  Profile: undefined;
  Clubs: undefined;
  AddEvent: undefined;
  CreateClub: undefined;
};
