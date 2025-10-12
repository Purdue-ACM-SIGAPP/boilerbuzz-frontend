// src/navigation/types.ts
import type { NavigatorScreenParams } from "@react-navigation/native";

export type BottomTabsParamList = {
  Feed: undefined;
  Featured: undefined;
  Board: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<BottomTabsParamList>;
  Login: undefined;
  Register: undefined;
  Settings: undefined
  // you can add more screens here, e.g. Details: { itemId: string }
};
