// utils/mockPosters.ts
import type { PosterData } from "./BulletinPoster";


export function makePicsumPosters(count: number, seedPrefix = "p"): PosterData[] {
  const out: PosterData[] = [];
  for (let i = 0; i < count; i++) {
    const id = `${seedPrefix}${i + 1}`;
    const likes = Math.random() * 100;
    // We don’t need to match URL size to UI size; the Image will stretch.
    const uri = `https://picsum.photos/seed/${encodeURIComponent(id)}/400/600`;
    out.push({
      id,
      title: `Poster ${i + 1}`,
      image: { uri },
      likes,
      link: { type: "tab", name: "Trending" },
    });
  }
  return out;
}
