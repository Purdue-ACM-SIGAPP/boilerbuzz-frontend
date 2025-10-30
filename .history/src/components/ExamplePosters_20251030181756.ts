import type { ImageSourcePropType } from "react-native";
import type { BottomTabsParamList, RootStackParamList } from "../navigation/types";

export type PosterLink =
  | { type: "tab"; name: keyof BottomTabsParamList; params?: object }
  | { type: "stack"; name: keyof RootStackParamList; params?: object };

export type PosterMeta = {
  id: string;
  title: string;
  image: ImageSourcePropType;
  likes: number;
  link: PosterLink;
};

export function likesToSize(likes: number) {
  const minH = 110, maxH = 240;
  const t = Math.min(1, Math.sqrt(likes) / Math.sqrt(600));
  const height = Math.round(minH + t * (maxH - minH));
  const width = Math.round(height * (2 / 3));
  return { width, height };
}

export const POSTERS: PosterMeta[] = [
  {
    id: "p1",
    title: "ACM Callout",
    image: require("../../assets/tempposter.png"),
    likes: 520,
    link: { type: "tab", name: "Trending" },
  },
  {
    id: "p2",
    title: "Dev Sprint",
    image: require("../../assets/tempposter.png"),
    likes: 140,
    link: { type: "stack", name: "Settings" },
  },
  {
    id: "p3",
    title: "Resume Workshop",
    image: require("../../assets/tempposter.png"),
    likes: 300,
    link: { type: "tab", name: "Home" },
  },
  {
    id: "p4",
    title: "Hackathon",
    image: require("../../assets/tempposter.png"),
    likes: 580,
    link: { type: "tab", name: "Search" },
  },
  {
    id: "p5",
    title: "Club Social",
    image: require("../../assets/tempposter.png"),
    likes: 95,
    link: { type: "tab", name: "Search" },
  },
  {
    id: "p6",
    title: "Tech Talk: Systems",
    image: require("../../assets/tempposter.png"),
    likes: 430,
    link: { type: "tab", name: "Profile" },
  },
  {
    id: "p7",
    title: "AI Reading Group",
    image: require("../../assets/tempposter.png"),
    likes: 210,
    link: { type: "tab", name: "Pinned" },
  },
  {
    id: "p8",
    title: "Game Jam",
    image: require("../../assets/tempposter.png"),
    likes: 365,
    link: { type: "tab", name: "Pinned" },
  },
  {
    id: "p9",
    title: "C++ Meetup",
    image: require("../../assets/tempposter.png"),
    likes: 175,
    link: { type: "tab", name: "Profile" },
  },
  {
    id: "p10",
    title: "Career Fair",
    image: require("../../assets/tempposter.png"),
    likes: 610,
    link: { type: "tab", name: "Trending" },
  },
];

// Fast lookup by id
export const POSTERS_BY_ID: Record<string, PosterMeta> =
  Object.fromEntries(POSTERS.map(p => [p.id, p]));
