import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { parseBoardCommentRow, parseBoardPostRow, type BoardCommentRow } from '@/lib/board'
import { parseRow, parseRows } from '@/lib/rows'
import DeleteForm from './DeleteForm'
import Comments, { type CommentNode } from './Comments'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const result = await supabase
    .from('board_posts')
    .select('id, nickname, title, body')
    .eq('id', id)
    .eq('status', 'approved')
    .single()
  const post = parseRow('board_posts', result, parseBoardPostRow)
  if (!post) return {}
  return {
    title: `${post.title} — 소통 게시판`,
    description: post.body.replace(/\s+/g, ' ').trim().slice(0, 150),
    alternates: { canonical: `/board/${post.id}` },
  }
}

// 평면 rows → 중첩 트리 (대댓글의 대댓글까지 무제한 깊이)
function buildTree(rows: BoardCommentRow[]): CommentNode[] {
  const map = new Map<string, CommentNode>()
  const roots: CommentNode[] = []
  for (const row of rows) {
    map.set(row.id, { id: row.id, nickname: row.nickname, body: row.body, children: [] })
  }
  for (const row of rows) {
    const node = map.get(row.id)!
    const parent = row.parent_id ? map.get(row.parent_id) : undefined
    if (parent) parent.children.push(node)
    else roots.push(node)
  }
  return roots
}

export default async function BoardPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // 글·댓글은 서로 독립(둘 다 id에만 의존)이라 병렬로 조회 — 워터폴 제거
  const [postResult, commentResult] = await Promise.all([
    supabase
      .from('board_posts')
      .select('id, nickname, title, body')
      .eq('id', id)
      .eq('status', 'approved')
      .single(),
    supabase
      .from('board_comments')
      .select('id, parent_id, nickname, body')
      .eq('post_id', id)
      .order('created_at', { ascending: true }),
  ])

  const post = parseRow('board_posts', postResult, parseBoardPostRow)
  if (!post) notFound()

  const comments = buildTree(parseRows('board_comments', commentResult, parseBoardCommentRow))

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <Link href="/board" className="text-teal text-sm hover:underline">
        ← 게시판으로
      </Link>

      <h1 className="text-ink mt-4 text-2xl font-bold">{post.title}</h1>
      <p className="text-ink-soft mt-2 text-sm">{post.nickname}</p>

      <div className="text-ink mt-6 whitespace-pre-wrap leading-relaxed">{post.body}</div>

      <Comments postId={post.id} comments={comments} />

      <DeleteForm id={post.id} />
    </article>
  )
}
