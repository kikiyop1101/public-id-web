import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedPosts } from '@/lib/blog'
import NaverBlogFeed from '@/components/NaverBlogFeed'
import BreadcrumbLd from '@/components/BreadcrumbLd'

export const metadata: Metadata = {
  title: '기업 블로그',
  description: '퍼블릭아이디의 이야기와 현장 소식.',
  alternates: { canonical: '/blog' },
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <BreadcrumbLd trail={[{ name: '기업 블로그', path: '/blog' }]} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-ink text-2xl font-bold sm:text-3xl">기업 블로그</h1>
          <p className="text-ink-soft mt-2">퍼블릭아이디의 이야기와 현장 소식을 전합니다.</p>
        </div>
        {/* 관리자 전용 — 로그인 안 된 상태면 로그인 페이지로 이동 */}
        <Link
          href="/admin"
          className="text-ink-soft hover:border-teal hover:text-teal shrink-0 rounded-full border border-line px-4 py-2 text-sm font-medium transition"
        >
          글쓰기
        </Link>
      </div>

      <ul className="mt-8 grid gap-4">
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
  )
}
