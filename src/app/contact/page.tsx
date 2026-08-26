import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "문의",
  alternates: { canonical: "/contact" },
  description:
    "구독 상담부터 시공 견적까지. 전화·이메일·문의 폼으로 퍼블릭아이디에 편하게 문의하세요.",
};

const info: [string, string][] = [
  ["전화", site.tel],
  ["팩스", site.fax],
  ["이메일", site.email],
  ["주소", `(${site.zip}) ${site.address}`],
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="문의하기"
        description="구독 상담부터 시공 견적까지, 편하게 문의해 주세요. 영업일 기준 빠르게 답변드리겠습니다."
      />

      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <div className="lg:col-span-5">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              Contact Info
            </h3>
            <dl className="mt-5 space-y-1">
              {info.map(([k, v]) => (
                <div key={k} className="flex gap-4 border-b border-line py-4">
                  <dt className="w-16 shrink-0 text-sm font-medium text-ink-soft">
                    {k}
                  </dt>
                  <dd className="whitespace-pre-line text-sm leading-relaxed text-ink">
                    {k === "전화" ? (
                      <a href={`tel:${v.replace(/[^0-9+]/g, "")}`} className="transition hover:text-teal-700">
                        {v}
                      </a>
                    ) : k === "이메일" ? (
                      <a href={`mailto:${v}`} className="transition hover:text-teal-700">
                        {v}
                      </a>
                    ) : (
                      v
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <h3 className="mt-10 font-display text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              Online Store
            </h3>
            <ul className="mt-5 space-y-2.5 text-sm">
              {site.stores.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink transition hover:text-teal-700"
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
                  className="text-ink transition hover:text-teal-700"
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
