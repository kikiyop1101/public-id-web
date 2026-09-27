'use client'

import { useEffect, useRef, useState } from 'react'

// 첫 화면 아래 자동재생 영상(2026-09-27 성능 점검).
// <video autoPlay>는 preload="metadata"여도 자동재생 때문에 페이지를 열자마자 포스터·영상을 전부 받는다
// (/products 실측: 화면 밖 구조분석 영상 3편 + 포스터 gif 3장 ≈ 1.8MB가 첫 로드에 실림).
// 화면 가까이(300px 전) 왔을 때만 포스터와 소스를 붙이고 재생한다. 재생 방식(무음·반복)은 그대로다.
// eager = 첫 화면 영상(LCP)이라 처음부터 포스터·소스를 붙인다.
// prefers-reduced-motion: reduce면 재생하지 않고 포스터에 멈춘다(2026-09-27 접근성 점검 — autoPlay 속성은 이 설정을
// 무시하므로 속성 대신 play()로 직접 재생하고, 설정이 바뀌면 따라간다).
type Source = { src: string; type: string }

export default function LazyVideo({
  sources,
  poster,
  className,
  ariaHidden,
  eager = false,
}: {
  sources: Source[]
  poster?: string
  className?: string
  ariaHidden?: boolean
  eager?: boolean
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [near, setNear] = useState(eager)

  useEffect(() => {
    const el = ref.current
    if (!el || eager) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [eager])

  useEffect(() => {
    const el = ref.current
    if (!near || !el) return
    // 지연 로드는 <source>를 나중에 붙였으므로 load()로 다시 고르게 한다(eager는 SSR 때 이미 붙어 있음)
    if (!eager) el.load()
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      if (mq.matches) el.pause()
      else el.play().catch(() => {}) // 자동재생 차단 시 포스터로 남는다
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [near, eager])

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload={eager ? 'metadata' : 'none'}
      poster={near ? poster : undefined}
      aria-hidden={ariaHidden || undefined}
      className={className}
    >
      {near && sources.map((s) => <source key={s.src} src={s.src} type={s.type} />)}
    </video>
  )
}
