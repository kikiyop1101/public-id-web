import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAuthed } from '@/lib/auth'
import { LEAD_KINDS, parseLeadRow, type LeadKind } from '@/lib/leads'
import { parseBlogAdminRow } from '@/lib/blog'
import { parseBoardAdminRow } from '@/lib/board'
import { parseReportAdminRow, REPORT_CATEGORIES } from '@/lib/reports'
import { parseRows } from '@/lib/rows'
import {
  approveReport,
  deleteBlogPost,
  deleteLead,
  deletePostAdmin,
  deleteReport,
  rejectReport,
  signOut,
  updateLeadStatus,
} from './actions'
import BlogForm from './BlogForm'
import ShowcaseForm from './ShowcaseForm'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  // 리드에는 개인정보(이메일·전화)가 있으므로 페이지 조회 자체를 로그인 뒤로 막는다.
  if (!(await isAuthed())) redirect('/admin/login')

  const admin = createAdminClient()

  const leadResult = await admin
    .from('leads')
    .select('id, kind, name, org, email, phone, product, message, status, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  const leads = parseRows('leads', leadResult, parseLeadRow)

  const reportResult = await admin
    .from('reports')
    .select(
      'id, kind, category, description, addr, public_label, photos, reporter_name, reporter_contact, status, created_at',
    )
    .order('created_at', { ascending: false })
    .limit(50)
  const reports = parseRows('reports', reportResult, parseReportAdminRow)
  const reportPhotoUrls = new Map<string, string>()
  for (const report of reports) {
    if (report.photos[0]) {
      const { data: signed } = await admin.storage
        .from('reports')
        .createSignedUrl(report.photos[0], 3600)
      if (signed?.signedUrl) reportPhotoUrls.set(report.id, signed.signedUrl)
    }
  }
  const postResult = await admin
    .from('board_posts')
    .select('id, nickname, title, body, created_at')
    .order('created_at', { ascending: false })
    .limit(30)

  const posts = parseRows('board_posts', postResult, parseBoardAdminRow)

  const blogResult = await admin
    .from('blog_posts')
    .select('id, title, slug, cover_image, published, created_at')
    .order('created_at', { ascending: false })
    .limit(30)

  const blogPosts = parseRows('blog_posts', blogResult, parseBlogAdminRow)

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-ink text-2xl font-bold">관리자</h1>
        <form action={signOut}>
          <button className="text-ink-soft text-sm hover:underline">로그아웃</button>
        </form>
      </div>

      {/* 리드(구독·견적 신청) 관리 */}
      <section className="mt-8">
        <h2 className="text-ink text-lg font-bold">
          구독·견적 신청 <span className="text-teal">({leads.length})</span>
        </h2>
        <ul className="mt-4 space-y-4">
          {leads.length === 0 && (
            <li className="text-ink-soft py-6 text-center text-sm">신청 내역이 없습니다.</li>
          )}
          {leads.map((lead) => (
            <li key={lead.id} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-ink font-medium">
                  <span className="text-teal-600 mr-2 text-sm font-semibold">
                    [{LEAD_KINDS[lead.kind as LeadKind] ?? lead.kind}]
                  </span>
                  {lead.name}
                  {lead.org ? ` · ${lead.org}` : ''}
                </span>
                <span className="text-ink-soft shrink-0 text-xs">
                  {new Date(lead.created_at).toLocaleDateString('ko-KR')} ·{' '}
                  {lead.status === 'new'
                    ? '신규'
                    : lead.status === 'contacted'
                      ? '연락 완료'
                      : '종료'}
                </span>
              </div>
              <p className="text-ink-soft mt-2 text-sm">
                {lead.email}
                {lead.phone ? ` · ${lead.phone}` : ''}
                {lead.product ? ` · ${lead.product}` : ''}
              </p>
              {lead.message && (
                <p className="text-ink-soft mt-2 whitespace-pre-wrap text-sm">{lead.message}</p>
              )}
              <div className="mt-3 flex gap-2">
                {lead.status === 'new' && (
                  <form action={updateLeadStatus.bind(null, lead.id, 'contacted')}>
                    <button className="border-teal text-teal-600 hover:bg-teal/5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors">
                      연락 완료로 표시
                    </button>
                  </form>
                )}
                <form action={deleteLead.bind(null, lead.id)}>
                  <button className="rounded-full border border-red-300 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
                    삭제
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 시공 사례 등록 — 지도 시딩(노란 핀). 승인 절차 없이 바로 공개된다. */}
      <section className="mt-12">
        <h2 className="text-ink text-lg font-bold">시공 사례 등록</h2>
        <p className="text-ink-soft mt-1 text-sm">
          지도의 기본 노란 핀은 안전관리 시설대장(구글 시트)에서 자동으로 올라옵니다. 여기서는
          시트에 없는 <strong>사진이 있는 사례</strong>(개선 전후 스토리)를 추가로 등록합니다.
          등록 즉시 캠페인 지도와 사례 카드에 공개됩니다.
        </p>
        <ShowcaseForm />
      </section>

      {/* 안전 리포트 제보 관리 — 승인해야 지도에 공개된다 */}
      <section className="mt-12">
        <h2 className="text-ink text-lg font-bold">
          안전 리포트 제보 <span className="text-teal">({reports.length})</span>
        </h2>
        <ul className="mt-4 space-y-4">
          {reports.length === 0 && (
            <li className="text-ink-soft py-6 text-center text-sm">제보가 없습니다.</li>
          )}
          {reports.map((report) => (
            <li key={report.id} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="flex gap-4">
                {reportPhotoUrls.has(report.id) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={reportPhotoUrls.get(report.id)}
                    alt="제보 사진 썸네일"
                    className="border-line h-20 w-28 shrink-0 rounded-lg border object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-ink font-medium">
                      <span className="text-teal-600 mr-2 text-sm font-semibold">
                        [{REPORT_CATEGORIES[report.category as keyof typeof REPORT_CATEGORIES] ??
                          report.category}]
                      </span>
                      {report.kind === 'showcase' ? '시공 사례' : report.reporter_name || '익명 제보'}
                    </span>
                    <span className="text-ink-soft shrink-0 text-xs">
                      {new Date(report.created_at).toLocaleDateString('ko-KR')} ·{' '}
                      {report.status === 'pending'
                        ? '대기'
                        : report.status === 'approved'
                          ? '공개 중'
                          : '반려'}
                    </span>
                  </div>
                  {(report.addr || report.reporter_contact) && (
                    <p className="text-ink-soft mt-1 text-xs">
                      {report.addr ?? ''}
                      {report.reporter_contact ? ` · ${report.reporter_contact}` : ''}
                    </p>
                  )}
                  <p className="text-ink-soft mt-2 whitespace-pre-wrap text-sm">
                    {report.description}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {report.status !== 'approved' && (
                  <form action={approveReport.bind(null, report.id)} className="flex items-center gap-2">
                    <input
                      name="public_label"
                      defaultValue={report.public_label ?? ''}
                      placeholder="공개 표시명 (예: 세종시 보람동)"
                      maxLength={60}
                      className="rounded-xl border border-line px-3 py-1.5 text-sm"
                    />
                    <button className="border-teal text-teal-600 hover:bg-teal/5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors">
                      승인·공개
                    </button>
                  </form>
                )}
                {report.status !== 'rejected' && (
                  <form action={rejectReport.bind(null, report.id)}>
                    <button className="border-line text-ink-soft rounded-full border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-black/5">
                      {report.status === 'approved' ? '공개 내리기' : '반려'}
                    </button>
                  </form>
                )}
                <form action={deleteReport.bind(null, report.id)}>
                  <button className="rounded-full border border-red-300 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
                    삭제
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 게시글 관리 (즉시 공개 체제 — 문제 글은 여기서 삭제) */}
      <section className="mt-12">
        <h2 className="text-ink text-lg font-bold">
          최근 게시글 <span className="text-teal">({posts.length})</span>
        </h2>
        <ul className="mt-4 space-y-4">
          {posts.length === 0 && (
            <li className="text-ink-soft py-6 text-center text-sm">게시글이 없습니다.</li>
          )}
          {posts.map((post) => (
            <li key={post.id} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-ink font-medium">{post.title}</span>
                <span className="text-ink-soft shrink-0 text-xs">
                  {post.nickname} · {new Date(post.created_at).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <p className="text-ink-soft mt-2 whitespace-pre-wrap text-sm">{post.body}</p>
              <div className="mt-3">
                <form action={deletePostAdmin.bind(null, post.id)}>
                  <button className="rounded-full border border-red-300 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
                    삭제
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 블로그 글 관리 — 잘못 올린 글 삭제, 대표이미지 확인 */}
      <section className="mt-12">
        <h2 className="text-ink text-lg font-bold">
          블로그 글 <span className="text-teal">({blogPosts.length})</span>
        </h2>
        <ul className="mt-4 space-y-4">
          {blogPosts.length === 0 && (
            <li className="text-ink-soft py-6 text-center text-sm">블로그 글이 없습니다.</li>
          )}
          {blogPosts.map((post) => (
            <li key={post.id} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                {post.cover_image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.cover_image}
                    alt={`${post.title} 대표 이미지`}
                    className="h-14 w-24 shrink-0 rounded-lg border border-line object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <Link href={`/blog/${post.slug}`} className="text-ink font-medium hover:underline">
                    {post.title}
                  </Link>
                  <p className="text-ink-soft mt-1 text-xs">
                    {new Date(post.created_at).toLocaleDateString('ko-KR')} ·{' '}
                    {post.published ? '공개' : '비공개'}
                    {post.cover_image ? '' : ' · 대표이미지 없음'}
                  </p>
                </div>
                <form action={deleteBlogPost.bind(null, post.id)} className="shrink-0">
                  <button className="rounded-full border border-red-300 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
                    삭제
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 블로그 작성 */}
      <section className="mt-12">
        <BlogForm />
      </section>
    </div>
  )
}
