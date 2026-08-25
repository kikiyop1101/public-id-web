import { createClient } from '@/lib/supabase/server'
import { boolOr, isRaw, parseRow, parseRows, text, textOrNull } from '@/lib/rows'

export type BlogListItem = {
  slug: string
  title: string
  cover_image: string | null
  created_at: string
}

export type BlogPost = BlogListItem & { body: string }

/** 관리자 목록용 행 — 공개 목록과 달리 id·게시여부까지 본다. */
export type BlogAdminRow = {
  id: string
  title: string
  slug: string
  cover_image: string | null
  published: boolean
  created_at: string
}

export function parseBlogListItem(raw: unknown): BlogListItem | null {
  if (!isRaw(raw)) return null
  const slug = text(raw, 'slug')
  const title = text(raw, 'title')
  const created_at = text(raw, 'created_at')
  if (slug === undefined || title === undefined || created_at === undefined) return null
  return { slug, title, cover_image: textOrNull(raw, 'cover_image'), created_at }
}

export function parseBlogPost(raw: unknown): BlogPost | null {
  const item = parseBlogListItem(raw)
  if (item === null || !isRaw(raw)) return null
  const body = text(raw, 'body')
  if (body === undefined) return null
  return { ...item, body }
}

export function parseBlogAdminRow(raw: unknown): BlogAdminRow | null {
  const item = parseBlogListItem(raw)
  if (item === null || !isRaw(raw)) return null
  const id = text(raw, 'id')
  if (id === undefined) return null
  return { ...item, id, published: boolOr(raw, 'published', false) }
}

// 게시된 자체 블로그 글 목록(최신순). RLS로 published=true만 반환.
export async function getPublishedPosts(): Promise<BlogListItem[]> {
  const supabase = await createClient()
  const result = await supabase
    .from('blog_posts')
    .select('slug, title, cover_image, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
  return parseRows('blog_posts', result, parseBlogListItem)
}

// slug로 글 하나. 없거나 미게시면 null.
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  const result = await supabase
    .from('blog_posts')
    .select('slug, title, cover_image, created_at, body')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  return parseRow('blog_posts', result, parseBlogPost)
}
