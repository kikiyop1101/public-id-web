import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import BreadcrumbLd from '@/components/BreadcrumbLd'
import SafetyScoreClient from './SafetyScoreClient'

export const metadata: Metadata = {
  title: '우리 동네 안전 점수',
  description:
    '통학로 8개 항목(대기 지점·볼라드·노면표시·안내표지·주정차·야간 시인성·보도 장애물·정기 관리)을 2분 만에 진단하고 100점 만점 점수와 항목별 처방을 받아 보세요.',
  alternates: { canonical: '/safety-score' },
  openGraph: {
    title: '우리 동네 안전 점수 | 퍼블릭아이디',
    description: '통학로 8개 항목을 2분 만에 진단 — 점수·등급·항목별 처방까지.',
  },
}

export default function SafetyScorePage() {
  return (
    <>
      <BreadcrumbLd trail={[{ name: '우리 동네 안전 점수', path: '/safety-score' }]} />
      <PageHero
        eyebrow="Safety Score"
        title={
          <>
            우리 동네 안전 점수,
            <br />
            2분이면 나옵니다
          </>
        }
        description="학교 앞·아파트 단지·생활 도로의 통학로를 8개 항목으로 살펴 100점 만점 점수와 등급, 낮은 항목의 처방을 드립니다. 가입도 개인정보도 필요 없습니다."
      />
      <section className="bg-white">
        <Container className="py-14 sm:py-20">
          <SafetyScoreClient />
        </Container>
      </section>
    </>
  )
}
