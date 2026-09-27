'use client'

import { useEffect, useRef, useState } from 'react'

// 첫 화면 아래 자동재생 영상(2026-09-27 성능 점검).
// <video autoPlay>는 preload="metadata"여도 자동재생 때문에 페이지를 열자마자 포스터·영상을 전부 받는다
// (/products 실측: 화면 밖 구조분석 영상 3편 + 포스터 gif 3장 ≈ 1.8MB가 첫 로드에 실림).
// 화면 가까이(300px 전) 왔을 때만 포스터와 소스를 붙이고 재생한다. 재생 방식(무음·반복·자동재생)은 그대로다.
type Source = { src: string; type: string }

export default function LazyVideo({
  sources,
  poster,
  className,
  ariaHidden,
}: {
  sources: Source[]
  poster?: string
  className?: string
  ariaHidden?: boolean
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
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
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!near || !el) return
    // <source>를 나중에 붙였으므로 load()로 다시 고르게 한 뒤 재생(자동재생 차단 시 포스터로 남는다)
    el.load()
    el.play().catch(() => {})
  }, [near])

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      poster={near ? poster : undefined}
      aria-hidden={ariaHidden || undefined}
      className={className}
    >
      {near && sources.map((s) => <source key={s.src} src={s.src} type={s.type} />)}
    </video>
  )
}
