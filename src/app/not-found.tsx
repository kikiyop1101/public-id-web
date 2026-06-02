import Link from "next/link";
import Container from "@/components/Container";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <Container className="text-center">
        <p className="font-display text-7xl font-extrabold text-arch sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-3 text-ink-soft">
          주소가 변경되었거나 삭제된 페이지일 수 있어요.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full bg-arch px-7 text-[15px] font-semibold text-white shadow-lg shadow-teal/20 transition hover:-translate-y-0.5 hover:brightness-105"
          >
            홈으로
          </Link>
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
