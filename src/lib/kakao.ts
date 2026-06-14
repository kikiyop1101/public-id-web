/* eslint-disable @typescript-eslint/no-explicit-any */
// Kakao Maps JavaScript key — a PUBLIC browser key. It is meant to be exposed in
// client code; abuse is prevented by the registered Web-platform domain allowlist
// in Kakao Developers (앱 → 플랫폼 → Web). Not a secret. Rotate at developers.kakao.com.
export const KAKAO_MAP_KEY = "be4adacb06cb9da9246b4b83b6a0df7f";

let loader: Promise<any> | null = null;

// Loads the Kakao Maps SDK once (clusterer + services libraries) and resolves the
// `kakao` namespace when maps are ready. Safe to call from multiple components.
export function loadKakaoMaps(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if (loader) return loader;
  loader = new Promise((resolve, reject) => {
    const w = window as any;
    const ready = () => w.kakao.maps.load(() => resolve(w.kakao));
    if (w.kakao && w.kakao.maps) return ready();
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false&libraries=clusterer,services`;
    script.async = true;
    script.onload = ready;
    script.onerror = () => reject(new Error("Kakao SDK load failed"));
    document.head.appendChild(script);
  });
  return loader;
}
