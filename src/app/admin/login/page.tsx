'use client'

import { useActionState } from 'react'
import { signIn, type AuthState } from '../actions'

const initial: AuthState = {}

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(signIn, initial)

  return (
    <div className="mx-auto max-w-sm px-5 py-24">
      <h1 className="text-ink text-xl font-bold">관리자 로그인</h1>
      <p className="text-ink-soft mt-1 text-sm">퍼블릭아이디 관리자 전용입니다.</p>

      <form action={action} className="mt-6">
        <input
          name="password"
          type="password"
          placeholder="관리자 비밀번호"
          required
          autoFocus
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
        {state.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="bg-teal hover:bg-teal-600 mt-4 w-full rounded-full px-5 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50"
        >
          {pending ? '확인 중…' : '로그인'}
        </button>
      </form>
    </div>
  )
}
