// components/ExamplePosters.ts
import type { PosterMeta, PosterLink } from "./BulletinPoster";

// Array of posters that I made using images I found online.
// We could honestly just create different arrays of categories of posters if a filter is needed
export const EXAMPLE_POSTERS: PosterMeta[] = [
  { id: "p1", title: "Longboard Callout", image: require("../../assets/example_posters/long_board.png"), likes: 700,  link: { type: "tab", name: "Trending" } as PosterLink },
  { id: "p2", title: "google",             image: require("../../assets/example_posters/google.png"),     likes: 700,  link: { type: "stack", name: "Settings" } as PosterLink },
  { id: "p3", title: "Resume Workshop",    image: require("../../assets/example_posters/workshop.png"),   likes: 1200, link: { type: "tab", name: "Home" } as PosterLink },
  { id: "p4", title: "Hackathon",          image: require("../../assets/example_posters/hackathon.png"),  likes: 580,  link: { type: "tab", name: "Search" } as PosterLink },
  { id: "p5", title: "Club Social",        image: require("../../assets/example_posters/social.png"),     likes: 700,  link: { type: "tab", name: "Search" } as PosterLink },
  { id: "p6", title: "Ted Talk",           image: require("../../assets/example_posters/ted.png"),        likes: 700,  link: { type: "tab", name: "Profile" } as PosterLink },
  { id: "p7", title: "Reading Group",      image: require("../../assets/example_posters/reading.png"),    likes: 700,  link: { type: "tab", name: "Pinned" } as PosterLink },
  { id: "p8", title: "Game Jam",           image: require("../../assets/example_posters/game.png"),       likes: 1000, link: { type: "tab", name: "Pinned" } as PosterLink },
  { id: "p9", title: "Dev Meetup",         image: require("../../assets/example_posters/dev.png"),        likes: 1200, link: { type: "tab", name: "Profile" } as PosterLink },
  { id: "p10",title: "Career Fair",        image: require("../../assets/example_posters/career.png"),     likes: 1500, link: { type: "tab", name: "Trending" } as PosterLink },
];
