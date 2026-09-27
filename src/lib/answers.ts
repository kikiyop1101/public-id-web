// 질문 답변 페이지(/answers) 데이터 — 정본은 src/content/answers.json (2026-09-27 작업8).
// AI 답변 인용용: 질문형 제목 → 2~3문장 직답 → 확인 기준표 → 자사 사실 → FAQ → 다음 행동.
// 사실은 assistant-knowledge.ts·llms.txt·기존 페이지에 이미 적힌 것만 쓴다. 화면엔 날짜를 내지 않는다(dateModified는 JSON-LD·sitemap 전용).
import data from "@/content/answers.json";
import type { FaqItem } from "@/components/FaqBlock";

export type AnswerItem = {
  slug: string;
  /** 사람이 실제로 묻는 질문 그대로 — h1·title */
  question: string;
  description: string;
  /** 기계 메타 전용 ISO 날짜 */
  dateModified: string;
  /** 첫 문단 직답(2~3문장) */
  answer: string;
  table: { title: string; columns: string[]; rows: string[][] };
  ours: { title: string; ordered: boolean; items: { title: string; text: string }[] };
  faq: FaqItem[];
  /** 첫 항목이 주 행동 버튼 */
  actions: { label: string; href: string }[];
};

export const answers: AnswerItem[] = data as AnswerItem[];

export function getAnswer(slug: string): AnswerItem | undefined {
  return answers.find((a) => a.slug === slug);
}
