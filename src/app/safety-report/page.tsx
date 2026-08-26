import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCardImage } from '@/lib/product-media'
import { blurCoord, parseReportRow, REPORT_CATEGORIES } from '@/lib/reports'
import { parseRows } from '@/lib/rows'
import { loadShowcaseSites } from '@/lib/showcase'
import SafetyMapSection from './SafetyMapSection'

export const metadata: Metadata = {
  title: '우리 학교 앞 안전 리포트',
  description:
    '통학로 위험 지점을 제보하면 퍼블릭아이디가 무료 진단 리포트를 만들어 지자체·학교에 전달합니다.',
  alternates: { canonical: '/safety-report' },
}

export const dynamic = 'force-dynamic'

export default async function SafetyReportPage() {
  const supabase = createAdminClient()
  const result = await supabase
    .from('reports')
    .select('id, kind, category, description, lat, lng, addr, public_label, photos, status, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(200)
  const reports = parseRows('reports', result, parseReportRow)

  // 노란 핀 = 우리 시공 사례. 시설대장 시트(정본)를 그대로 읽어 오픈 첫날부터 지도를 채운다.
  const showcaseSites = await loadShowcaseSites()

  const markers = [
    ...reports
      .filter((report) => report.lat !== null && report.lng !== null)
      .map((report) => ({
        lat: blurCoord(report.lat as number),
        lng: blurCoord(report.lng as number),
        label: `${report.public_label ?? ''} ${
          REPORT_CATEGORIES[report.category as keyof typeof REPORT_CATEGORIES] ?? ''
        }`.trim(),
        showcase: report.kind === 'showcase',
      })),
    ...showcaseSites.map((site) => ({
      lat: site.lat,
      lng: site.lng,
      label: site.label,
      showcase: true,
    })),
  ]

  // 스토리 카드: 사진 있는 승인 건(시공 사례 우선) 최대 6건, 서명 URL 1시간
  const storySource = [...reports]
    .sort((a, b) => (a.kind === 'showcase' ? -1 : 0) - (b.kind === 'showcase' ? -1 : 0))
    .filter((report) => report.photos.length > 0)
    .slice(0, 6)
  const stories = await Promise.all(
    storySource.map(async (report) => {
      const { data: signed } = await supabase.storage
        .from('reports')
        .createSignedUrl(report.photos[0], 3600)
      return { report, photoUrl: signed?.signedUrl ?? null }
    }),
  )

  const heroImage = getCardImage('친환경그래픽노면표시재-노란발자국')

  return (
    <>
      {/* 히어로 */}
      <section>
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-2">
          <div>
            <p className="font-display text-teal-600 text-sm font-semibold uppercase tracking-[0.18em]">
              Safety Report Campaign
            </p>
            <h1 className="text-ink mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[56px]">
              우리 학교 앞,
              <br />
              안전한가요?
            </h1>
            <p className="text-ink-soft mt-5 max-w-xl text-lg leading-relaxed">
              매일 아이들이 지나는 길의 위험 지점을 사진으로 제보해 주세요. 퍼블릭아이디가
              무료 진단 리포트를 만들어 지자체·학교에 전달하고, 개선되는 과정을 이곳에
              공개합니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/safety-report/new"
                className="bg-arch shadow-teal/20 inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:brightness-105"
              >
                위험 지점 제보하기
              </Link>
              <a
                href="#stories"
                className="border-line text-ink hover:border-teal hover:text-teal-600 inline-flex h-12 items-center justify-center rounded-full border bg-white px-6 text-[15px] font-semibold transition-colors"
              >
                개선 사례 보기
              </a>
            </div>
          </div>
          {heroImage && (
            <div className="border-line overflow-hidden rounded-3xl border">
              <Image
                src={heroImage}
                alt="노란발자국 — 횡단보도 앞 어린이 대기 공간"
                width={800}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* 지도 */}
      <section className="bg-cloud">
        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
          <p className="font-display text-teal-600 text-sm font-semibold uppercase tracking-[0.18em]">
            Map
          </p>
          <h2 className="text-ink mt-4 text-2xl font-bold sm:text-3xl">전국 제보·개선 지도</h2>
          <p className="text-ink-soft mt-3 max-w-2xl">
            승인된 제보와 개선·시공 사례를 지도에 모읍니다. 개인정보 보호를 위해 위치는
            대략적으로만 표시됩니다.
          </p>
          {showcaseSites.length > 0 && (
            <p className="text-ink mt-2 text-sm font-semibold">
              현재 노란 핀 {showcaseSites.length}개소 — 퍼블릭아이디가 실제로 시공한 통학로입니다.
            </p>
          )}
          <div className="border-line mt-8 overflow-hidden rounded-3xl border bg-white">
            <SafetyMapSection markers={markers} />
          </div>
          <div className="text-ink-soft mt-3 flex flex-wrap gap-5 text-sm">
            <span className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-[#0b6c7d]" /> 시민 제보
            </span>
            <span className="flex items-center gap-2">
              <span className="bg-yellow inline-block h-3 w-3 rounded-full" /> 개선·시공 사례
            </span>
          </div>
        </div>
      </section>

      {/* 진행 방식 — 순서가 곧 정보라 번호를 쓴다 */}
      <section>
        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
          <p className="font-display text-teal-600 text-sm font-semibold uppercase tracking-[0.18em]">
            How it works
          </p>
          <h2 className="text-ink mt-4 text-2xl font-bold sm:text-3xl">
            제보 한 장이 개선까지 가는 길
          </h2>
          <ol className="mt-8 max-w-2xl space-y-5">
            <li className="flex gap-4">
              <span className="bg-teal inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
                1
              </span>
              <div>
                <p className="text-ink font-bold">사진으로 제보</p>
                <p className="text-ink-soft mt-1 text-sm">
                  위험한 통학로·횡단보도·시설을 사진과 위치로 알려주세요. 검토 후 지도에
                  공개됩니다.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="bg-teal inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
                2
              </span>
              <div>
                <p className="text-ink font-bold">무료 진단 리포트</p>
                <p className="text-ink-soft mt-1 text-sm">
                  제보가 모인 지역은 퍼블릭아이디가 현장을 진단해 리포트를 만들고,
                  지자체·학교에 전달합니다.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="bg-teal inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
                3
              </span>
              <div>
                <p className="text-ink font-bold">개선, 그리고 공개</p>
                <p className="text-ink-soft mt-1 text-sm">
                  노란발자국·노란볼라드 같은 개선이 이뤄지면 전후 사진을 이곳에 공개해
                  변화를 기록합니다.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* 사례 */}
      <section id="stories" className="bg-cloud">
        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
          <p className="font-display text-teal-600 text-sm font-semibold uppercase tracking-[0.18em]">
            Stories
          </p>
          <h2 className="text-ink mt-4 text-2xl font-bold sm:text-3xl">제보와 개선 이야기</h2>
          {stories.length === 0 ? (
            <p className="text-ink-soft mt-6">
              첫 이야기를 준비하고 있습니다. 지금 제보해 주시면 이곳에 변화가 기록됩니다.
            </p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map(({ report, photoUrl }) => (
                <article
                  key={report.id}
                  className="border-line overflow-hidden rounded-2xl border bg-white shadow-sm"
                >
                  {photoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photoUrl}
                      alt={`${report.kind === 'showcase' ? '개선·시공 사례' : '시민 제보'} 현장 사진${report.public_label ? ` — ${report.public_label}` : ''}`}
                      className="h-44 w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="p-5">
                    <p className="text-teal-600 text-xs font-semibold">
                      {report.kind === 'showcase' ? '개선·시공 사례' : '시민 제보'}
                      {report.public_label ? ` · ${report.public_label}` : ''}
                    </p>
                    <p className="text-ink-soft mt-2 line-clamp-3 text-sm">{report.description}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 최종 CTA */}
      <section className="bg-navy">
        <div className="mx-auto max-w-[1200px] px-5 py-20 text-center sm:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            아이들의 길은 어른들의 관심으로 안전해집니다
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            1분이면 제보할 수 있습니다. 지자체·학교 담당자시라면 우리 지역 진단 리포트를
            요청해 주세요.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/safety-report/new"
              className="bg-arch shadow-teal/20 inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:brightness-105"
            >
              위험 지점 제보하기
            </Link>
            <Link
              href="/subscribe"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              기관 담당자 문의
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
