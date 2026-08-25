'use client'

import dynamic from 'next/dynamic'
import type { MapMarker } from '@/components/SafetyMap'

// Leaflet은 window를 쓰므로 SSR을 끈다 — 서버 페이지에서 바로 못 하니 이 래퍼가 맡는다.
const SafetyMap = dynamic(() => import('@/components/SafetyMap'), { ssr: false })

export default function SafetyMapSection({ markers }: { markers: MapMarker[] }) {
  return <SafetyMap markers={markers} className="h-[420px] w-full" />
}
