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
    title: "Longboard Callout",
    image: require("../../assets/example_posters/long_board.png"),
    likes: 520,
    link: { type: "tab", name: "Trending" },
  },
  {
    id: "p2",
    title: "google",
    image: require("../../assets/example_posters/google.png"),
    likes: 140,
    link: { type: "stack", name: "Settings" },
  },
  {
    id: "p3",
    title: "Resume Workshop",
    image: require("../../assets/example_posters/workshop.png"),
    likes: 300,
    link: { type: "tab", name: "Home" },
  },
  {
    id: "p4",
    title: "Hackathon",
    image: require("../../assets/example_posters/hackathon.png"),
    likes: 580,
    link: { type: "tab", name: "Search" },
  },
  {
    id: "p5",
    title: "Club Social",
    image: require("../../assets/example_posters/social.png"),
    likes: 95,
    link: { type: "tab", name: "Search" },
  },
  {
    id: "p6",
    title: "Ted Talk",
    image: require("../../assets/example_posters/ted.png"),
    likes: 430,
    link: { type: "tab", name: "Profile" },
  },
  {
    id: "p7",
    title: "Reading Group",
    image: require("../../assets/example_posters/reading.png"),
    likes: 210,
    link: { type: "tab", name: "Pinned" },
  },
  {
    id: "p8",
    title: "Game Jam",
    image: require("../../assets/example_posters/game.png"),
    likes: 365,
    link: { type: "tab", name: "Pinned" },
  },
  {
    id: "p9",
    title: "Dev Meetup",
    image: require("../../assets/example_posters/dev.png"),
    likes: 175,
    link: { type: "tab", name: "Profile" },
  },
  {
    id: "p10",
    title: "Career Fair",
    image: require("../../assets/example_posters/career.png"),
    likes: 610,
    link: { type: "tab", name: "Trending" },
  },
];

// Fast lookup by id
export const POSTERS_BY_ID: Record<string, PosterMeta> =
  Object.fromEntries(POSTERS.map(p => [p.id, p]));


  function prng(seed: number) {
  let s = (seed >>> 0) || 1; // avoid 0
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

// Making random posters just to fill out the rest of the space
export function makeRandomPosters(count: number, seed = 42): PosterMeta[] {
  const rnd = prng(seed);
  const out: PosterMeta[] = [];
  const base = POSTERS.length;

  for (let i = 0; i < count; i++) {
    const likes = 10 + Math.floor(rnd() * 600);
    out.push({
      id: `g${base + i + 1}`,
      title: `Sample Poster ${base + i + 1}`,
      image: require("../../assets/tempposter.png"),
      likes,
      link: { type: "tab", name: "Trending" },
    });
  }
  return out;
}

// adding all 50 posters
export const ALL_POSTERS: PosterMeta[] = [...POSTERS, ...makeRandomPosters(50, 1337)];
