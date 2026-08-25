'use client'

import { useActionState } from 'react'
import { createBlogPost, type BlogState } from './actions'

const initial: BlogState = {}

export default function BlogForm() {
  const [state, action, pending] = useActionState(createBlogPost, initial)

  return (
    <form action={action} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
      <h2 className="text-ink text-lg font-bold">블로그 글 작성</h2>

      <input
        name="title"
        placeholder="제목"
        required
        className="mt-4 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
      />
      <input
        name="cover_image"
        placeholder="대표 이미지 URL(선택) — postimg는 '직접 링크'(i.postimg.cc/…png)를 붙여넣으세요"
        className="mt-3 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
      />
      <textarea
        name="body"
        placeholder="내용"
        rows={6}
        required
        className="mt-3 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
      />
      <label className="text-ink-soft mt-3 flex items-center gap-2 text-sm">
        <input name="published" type="checkbox" defaultChecked />
        바로 공개
      </label>

      {state.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
      {state.ok && <p className="text-teal mt-2 text-sm">저장됐습니다.</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-teal hover:bg-teal-600 mt-4 rounded-full px-5 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50"
      >
        {pending ? '저장 중…' : '저장'}
      </button>
    </form>
  )
}
