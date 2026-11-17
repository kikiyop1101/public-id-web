import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";
import BreadcrumbLd from "@/components/BreadcrumbLd";

export const metadata: Metadata = pageMeta({
  title: "문의 — 구독 상담·시공 견적",
  description:
    "구독 상담부터 시공 견적까지 전화(070-4150-1172)·이메일·문의 폼으로 퍼블릭아이디에 편하게 문의하세요.",
  path: "/contact",
});

const info: [string, string][] = [
  ["전화", site.tel],
  ["팩스", site.fax],
  ["이메일", site.email],
  ["주소", `(${site.zip}) ${site.address}`],
];

export default function ContactPage() {
  return (
    <>
      <BreadcrumbLd trail={[{ name: "문의", path: "/contact" }]} />
      <PageHero
        eyebrow="Contact"
        title="문의하기"
        description="구독 상담부터 시공 견적까지, 편하게 문의해 주세요. 영업일 기준 빠르게 답변드리겠습니다."
      />

      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            {/* 2026-11-17 헤더 버튼이 '상담·견적' 하나로 줄어 견적을 찾는 사람도 이 쪽으로 온다 — 숫자가 필요한 사람은 바로 견적 쪽으로 */}
            <Link
              href="/quote"
              className="group mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-2xl border border-line bg-white p-5 transition hover:border-teal"
            >
              <span className="break-keep text-sm leading-relaxed text-ink">
                <span className="font-semibold">시공·제품 견적이 필요하신가요?</span>
                <br />
                <span className="text-ink-soft">
                  규격·수량을 움직여 기준가 합계를 먼저 보고, 그 구성 그대로 신청하실 수 있습니다.
                </span>
              </span>
              <span className="inline-flex h-10 shrink-0 items-center rounded-full border border-line px-4 text-sm font-semibold text-teal-700 transition group-hover:border-teal">
                맞춤 견적 · 시뮬레이터 →
              </span>
            </Link>
            <ContactForm />
          </div>

          <div className="lg:col-span-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              Contact Info
            </h2>
            <dl className="mt-5 space-y-1">
              {info.map(([k, v]) => (
                <div key={k} className="flex gap-4 border-b border-line py-4">
                  <dt className="w-16 shrink-0 text-sm font-medium text-ink-soft">
                    {k}
                  </dt>
                  <dd className="whitespace-pre-line text-sm leading-relaxed text-ink">
                    {k === "전화" ? (
                      <a href={`tel:${v.replace(/[^0-9+]/g, "")}`} className="-my-3 inline-block py-3 transition hover:text-teal-700">
                        {v}
                      </a>
                    ) : k === "이메일" ? (
                      <a href={`mailto:${v}`} className="-my-3 inline-block py-3 transition hover:text-teal-700">
                        {v}
                      </a>
                    ) : (
                      v
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-10 font-display text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              Online Store
            </h2>
            <ul className="mt-3 text-sm">
              {site.stores.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-ink transition hover:text-teal-700"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={site.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-ink transition hover:text-teal-700"
                >
                  네이버 블로그
                </a>
              </li>
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
