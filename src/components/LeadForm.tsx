'use client'

import { useActionState, useEffect, useRef } from 'react'
import { createLead, type LeadFormState } from '@/app/quote/actions'

const initial: LeadFormState = {}

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
  submitLabel?: string
}

const inputCls = 'rounded-xl border border-line px-3 py-2 text-sm'

export default function LeadForm({
  kinds,
  products,
  messagePlaceholder = '요청 내용을 입력해 주세요.',
  submitLabel = '신청하기',
}: Props) {
  const [state, formAction, pending] = useActionState(createLead, initial)
  // 제출 "순간"의 폼 값 — 서버 액션 성공 후에는 React가 폼을 비워버리므로 여기서 잡아둔다.
  const lastSubmit = useRef<FormData | null>(null)
  const notifiedState = useRef<LeadFormState | null>(null)

  // 접수 성공(state 갱신) 1회당 이메일 알림 1발.
  useEffect(() => {
    if (state.ok && lastSubmit.current && notifiedState.current !== state) {
      notifiedState.current = state
      sendEmailNotice(lastSubmit.current, kinds)
      lastSubmit.current = null
    }
  }, [state, kinds])

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        lastSubmit.current = new FormData(event.currentTarget)
      }}
      className="rounded-2xl border border-line bg-white p-6 shadow-sm"
    >
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

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          name="name"
          aria-label="성함(담당자명)"
          autoComplete="name"
          placeholder="성함(담당자명) *"
          maxLength={50}
          required
          className={inputCls}
        />
        <input
          name="org"
          aria-label="기관·회사명"
          autoComplete="organization"
          placeholder="기관·회사명"
          maxLength={100}
          className={inputCls}
        />
        <input
          name="email"
          type="email"
          aria-label="이메일"
          autoComplete="email"
          placeholder="회신받을 이메일 *"
          maxLength={100}
          required
          className={inputCls}
        />
        <input
          name="phone"
          type="tel"
          aria-label="연락처"
          autoComplete="tel"
          placeholder="연락처(선택)"
          maxLength={30}
          className={inputCls}
        />
      </div>

      {products && products.length > 0 && (
        <select
          name="product"
          aria-label="관심 제품"
          defaultValue=""
          className={`mt-3 w-full ${inputCls} bg-white`}
        >
          <option value="">관심 제품 선택(선택)</option>
          {products.map((product) => (
            <option key={product} value={product}>
              {product}
            </option>
          ))}
        </select>
      )}

      <textarea
        name="message"
        aria-label="요청 내용"
        placeholder={messagePlaceholder}
        rows={5}
        className={`mt-3 w-full ${inputCls}`}
      />

      <p className="text-ink-soft mt-3 text-xs">
        남겨주신 정보는 상담·회신 목적으로만 사용합니다.
      </p>

      {state.error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p role="status" className="text-teal mt-2 text-sm font-medium">
          접수됐습니다. 입력하신 이메일로 회신드리겠습니다.
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
