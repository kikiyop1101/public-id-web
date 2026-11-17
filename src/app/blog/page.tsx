import { Suspense } from 'react'
import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'
import Link from 'next/link'
import { getPublishedPosts } from '@/lib/blog'
import NaverBlogFeed from '@/components/NaverBlogFeed'
import PageHero from '@/components/PageHero'
import BreadcrumbLd from '@/components/BreadcrumbLd'

export const metadata: Metadata = pageMeta({
  title: '기업 블로그 — 현장 소식과 이야기',
  description:
    '퍼블릭아이디 기업 블로그입니다. 친환경 그래픽 노면표시재·노란발자국 시공 현장, 디자인 구독과 우리회사OS 이야기를 전합니다.',
  path: '/blog',
})

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  return (
    <>
      <BreadcrumbLd trail={[{ name: '기업 블로그', path: '/blog' }]} />
      {/* 2026-11-17 다른 쪽과 같은 머리로. 공개 화면에 있던 '글쓰기'(관리자 화면 진입) 버튼은 뺐다 — 글은 /admin 에서 쓴다 */}
      <PageHero
        eyebrow="Blog"
        title="기업 블로그"
        description="퍼블릭아이디의 이야기와 현장 소식을 전합니다."
      />
      <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
      <ul className="grid gap-4">
        {posts.length === 0 && (
          <li className="text-ink-soft py-8 text-center text-sm">
            아직 등록된 글이 없습니다.
          </li>
        )}
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block rounded-2xl border border-line bg-white p-6 transition-shadow hover:shadow-md"
            >
              <h2 className="text-ink font-bold group-hover:underline">{post.title}</h2>
            </Link>
          </li>
        ))}
      </ul>

      <Suspense fallback={null}>
        <NaverBlogFeed />
      </Suspense>
      </div>
    </>
  )
}
