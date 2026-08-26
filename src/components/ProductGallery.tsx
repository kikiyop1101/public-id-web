'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { GalleryItem } from '@/lib/product-media'

// 참조 사진·영상 갤러리. 썸네일 그리드 + 클릭 시 라이트박스(←/→/Esc 지원).
// 접힌 상태에서 첫 줄만 보이게 — 그리드 열 수(3/4/6)가 브레이크포인트마다 달라
// 인덱스별로 반응형 hidden 클래스를 계산한다 (대표 지시 2026-08-26 "첫줄만 보이고 누르면 펴지게").
function collapsedClass(i: number) {
  if (i < 3) return ''
  if (i === 3) return 'hidden sm:block'
  if (i < 6) return 'hidden md:block'
  return 'hidden'
}

export default function ProductGallery({
  items,
  productName,
}: {
  items: GalleryItem[]
  productName: string
}) {
  const [open, setOpen] = useState<number | null>(null)
  const [expanded, setExpanded] = useState(false)
  const collapsible = items.length > 3
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)
  const isOpen = open !== null

  const close = useCallback(() => setOpen(null), [])
  const move = useCallback(
    (dir: 1 | -1) => {
      setOpen((cur) => (cur === null ? null : (cur + dir + items.length) % items.length))
    },
    [items.length],
  )

  // 열릴 때 포커스를 다이얼로그로 옮기고, 닫힐 때 열었던 버튼으로 복원 (내비게이션 중엔 재실행 안 되게 isOpen만 의존)
  useEffect(() => {
    if (!isOpen) return
    lastFocusedRef.current = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      lastFocusedRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') move(1)
      if (e.key === 'ArrowLeft') move(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close, move])

  if (items.length === 0) return null

  const current = open === null ? null : items[open]

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setOpen(i)}
            className={`border-line hover:border-teal group relative aspect-square overflow-hidden rounded-xl border bg-cloud transition ${
              collapsible && !expanded ? collapsedClass(i) : ''
            }`}
            aria-label={`${productName} 참조 ${i + 1} 크게 보기`}
          >
            {item.kind === 'image' ? (
              <Image
                src={item.src}
                alt={`${productName} 참조 이미지 ${i + 1}`}
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <>
                <video
                  src={item.src}
                  muted
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy/70 text-white">
                    ▶
                  </span>
                </span>
              </>
            )}
          </button>
        ))}
      </div>

      {collapsible && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="border-line text-ink-soft hover:border-teal hover:text-teal-700 mt-3 inline-flex h-10 items-center gap-1.5 rounded-full border bg-white px-5 text-sm font-medium transition"
        >
          {expanded ? '사례 접기' : `사례 ${items.length}개 모두 보기`}
          <span aria-hidden className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>
            ⌄
          </span>
        </button>
      )}

      {current && (
        <div
          ref={dialogRef}
          tabIndex={-1}
          aria-label={`${productName} 확대 보기`}
          className="fixed inset-0 z-[100] flex items-center justify-center overscroll-contain bg-navy/90 p-4 outline-none"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-h-[85vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {current.kind === 'image' ? (
              <div className="relative h-[75vh] w-full">
                <Image
                  src={current.src}
                  alt={`${productName} 참조 확대`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            ) : (
              <video
                src={current.src}
                controls
                autoPlay
                playsInline
                className="mx-auto max-h-[75vh] w-full rounded-xl"
              />
            )}
            <div className="mt-3 flex items-center justify-between text-sm text-white/80">
              <button
                type="button"
                onClick={() => move(-1)}
                className="rounded-full border border-white/30 px-4 py-1.5 transition hover:border-white hover:text-white"
              >
                ← 이전
              </button>
              <span>
                {(open ?? 0) + 1} / {items.length}
              </span>
              <button
                type="button"
                onClick={() => move(1)}
                className="rounded-full border border-white/30 px-4 py-1.5 transition hover:border-white hover:text-white"
              >
                다음 →
              </button>
            </div>
            <button
              type="button"
              onClick={close}
              className="absolute -top-2 right-0 -translate-y-full rounded-full border border-white/30 px-3 py-1 text-sm text-white/80 transition hover:border-white hover:text-white"
            >
              닫기 ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}
