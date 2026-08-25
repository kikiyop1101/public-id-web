'use client'

import { useActionState, useState } from 'react'
import dynamic from 'next/dynamic'
import { compressPhoto } from '@/lib/photo'
import { REPORT_CATEGORIES } from '@/lib/reports'
import { createShowcase, type ShowcaseState } from './actions'

const SafetyMap = dynamic(() => import('@/components/SafetyMap'), { ssr: false })

const initial: ShowcaseState = {}
const inputCls = 'rounded-xl border border-line px-3 py-2 text-sm'

export default function ShowcaseForm() {
  const [state, formAction, pending] = useActionState(createShowcase, initial)
  const [photos, setPhotos] = useState<File[]>([])
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null)

  async function onPhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(0, 3)
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
        formData.delete('photos')
        for (const photo of photos) formData.append('photos', photo)
        if (pin) {
          formData.set('lat', String(pin.lat))
          formData.set('lng', String(pin.lng))
        }
        return formAction(formData)
      }}
      className="border-line mt-4 rounded-2xl border bg-white p-5 shadow-sm"
    >
      <input type="hidden" name="lat" />
      <input type="hidden" name="lng" />

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="public_label"
          aria-label="공개 표시명"
          placeholder="공개 표시명 (예: 세종시 보람동)"
          maxLength={60}
          required
          className={inputCls}
        />
        <input
          name="addr"
          aria-label="현장 설명"
          placeholder="현장 설명 (예: ○○초등학교 정문 앞)"
          maxLength={200}
          className={inputCls}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
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

      <textarea
        name="description"
        aria-label="시공 내용"
        placeholder="어떤 개선을 했는지 적어주세요. (예: 횡단보도 앞 대기 공간에 노란발자국을 부착해 아이들이 안전선 안쪽에서 기다리게 했습니다)"
        rows={3}
        required
        className={`mt-3 w-full ${inputCls}`}
      />

      <div className="mt-3">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onPhotoChange}
          aria-label="시공 사진 업로드"
          className="text-ink-soft file:bg-teal block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        />
        {photos.length > 0 && (
          <p className="text-teal-600 mt-1 text-xs">사진 {photos.length}장 준비됨</p>
        )}
      </div>

      <div className="border-line mt-3 overflow-hidden rounded-xl border">
        <SafetyMap markers={[]} onPick={(lat, lng) => setPin({ lat, lng })} className="h-72 w-full" />
      </div>
      <p className="text-ink-soft mt-1 text-xs">
        {pin ? `핀 저장됨 (${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)})` : '지도를 눌러 시공 위치에 핀을 찍어주세요.'}
      </p>

      {state.error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p role="status" className="text-teal mt-2 text-sm font-medium">
          사례가 등록됐습니다. 지도에 노란 핀으로 바로 표시됩니다.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-teal hover:bg-teal-600 mt-4 inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-white transition-colors disabled:opacity-50"
      >
        {pending ? '등록 중…' : '사례 등록 (지도에 바로 공개)'}
      </button>
    </form>
  )
}
