'use client'

import { startTransition, useActionState, useEffect, useRef } from 'react'
import { track } from '@vercel/analytics'
import { createLead, type LeadFormState } from '@/app/quote/actions'
import { site } from '@/lib/site'
import { readUtm } from '@/lib/utm'

const initial: LeadFormState = {}

// 서버 액션 호출 자체가 실패(오프라인·배포 교체 중)하면 던진다 — 오류 화면 대신 폼 안에서 안내한다.
async function submitLead(prev: LeadFormState, data: FormData): Promise<LeadFormState> {
  try {
    return await createLead(prev, data)
  } catch {
    return {
      error: `신청을 보내지 못했습니다. 인터넷 연결을 확인하고 다시 신청해 주세요. 계속 안 되면 ${site.email} 으로 보내 주세요.`,
    }
  }
}

// 이메일 알림 — Web3Forms 무료 플랜은 브라우저 호출만 허용하므로(본사이트 문의폼과 동일 방식)
// 접수 성공 후 클라이언트에서 발사한다. 공개용 클라이언트 키(노출 안전)를 빌드타임 env로 주입.
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY

function sendEmailNotice(data: FormData, kinds: { value: string; label: string }[]) {
  if (!WEB3FORMS_KEY) return
  const get = (key: string) => String(data.get(key) ?? '').trim()
  if (!get('email')) return // 값이 못 잡힌 제출엔 빈 메일을 보내지 않는다
  if (get('company')) return // 허니팟 — 서버가 성공한 척한 봇 제출엔 메일도 보내지 않는다

  const kindLabel = kinds.find((kind) => kind.value === get('kind'))?.label ?? get('kind')
  const org = get('org')
  const product = get('product')
  const message = get('message')

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: `[스토어 ${kindLabel} 신청] ${get('name')}${org ? ` · ${org}` : ''}`,
      from_name: '퍼블릭아이디 스토어',
      name: get('name'),
      email: get('email'),
      phone: get('phone'),
      message: [
        `신청 종류: ${kindLabel}`,
        org ? `기관·회사: ${org}` : '',
        product ? `관심 제품: ${product}` : '',
        message ? `요청 내용:\n${message}` : '',
        '',
        '확인·관리: https://www.public-id.co.kr/admin',
      ]
        .filter(Boolean)
        .join('\n'),
    }),
  }).catch(() => {}) // 실패해도 접수는 이미 완료 — 텔레그램·/admin 경로가 있다
}

type Props = {
  /** 노출할 신청 종류. 1개면 라디오 없이 hidden으로 고정한다. */
  kinds: { value: string; label: string }[]
  /** 견적용 제품 선택지(없으면 선택 필드 미노출) */
  products?: string[]
  /** 요청 내용 textarea 안내문 */
  messagePlaceholder?: string
  /** 요청 내용 기본값 — 견적 시뮬레이터(/estimate)가 구성 요약을 ?items= 로 넘길 때 채운다 */
  defaultMessage?: string
  submitLabel?: string
}

// 모바일 16px(iOS 입력 확대 방지) · sm부터 14px — 디자인 정본 C-5
const inputCls =
  'w-full rounded-xl border border-line bg-white px-3 py-2.5 text-base text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20 sm:text-sm'
const labelCls = 'mb-1.5 block text-sm font-medium text-ink'
const optional = <span className="text-ink-soft font-normal">(선택)</span>

