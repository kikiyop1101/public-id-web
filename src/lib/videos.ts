import raw from "@/content/videos.json";

// 우리 유튜브 채널 영상 목록 — 원천은 볼트 content-scorecard 성과-원장(매일 05:05 갱신).
// 홈 노출 후보는 제품·서비스와 닿는 두 카테고리만(생활·계절 잡담 영상은 영상관 탭에서만 보인다).
export type VideoCategory = "안전·시공" | "디자인·판촉" | "소상공인·우리회사OS" | "생활·계절";
export type Video = { id: string; title: string; published: string; category: VideoCategory };

export const VIDEO_CATEGORIES: VideoCategory[] = ["안전·시공", "디자인·판촉", "소상공인·우리회사OS", "생활·계절"];
export const videos = raw as Video[];
export const HOME_CATEGORIES: VideoCategory[] = ["안전·시공", "디자인·판촉"];
export const homeVideos = videos.filter((v) => HOME_CATEGORIES.includes(v.category));
