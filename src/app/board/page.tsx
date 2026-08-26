import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { parseBoardListRow } from '@/lib/board'
import { parseRows } from '@/lib/rows'
import BoardForm from './BoardForm'

export const metadata: Metadata = {
  title: '소통 게시판',
  description: '퍼블릭아이디에 궁금한 점과 의견을 남겨주세요.',
  alternates: { canonical: '/board' },
}

// 게시판은 항상 최신 상태로
export const dynamic = 'force-dynamic'

export default async function BoardPage() {
  const supabase = await createClient()
  const result = await supabase
    .from('board_posts')
    .select('id, nickname, title')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  const posts = parseRows('board_posts', result, parseBoardListRow)

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-ink text-2xl font-bold sm:text-3xl">소통 게시판</h1>
      <p className="text-ink-soft mt-2">누구나 자유롭게 의견을 남겨주세요.</p>

      <div className="mt-8">
        <BoardForm />
      </div>

      <ul className="divide-line border-line mt-10 divide-y border-t">
        {posts.length === 0 && (
          <li className="text-ink-soft py-8 text-center text-sm">
            아직 등록된 글이 없습니다. 첫 글을 남겨보세요.
          </li>
        )}
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/board/${post.id}`}
              className="flex items-center justify-between gap-4 py-4 transition-colors hover:bg-black/[0.02]"
            >
              <span className="text-ink min-w-0 flex-1 truncate font-medium">{post.title}</span>
              <span className="text-ink-soft shrink-0 text-xs">{post.nickname}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
