import { PosterData } from "../components/BulletinPoster";

const API_BASE_URL = "http://localhost:3000";
const POSTERS_ENDPOINT = `${API_BASE_URL}/api/poster`;

export async function fetchPosters(): Promise<PosterData[]> {
  const res = await fetch(POSTERS_ENDPOINT, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch posters (${res.status})`);
  }

  const rows = await res.json();

  return rows.map((p: PosterData) => ({
    ...p,
    id: String(p.id),
  }));
}
