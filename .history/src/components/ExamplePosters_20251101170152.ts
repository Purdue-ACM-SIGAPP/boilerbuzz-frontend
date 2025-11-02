// components/ExamplePosters.ts
import type { PosterMeta, PosterLink } from "./BulletinPoster";

// Array of posters that I made using images I found online.
// We could honestly just create different arrays of categories of posters if a filter is implmented
export const EXAMPLE_POSTERS: PosterMeta[] = [
  { id: "1", title: "Longboard Callout",  image: require("../../assets/example_posters/long_board.png"), likes: 700,  link: { type: "tab", name: "Trending" } as PosterLink },
  { id: "2", title: "google",             image: require("../../assets/example_posters/google.png"),     likes: 700,  link: { type: "stack", name: "Settings" } as PosterLink },
  { id: "3", title: "Resume Workshop",    image: require("../../assets/example_posters/workshop.png"),   likes: 1200, link: { type: "tab", name: "Home" } as PosterLink },
  { id: "4", title: "Hackathon",          image: require("../../assets/example_posters/hackathon.png"),  likes: 800,  link: { type: "tab", name: "Search" } as PosterLink },
  { id: "5", title: "Club Social",        image: require("../../assets/example_posters/social.png"),     likes: 700,  link: { type: "tab", name: "Search" } as PosterLink },
  { id: "6", title: "Ted Talk",           image: require("../../assets/example_posters/ted.png"),        likes: 700,  link: { type: "tab", name: "Profile" } as PosterLink },
  { id: "7", title: "Reading Group",      image: require("../../assets/example_posters/reading.png"),    likes: 700,  link: { type: "tab", name: "Pinned" } as PosterLink },
  { id: "8", title: "Game Jam",           image: require("../../assets/example_posters/game.png"),       likes: 1000, link: { type: "tab", name: "Pinned" } as PosterLink },
  { id: "9", title: "Dev Meetup",         image: require("../../assets/example_posters/dev.png"),        likes: 1200, link: { type: "tab", name: "Profile" } as PosterLink },
  { id: "10",title: "Career Fair",        image: require("../../assets/example_posters/career.png"),     likes: 1500, link: { type: "tab", name: "Trending" } as PosterLink },
];
