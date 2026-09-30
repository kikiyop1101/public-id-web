import raw from "@/content/videos.json";

// 우리 유튜브 채널 영상 목록.
// 롱폼(2~7분 설명영상, kind "long") = 볼트 `롱폼-설명영상\wb-longform\_게시현황.md`(시리즈 1·2·3편)
//   + `롱폼-설명영상\dot-longform\_upload-ledger.json`(도트 게임판 4편, 2026-09-30 추가). 편수는 문구에 박지 않고 아래 상수로 센다.
// 쇼츠(kind "short") = 볼트 `관리본부\tools\slot-runner\발행-원장.md`·`sejong-daily\발행-원장.md`의 공개(public) 쇼츠 최근 60일분
//   (2026-09-30 갱신 — 유튜브 oEmbed 200, 곧 공개이면서 퍼가기 허용인 영상만. 퍼가기가 꺼진 영상은 이 페이지 재생기에서 재생되지 않는다).
// 배열 순서가 곧 노출 순서다: 롱폼 앞 3편 = 홈 스트립. 도트 게임판은 넷째 자리부터 둔다(홈이 도트판으로만 채워지지 않게).
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

// 홈 노출 = 지금 공개된 롱폼 앞 3편(체류 효과가 가장 큰 3~7분짜리). 정적 빌드 시각 기준.
export const homeVideos = longforms.filter((v) => isLive(v)).slice(0, 3);

/** 문구용 편수 — 빌드 시각에 공개된 영상 수를 10 단위로 내려 "30여 편" 식으로 쓴다(예약 공개분이 풀려도 문구가 틀리지 않게). */
function roughCount(n: number): string {
  return n < 10 ? `${n}편` : `${Math.floor(n / 10) * 10}여 편`;
}
export const LONG_COUNT_LABEL = roughCount(longforms.filter((v) => isLive(v)).length);
export const SHORT_COUNT_LABEL = roughCount(shorts.filter((v) => isLive(v)).length);