export default function LeadForm({
  kinds,
  products,
  messagePlaceholder = '요청 내용을 입력해 주세요.',
  defaultMessage,
  submitLabel = '신청하기',
}: Props) {
  const [state, formAction, pending] = useActionState(submitLead, initial)
  // 제출 "순간"의 폼 값 — 서버 액션 성공 후에는 React가 폼을 비워버리므로 여기서 잡아둔다.
  const lastSubmit = useRef<FormData | null>(null)
  const notifiedState = useRef<LeadFormState | null>(null)
  const utmInput = useRef<HTMLInputElement | null>(null)

  // 신청 종류가 견적이면 요청 내용이 필수(서버 validateLead와 같은 규칙) — 왕복 전에 브라우저가 알려준다.
  const messageRequired = kinds.length === 1 && kinds[0].value === 'quote'

  // 접수 성공(state 갱신) 1회당 이메일 알림 1발 + 전환 이벤트 1발.
  useEffect(() => {
    if (state.ok && lastSubmit.current && notifiedState.current !== state) {
      notifiedState.current = state
      const data = lastSubmit.current
      sendEmailNotice(data, kinds)
      if (!data.get('company')) {
        track(`lead_${String(data.get('kind') ?? '')}`, {
          path: window.location.pathname,
          utm: String(data.get('utm') ?? '') || '(none)',
        })
      }
      lastSubmit.current = null
    }
  }, [state, kinds])

  if (state.ok) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-line bg-white p-8 text-center shadow-sm"
      >
        <p className="text-ink text-lg font-bold">접수됐습니다</p>
        <p className="text-ink-soft mt-2 text-sm">입력하신 이메일로 회신드리겠습니다.</p>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        // 기본 form action은 서버 응답 뒤 입력을 비운다 — 검증 오류가 나도 입력이 남도록 직접 보낸다.
        event.preventDefault()
        // 유입 꼬리표(2026-09-27) — 제출 순간 값을 숨김 필드에 넣어 서버 액션(leads.utm)으로
        if (utmInput.current) utmInput.current.value = readUtm()
        const data = new FormData(event.currentTarget)
        lastSubmit.current = data
        startTransition(() => formAction(data))
      }}
      aria-describedby={state.error ? 'lead-form-error' : undefined}
      className="rounded-2xl border border-line bg-white p-6 shadow-sm"
    >
      <input ref={utmInput} type="hidden" name="utm" defaultValue="" />
      {/* 허니팟(사람에겐 숨김) */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {kinds.length === 1 ? (
        <input type="hidden" name="kind" value={kinds[0].value} />
      ) : (
        <fieldset>
          <legend className="text-ink text-sm font-semibold">신청 종류</legend>
          <div className="mt-2 flex flex-wrap gap-4">
            {kinds.map((kind, i) => (
              <label key={kind.value} className="text-ink flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="kind"
                  value={kind.value}
                  defaultChecked={i === 0}
                  className="accent-teal"
                />
                {kind.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>성함(담당자명)</span>
          <input
            name="name"
            autoComplete="name"
            placeholder="홍길동"
            maxLength={50}
            required
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className={labelCls}>기관·회사명 {optional}</span>
          <input
            name="org"
            autoComplete="organization"
            placeholder="(주)○○"
            maxLength={100}
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className={labelCls}>회신받을 이메일</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="you@example.com"
            maxLength={100}
            required
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className={labelCls}>연락처 {optional}</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="010-0000-0000"
            maxLength={30}
            className={inputCls}
          />
        </label>
      </div>

      {products && products.length > 0 && (
        <label className="mt-4 block">
          <span className={labelCls}>관심 제품 {optional}</span>
          <select name="product" defaultValue="" className={inputCls}>
            <option value="">선택 안 함</option>
            {products.map((product) => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="mt-4 block">
        <span className={labelCls}>요청 내용 {messageRequired ? null : optional}</span>
        <textarea
          name="message"
          placeholder={messagePlaceholder}
          defaultValue={defaultMessage}
          rows={defaultMessage ? 8 : 5}
          maxLength={2000}
          required={messageRequired}
          className={inputCls}
        />
      </label>

      <p className="text-ink-soft mt-3 text-xs">
        남겨주신 정보는 상담·회신 목적으로만 사용합니다.
      </p>

      {state.error && (
        <p id="lead-form-error" role="alert" className="mt-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-teal hover:bg-teal-600 mt-4 inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-white transition-colors disabled:opacity-50"
      >
        {pending ? '접수 중…' : submitLabel}
      </button>
    </form>
  )
}
