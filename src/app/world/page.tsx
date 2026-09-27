import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'
import WorldClient from './WorldClient'
import Link from 'next/link'
import BreadcrumbLd from '@/components/BreadcrumbLd'

export const metadata: Metadata = pageMeta({
  title: '3D 월드 — 소재부터 관리까지 스크롤로 보기',
  description:
    '친환경 소재·인쇄 제작·스쿨존 시공·정기 관리까지, 퍼블릭아이디가 일하는 방식을 스크롤 한 번으로 둘러보는 3D 소개입니다.',
  path: '/world',
})

export default function WorldPage() {
  return (
    <>
      <BreadcrumbLd trail={[{ name: '퍼블릭아이디 월드', path: '/world' }]} />
      {/* 장면 제목은 스크롤 엔진이 h2로 그린다 — 문서 제목(h1)은 화면 밖에 둔다(검색·스크린리더용) */}
      <h1 className="sr-only">퍼블릭아이디 월드 — 소재부터 관리까지</h1>
      <WorldClient />
      {/* 서버 렌더링 소개(2026-09-27) — 3D 엔진은 JS로만 그려져 검색엔진·JS 없는 환경에서 본문이 비었다.
          화면 연출은 그대로 두고 시각적으로 숨긴다. 키보드로 링크에 닿으면 화면 아래에 드러난다. */}
      <section
        aria-labelledby="world-intro"
        className="sr-only focus-within:not-sr-only focus-within:fixed focus-within:inset-x-4 focus-within:bottom-4 focus-within:z-[70] focus-within:rounded-2xl focus-within:bg-navy focus-within:p-5 focus-within:text-white"
      >
        <h2 id="world-intro">퍼블릭아이디 월드 소개</h2>
        <p>
          퍼블릭아이디 월드는 퍼블릭아이디가 일하는 방식을 소재·제작·시공·관리·제품 다섯 장면으로 스크롤하며
          둘러보는 3D 소개 페이지입니다. 친환경 그래픽 자재에 GREENGUARD GOLD(UL 2818) 인증 친환경 라텍스 잉크로
          그래픽을 인쇄하고, 직접 재단해 시공 단위로 포장합니다. 스쿨존에서는 인도(보도)의 횡단 대기 공간에
          노란발자국을 부착해 아이가 설 자리를 만듭니다. 시공 뒤에는 안전시설관리 구독으로 시공 후 1년 동안
          책임지고 관리하며, 설치 위치와 관리 이력은 안전관리 지도에서 공개합니다. 제품 가격은 기준가로 안내하고,
          정확한 견적은 문의로 받습니다.
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          <li><Link href="/products">제품 5종</Link></li>
          <li><Link href="/products#footprint">노란발자국</Link></li>
          <li><Link href="/guide">부착 가이드</Link></li>
          <li><Link href="/safety-map">안전관리 지도</Link></li>
          <li><Link href="/subscribe">디자인 구독</Link></li>
          <li><Link href="/about">회사소개</Link></li>
          <li><Link href="/contact">문의</Link></li>
        </ul>
      </section>
    </>
  )
}
