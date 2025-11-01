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

// This converts the amount of likes of a poster to the size.
// Usually
export function likesToSize(likes: number) {
  const minHeight = 110;
  const maxHeight = 240;
  const scalingFactor = Math.min(1, Math.sqrt(likes) / Math.sqrt(600)); // scaling factor to see how much a post is liked
  const height = Math.round(minHeight + (scalingFactor * (maxHeight - minHeight)));
  const width = Math.round(height * (2 / 3)); // width will be 2/3 of the height... poster size
  return { width, height };
}

export const POSTERS: PosterMeta[] = [
  {
    id: "p1",
    title: "Longboard Callout",
    image: require("../../assets/example_posters/long_board.png"),
    likes: 700,
    link: { type: "tab", name: "Trending" },
  },
  {
    id: "p2",
    title: "google",
    image: require("../../assets/example_posters/google.png"),
    likes: 700,
    link: { type: "stack", name: "Settings" },
  },
  {
    id: "p3",
    title: "Resume Workshop",
    image: require("../../assets/example_posters/workshop.png"),
    likes: 1200,
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
    likes: 700,
    link: { type: "tab", name: "Search" },
  },
  {
    id: "p6",
    title: "Ted Talk",
    image: require("../../assets/example_posters/ted.png"),
    likes: 700,
    link: { type: "tab", name: "Profile" },
  },
  {
    id: "p7",
    title: "Reading Group",
    image: require("../../assets/example_posters/reading.png"),
    likes: 700,
    link: { type: "tab", name: "Pinned" },
  },
  {
    id: "p8",
    title: "Game Jam",
    image: require("../../assets/example_posters/game.png"),
    likes: 1000,
    link: { type: "tab", name: "Pinned" },
  },
  {
    id: "p9",
    title: "Dev Meetup",
    image: require("../../assets/example_posters/dev.png"),
    likes: 1200,
    link: { type: "tab", name: "Profile" },
  },
  {
    id: "p10",
    title: "Career Fair",
    image: require("../../assets/example_posters/career.png"),
    likes: 1500,
    link: { type: "tab", name: "Trending" },
  },
];

  
function prng(seed: number) { // random number generator from online
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

// This one just has 50 random posters with the ones in POSTER
export const ALL_POSTERS: PosterMeta[] = [
  ...POSTERS,
  ...makeRandomPosters(50, 1337),
];



// Fast lookup by id
export const POSTERS_BY_ID: Record<string, PosterMeta> =
  Object.fromEntries(ALL_POSTERS.map(p => [p.id, p]));

