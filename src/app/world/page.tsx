import type { Metadata } from 'next'
import WorldClient from './WorldClient'
import BreadcrumbLd from '@/components/BreadcrumbLd'

export const metadata: Metadata = {
  title: '퍼블릭아이디 월드 — 소재부터 관리까지, 스크롤로 날아보기',
  description:
    '친환경 자재에서 시작해 인쇄·제작, 스쿨존 시공, 정기 점검까지. 퍼블릭아이디가 일하는 방식을 하나의 연속된 비행으로 보여줍니다.',
  alternates: { canonical: '/world' },
}

export default function WorldPage() {
  return (
    <>
      <BreadcrumbLd trail={[{ name: '퍼블릭아이디 월드', path: '/world' }]} />
      <WorldClient />
    </>
  )
}
