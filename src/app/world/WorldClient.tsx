'use client'

import { useEffect, useRef } from 'react'
import {
  WORLD_SECTIONS,
  WORLD_CONNECTORS,
  WORLD_CONNECTORS_MOBILE,
} from './world-config'

declare global {
  interface Window {
    mountScrollWorld?: (el: HTMLElement, config: unknown) => void
  }
}

const ENGINE_SRC = '/world/scrub-engine.js'

export default function WorldClient() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let cancelled = false

    // 사이트 헤더·푸터를 이 페이지에서만 감춘다(영상 위 겹침 방지).
    document.body.classList.add('world-immersive')

    const mount = () => {
      if (cancelled || !window.mountScrollWorld) return
      // 폰은 화면이 작고 플릭 스크롤이 커서 같은 scroll 값도 훨씬 빠르게 느껴진다
      // → 모바일에서만 장면당 스크롤 거리를 2.2배 (대표 실기기 피드백 07-26)
      const mobile =
        window.matchMedia('(pointer: coarse)').matches ||
        window.innerWidth <= 860
      const pace = mobile ? 2.2 : 1
      window.mountScrollWorld(el, {
        brand: { name: '퍼블릭아이디 STORE', href: 'https://www.public-id.co.kr' },
        diveScroll: 2.0 * pace,
        connScroll: 1.3 * pace,
        hint: '스크롤하면 날아갑니다',
        nav: true,
        atmosphere: true,
        sections: WORLD_SECTIONS.map((s) => ({
          ...s,
          scroll: s.scroll ? s.scroll * pace : undefined,
        })),
        connectors: WORLD_CONNECTORS,
        connectorsMobile: WORLD_CONNECTORS_MOBILE,
      })
    }

    // 엔진은 public/world/scrub-engine.js 의 바닐라 스크립트. 이미 로드됐으면 재사용.
    if (window.mountScrollWorld) {
      mount()
      return
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${ENGINE_SRC}"]`,
    )
    const script = existing ?? document.createElement('script')
    script.addEventListener('load', mount)
    if (!existing) {
      script.src = ENGINE_SRC
      script.async = true
      document.body.appendChild(script)
    }

    return () => {
      cancelled = true
      script.removeEventListener('load', mount)
      document.body.classList.remove('world-immersive')
    }
  }, [])

  // 영상 배경이 장면마다 조금씩 다르다(청록회색~웜베이지). 페이지 배경은 BI 네이비로
  // 눌러 레터박스가 튀지 않게 하고, 글자는 밝게 뒤집는다.
  return (
    <div
      ref={ref}
      className="sw-root"
      style={
        {
          '--sw-bg': '#16303D',
          '--sw-ink': '#F2F6F7',
          '--sw-ink-soft': 'rgba(242,246,247,0.72)',
          '--sw-accent': '#069CBB',
        } as React.CSSProperties
      }
    />
  )
}
