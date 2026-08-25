'use client'

import { useActionState } from 'react'
import { deleteBoardPost, type DeleteState } from './actions'

const initial: DeleteState = {}

export default function DeleteForm({ id }: { id: string }) {
  const action = deleteBoardPost.bind(null, id)
  const [state, formAction, pending] = useActionState(action, initial)

  return (
    <details className="mt-8 border-t border-line pt-4">
      <summary className="text-ink-soft cursor-pointer text-sm">내 글 삭제</summary>
      <form action={formAction} className="mt-3 flex flex-wrap items-center gap-2">
        <input
          name="password"
          type="password"
          aria-label="작성 시 비밀번호"
          autoComplete="off"
          placeholder="작성 시 비밀번호"
          required
          className="rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
        >
          {pending ? '삭제 중…' : '삭제'}
        </button>
        {state.error && <span role="alert" className="text-sm text-red-600">{state.error}</span>}
      </form>
    </details>
  )
}
