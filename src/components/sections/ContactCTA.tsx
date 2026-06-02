import Container from "@/components/Container";
import Button from "@/components/Button";
import { site } from "@/lib/site";

export default function ContactCTA() {
  return (
    <section className="relative overflow-hidden bg-arch">
      <Container className="flex flex-col items-center gap-6 py-16 text-center sm:py-20">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          지금, 우리 브랜드의 첫 구독을 시작하세요
        </h2>
        <p className="max-w-2xl text-white/90">
          상담은 무료입니다. 문의 폼을 남겨주시면 영업일 기준 빠르게
          답변드립니다.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button href="/contact" variant="light">
            문의하기
          </Button>
          <a
            href={`tel:${site.tel}`}
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/70 px-6 text-[15px] font-semibold text-white transition hover:bg-white/10"
          >
            전화 {site.tel}
          </a>
        </div>
      </Container>
    </section>
  );
}
