import raw from "@/content/videos.json";

// 우리 유튜브 채널 영상 목록.
// 롱폼(3~7분 설명영상, kind "long") = 볼트 `롱폼-설명영상\wb-longform\_게시현황.md` 정본 30편(시리즈 1~16, 1·2·3편).
// 쇼츠(kind "short") = 볼트 content-scorecard 성과-원장(최근 60일)에서 생성.
// publishAt(UTC ISO)이 있는 롱폼은 유튜브 예약 공개분 — 그 시각 전엔 영상관에서 자동으로 숨긴다(재배포 불필요).
export type VideoCategory = "안전·시공" | "디자인·판촉" | "소상공인·우리회사OS" | "생활·계절";
export type Video = {
  id: string;
  title: string;
  published: string;
  category: VideoCategory;
  kind: "long" | "short";
  series?: string;
  publishAt?: string;
};

export const VIDEO_CATEGORIES: VideoCategory[] = ["안전·시공", "디자인·판촉", "소상공인·우리회사OS", "생활·계절"];
export const videos = raw as Video[];

/** 유튜브에서 이미 공개된 영상인가(예약 공개분은 시각 전까지 false). */
export function isLive(v: Video, now: number = Date.now()): boolean {
  return !v.publishAt || Date.parse(v.publishAt) <= now;
}

export const longforms = videos.filter((v) => v.kind === "long");
export const shorts = videos.filter((v) => v.kind === "short");

// 홈 노출 = 지금 공개된 롱폼 최신 3편(체류 효과가 가장 큰 3~7분짜리). 정적 빌드 시각 기준.
export const homeVideos = longforms.filter((v) => isLive(v)).slice(0, 3);
