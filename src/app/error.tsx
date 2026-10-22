"use client"; // 오류 경계는 클라이언트 컴포넌트여야 한다(Next 16 error.js — 다시 시도 = retry)

import { useEffect } from "react";
import Link from "next/link";
import Container from "@/components/Container";

// 2026-10-22 프론트엔드 패턴(에러 경계) 적용: 화면 조각 하나가 오류를 내도 머리말·바닥글은 남기고 이 안내만 보인다(전에는 사이트 전체가 'Application error' 흰 화면)
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <Container className="text-center">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">
          화면을 불러오지 못했습니다
        </h1>
        <p className="mt-3 text-ink-soft">
          잠시 뒤 다시 시도해 주세요. 계속되면 문의하기로 알려 주시면 바로 고치겠습니다.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex h-12 items-center justify-center rounded-full bg-arch px-7 text-[15px] font-semibold text-white shadow-lg shadow-teal/20 transition hover:-translate-y-0.5 hover:brightness-105"
          >
            다시 시도
          </button>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-full border border-line px-7 text-[15px] font-semibold text-ink transition hover:border-teal hover:text-teal-700"
          >
            문의하기
          </Link>
        </div>
      </Container>
    </section>
  );
}
