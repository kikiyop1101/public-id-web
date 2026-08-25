'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { createReport, type ReportFormState } from '@/app/safety-report/actions'
import { compressPhoto } from '@/lib/photo'
import { REPORT_CATEGORIES } from '@/lib/reports'

const SafetyMap = dynamic(() => import('@/components/SafetyMap'), { ssr: false })

const initial: ReportFormState = {}
const inputCls = 'rounded-xl border border-line px-3 py-2 text-sm'
const MAX_PHOTOS = 3

// 이메일 알림 — 리드와 동일하게 접수 성공 후 브라우저에서 발사(Web3Forms 공개 키).
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY

function sendEmailNotice(data: FormData) {
  if (!WEB3FORMS_KEY) return
  const get = (key: string) => String(data.get(key) ?? '').trim()
  if (get('company')) return
  const category =
    REPORT_CATEGORIES[get('category') as keyof typeof REPORT_CATEGORIES] ?? get('category')
  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: `[안전 리포트 제보] ${category}`,
      from_name: '퍼블릭아이디 스토어',
      name: get('reporter_name') || '익명 제보',
      email: 'public-id@naver.com',
      message: [
        `위험 유형: ${category}`,
        get('addr') ? `위치: ${get('addr')}` : '위치: 지도 핀 참조',
        `내용:\n${get('description')}`,
        '',
        '승인·관리: https://www.public-id.co.kr/admin',
      ].join('\n'),
    }),
  }).catch(() => {})
}

export default function ReportForm() {
  const [state, formAction, pending] = useActionState(createReport, initial)
  const [photos, setPhotos] = useState<File[]>([])
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null)
  const lastSubmit = useRef<FormData | null>(null)
  const notifiedState = useRef<ReportFormState | null>(null)

  useEffect(() => {
    if (state.ok && lastSubmit.current && notifiedState.current !== state) {
      notifiedState.current = state
      sendEmailNotice(lastSubmit.current)
      lastSubmit.current = null
      setPhotos([])
      setPin(null)
    }
  }, [state])

  async function onPhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(0, MAX_PHOTOS)
    const compressed: File[] = []
    for (const file of files) {
      try {
        compressed.push(await compressPhoto(file))
      } catch {
        // 압축 실패(특이 포맷)면 해당 파일은 건너뛴다
      }
    }
    setPhotos(compressed)
  }

  return (
    <form
      action={(formData) => {
        // 파일 input 원본 대신 압축본을 싣는다
        formData.delete('photos')
        for (const photo of photos) formData.append('photos', photo)
        if (pin) {
          formData.set('lat', String(pin.lat))
          formData.set('lng', String(pin.lng))
        }
        lastSubmit.current = formData
        return formAction(formData)
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
      <input type="hidden" name="lat" />
      <input type="hidden" name="lng" />

      <fieldset>
        <legend className="text-ink text-sm font-semibold">어떤 위험인가요?</legend>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
          {Object.entries(REPORT_CATEGORIES).map(([value, label], index) => (
            <label key={value} className="text-ink flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="category"
                value={value}
                defaultChecked={index === 0}
                className="accent-teal"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5">
        <p className="text-ink text-sm font-semibold">
          현장 사진 <span className="text-ink-soft font-normal">(1~3장, 필수)</span>
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onPhotoChange}
          aria-label="현장 사진 업로드"
          className="text-ink-soft mt-2 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-teal file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        />
        {photos.length > 0 && (
          <p className="text-teal-600 mt-1 text-xs">사진 {photos.length}장 준비됨 (위치 정보는 자동 제거됩니다)</p>
        )}
      </div>

      <div className="mt-5">
        <p className="text-ink text-sm font-semibold">
          위치 <span className="text-ink-soft font-normal">(지도를 눌러 핀을 찍어주세요)</span>
        </p>
        <div className="border-line mt-2 overflow-hidden rounded-xl border">
          <SafetyMap markers={[]} onPick={(lat, lng) => setPin({ lat, lng })} className="h-72 w-full" />
        </div>
        {pin && <p className="text-teal-600 mt-1 text-xs">핀 위치가 저장됐습니다.</p>}
        <input
          name="addr"
          aria-label="위치 설명"
          placeholder="위치 설명 (예: ○○초등학교 정문 앞 횡단보도)"
          maxLength={200}
          className={`mt-2 w-full ${inputCls}`}
        />
      </div>

      <textarea
        name="description"
        aria-label="위험 내용"
        placeholder="어떤 점이 위험한지 적어주세요. (예: 아이들이 신호를 기다리는 공간이 좁고 차가 가깝게 지나갑니다)"
        rows={4}
        required
        className={`mt-5 w-full ${inputCls}`}
      />

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input
          name="reporter_name"
          aria-label="이름 또는 별명"
          placeholder="이름·별명 (선택)"
          maxLength={50}
          className={inputCls}
        />
        <input
          name="reporter_contact"
          aria-label="연락처"
          placeholder="이메일·연락처 (선택 — 개선 소식 알림용)"
          maxLength={100}
          className={inputCls}
        />
      </div>

      <p className="text-ink-soft mt-3 text-xs">
        제보는 검토 후 게시되며, 공개 지도에는 대략적인 위치만 표시됩니다. 사진의 위치
        정보(EXIF)는 업로드 전에 자동 제거되고, 연락처는 개선 소식 안내 목적으로만
        사용합니다.
      </p>

      {state.error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p role="status" className="text-teal mt-2 text-sm font-medium">
          제보가 접수됐습니다. 검토 후 지도에 공개됩니다 — 함께해 주셔서 감사합니다!
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-teal hover:bg-teal-600 mt-4 inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-white transition-colors disabled:opacity-50"
      >
        {pending ? '접수 중…' : '위험 지점 제보하기'}
      </button>
    </form>
  )
}
