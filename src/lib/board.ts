// 소통 게시판 행 타입·런타임 검사 — 목록·상세·관리자 화면이 함께 쓴다.

import { isRaw, text, textOrNull } from '@/lib/rows'

/** 목록에 필요한 최소 필드. */
export type BoardListRow = {
  id: string
  nickname: string
  title: string
}

export type BoardPostRow = BoardListRow & { body: string }

/** 관리자 목록 — 본문·작성시각까지 본다. */
export type BoardAdminRow = BoardPostRow & { created_at: string }

export type BoardCommentRow = {
  id: string
  parent_id: string | null
  nickname: string
  body: string
}

export function parseBoardListRow(raw: unknown): BoardListRow | null {
  if (!isRaw(raw)) return null
  const id = text(raw, 'id')
  const nickname = text(raw, 'nickname')
  const title = text(raw, 'title')
  if (id === undefined || nickname === undefined || title === undefined) return null
  return { id, nickname, title }
}

export function parseBoardPostRow(raw: unknown): BoardPostRow | null {
  const list = parseBoardListRow(raw)
  if (list === null || !isRaw(raw)) return null
  const body = text(raw, 'body')
  if (body === undefined) return null
  return { ...list, body }
}

export function parseBoardAdminRow(raw: unknown): BoardAdminRow | null {
  const post = parseBoardPostRow(raw)
  if (post === null || !isRaw(raw)) return null
  const created_at = text(raw, 'created_at')
  if (created_at === undefined) return null
  return { ...post, created_at }
}

export function parseBoardCommentRow(raw: unknown): BoardCommentRow | null {
  if (!isRaw(raw)) return null
  const id = text(raw, 'id')
  const nickname = text(raw, 'nickname')
  const body = text(raw, 'body')
  if (id === undefined || nickname === undefined || body === undefined) return null
  // parent_id는 최상위 댓글이면 null이다.
  return { id, parent_id: textOrNull(raw, 'parent_id'), nickname, body }
}
