// utils/mockPosters.ts
import type { PosterData } from "../components/BulletinPoster";

// Quick deterministic likes (so sizes vary)
const likeAt = (i: number) => 10 + ((i * 37) % 1500);

export function makePicsumPosters(count: number, seedPrefix = "p"): PosterData[] {
  const out: PosterData[] = [];
  for (let i = 0; i < count; i++) {
    const id = `${seedPrefix}${i + 1}`;
    const likes = likeAt(i);
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
