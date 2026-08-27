import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-navy text-white/70">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8">
        {/* 전체 페이지 지도 — GNB 5그룹 그대로 (2026-08-26: 칩 나열 → 그룹 컬럼) */}
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.png" alt={site.name} width={480} height={142} className="h-8 w-auto" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
              {site.tagline}. 전용 마스코트·월별 웹툰·디자인 시스템·홈페이지 제작
              구독과 노면표시·안전표지 정기 시설 관리를 제공하는 {site.descriptor}.
            </p>
          </div>

          <nav
            aria-label="전체 페이지"
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8 lg:grid-cols-5"
          >
            {site.footerGroups.map((g) => (
              <div key={g.label}>
                <h3 className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-teal">
                  {g.label}
                </h3>
                <ul className="mt-4 space-y-2 text-sm">
                  {g.links.map((n) => (
                    <li key={n.href}>
                      <Link href={n.href} className="transition hover:text-white">
                        {n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 grid gap-10 border-t border-white/10 pt-10 md:grid-cols-12">
          <div className="text-sm md:col-span-5">
            <h3 className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-teal">
              Contact
            </h3>
            <dl className="mt-4 space-y-2">
              <div className="flex gap-3">
                <dt className="w-12 shrink-0 text-white/65">대표</dt>
                <dd>{site.ceo}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-12 shrink-0 text-white/65">Tel</dt>
                <dd>{site.tel}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-12 shrink-0 text-white/65">Email</dt>
                <dd>{site.email}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-12 shrink-0 text-white/65">주소</dt>
                <dd className="whitespace-pre-line leading-relaxed">
                  ({site.zip}) {site.address}
                </dd>
              </div>
            </dl>
          </div>

          <div className="text-sm md:col-span-4">
            <h3 className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-teal">
              Online Store
            </h3>
            <ul className="mt-4 space-y-2">
              {site.stores.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="transition hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={site.blog}
                  className="transition hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  네이버 블로그
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 space-y-1 border-t border-white/10 pt-8 text-xs text-white/70">
          <p>
            {site.legalName} · 대표 {site.ceo} · 사업자등록번호 {site.bizRegNo} ·
            통신판매업 {site.mailOrderNo}
          </p>
          <p className="whitespace-pre-line">
            ({site.zip}) {site.address}
          </p>
          <p>
            Tel {site.tel} · Fax {site.fax} · Email {site.email}
          </p>
          <p className="pt-2 text-white/55">
            © 2026 {site.legalName}. All rights reserved. ·{" "}
            <Link href="/privacy" className="hover:text-white">
              개인정보처리방침
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
