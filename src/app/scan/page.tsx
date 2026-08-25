import type { Metadata } from 'next'
import ScanClient from '@/components/ScanClient'

export const metadata: Metadata = {
  title: 'AI 진단 — 우리 회사, 뭘 AI에 맡겨야 할까',
  description:
    '소상공인·중소기업 업무 5개 영역을 15문항으로 점검해 AI에 맡기면 좋은 우선순위 TOP3와 예상 절감 시간을 알려드립니다. 무료·로그인 없음.',
  alternates: { canonical: '/scan' },
}

export default function ScanPage() {
  return <ScanClient />
}
