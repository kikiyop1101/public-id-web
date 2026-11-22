'use client'

import { useActionState } from 'react'
import { unlockLinks, type UnlockState } from './actions'

const initial: UnlockState = {}

export default function UnlockForm() {
  const [state, action, pending] = useActionState(unlockLinks, initial)
  return (
    <form action={action} className="mx-auto max-w-md">
      <label htmlFor="links-key" className="mb-2 block text-sm text-ink-soft">
        관리자 키를 입력하세요.
      </label>
      <div className="flex gap-2">
        <input
          id="links-key"
          name="key"
          type="password"
          placeholder="관리자 키"
          autoComplete="current-password"
          required
          className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-teal"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-navy px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal disabled:opacity-50"
        >
          {pending ? '확인 중…' : '확인'}
        </button>
      </div>
      {state.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
    </form>
  )
}
