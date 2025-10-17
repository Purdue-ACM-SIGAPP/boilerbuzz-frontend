import type { NavigatorScreenParams } from "@react-navigation/native";

export type BottomTabsParamList = {
  Home: undefined;
  Trending: undefined;
  Search: undefined;
  Pinned: undefined;
  Profile: undefined;
  Feed: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<BottomTabsParamList> | undefined;
  Login: undefined;
};
