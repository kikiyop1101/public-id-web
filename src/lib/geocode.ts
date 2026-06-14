/* eslint-disable @typescript-eslint/no-explicit-any */
import { loadKakaoMaps } from "./kakao";

// Client-side address → coordinate conversion via Kakao's geocoder (services
// library). Results are cached in localStorage so repeat visits and unchanged
// rows never re-geocode. Owner enters addresses only; coords are derived here.
const CACHE_KEY = "pid_geo_v2";
type Coord = { lat: number; lng: number };

function readCache(): Record<string, Coord> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeCache(c: Record<string, Coord>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(c));
  } catch {
    /* quota / private mode — ignore */
  }
}

export async function geocodeAddresses(
  addresses: string[],
): Promise<Record<string, Coord>> {
  const kakao = await loadKakaoMaps();
  const cache = readCache();
  const geocoder = new kakao.maps.services.Geocoder();
  const unique = [...new Set(addresses.map((a) => a.trim()).filter(Boolean))];
  const todo = unique.filter((a) => !(a in cache));

  await Promise.all(
    todo.map(
      (addr) =>
        new Promise<void>((resolve) => {
          geocoder.addressSearch(addr, (result: any[], status: any) => {
            if (status === kakao.maps.services.Status.OK && result[0]) {
              cache[addr] = {
                lat: parseFloat(result[0].y),
                lng: parseFloat(result[0].x),
              };
            }
            resolve();
          });
        }),
    ),
  );

  if (todo.length) writeCache(cache);
  return cache;
}
