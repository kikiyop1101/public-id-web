'use client'

import { useActionState } from 'react'
import { createBoardPost, type BoardFormState } from './actions'

const initial: BoardFormState = {}

export default function BoardForm() {
  const [state, formAction, pending] = useActionState(createBoardPost, initial)

  return (
    <form action={formAction} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
      <h2 className="text-ink text-lg font-bold">글 남기기</h2>
      <p className="text-ink-soft mt-1 text-xs">
        누구나 자유롭게 남길 수 있고 등록하면 바로 공개됩니다. 닉네임·비밀번호 외 개인정보는
        수집하지 않습니다.
      </p>

      {/* 허니팟(사람에겐 숨김) */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          name="nickname"
          aria-label="닉네임"
          autoComplete="off"
          placeholder="닉네임"
          maxLength={20}
          required
          className="rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
        <input
          name="password"
          type="password"
          aria-label="비밀번호(수정·삭제용)"
          autoComplete="off"
          placeholder="비밀번호(수정·삭제용, 4자 이상)"
          required
          className="rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </div>
      <input
        name="title"
        aria-label="제목"
        placeholder="제목"
        maxLength={100}
        required
        className="mt-3 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
      />
      <textarea
        name="body"
        aria-label="내용"
        placeholder="내용을 입력하세요"
        rows={4}
        required
        className="mt-3 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
      />

      {state.error && <p role="alert" className="mt-2 text-sm text-red-600">{state.error}</p>}
      {state.ok && <p role="status" className="text-teal mt-2 text-sm">등록됐습니다.</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-teal hover:bg-teal-600 mt-4 rounded-full px-5 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50"
      >
        {pending ? '등록 중…' : '등록'}
      </button>
    </form>
  )
}
