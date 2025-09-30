// src/navigation/types.ts
import type { NavigatorScreenParams } from "@react-navigation/native";

export type BottomTabsParamList = {
  Feed: undefined;
  Featured: undefined;
  Board: undefined;
  AddEvent: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<BottomTabsParamList>;
  // you can add more screens here, e.g. Details: { itemId: string }
};
