import type { Metadata } from 'next'
import Link from 'next/link'
import ReportForm from '@/components/ReportForm'

export const metadata: Metadata = {
  title: '위험 지점 제보 — 우리 학교 앞 안전 리포트',
  description: '통학로 위험 지점을 사진과 위치로 제보해 주세요.',
  alternates: { canonical: '/safety-report/new' },
}

export default function NewReportPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <p className="font-display text-teal-600 text-sm font-semibold uppercase tracking-[0.18em]">
        Safety Report
      </p>
      <h1 className="text-ink mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
        위험 지점 제보하기
      </h1>
      <p className="text-ink-soft mt-5 text-lg leading-relaxed">
        사진 한 장이면 충분합니다. 검토 후 지도에 공개되고, 제보가 모인 지역은 무료 진단
        리포트로 이어집니다.
      </p>

      <div className="mt-10">
        <ReportForm />
      </div>

      <p className="text-ink-soft mt-6 text-sm">
        캠페인이 궁금하시면{' '}
        <Link href="/safety-report" className="text-teal-600 font-medium hover:underline">
          우리 학교 앞 안전 리포트
        </Link>
        를 살펴보세요.
      </p>
    </div>
  )
}
