'use client'

import { useEffect, useRef } from 'react'
import type { Map as LeafletMap, CircleMarker } from 'leaflet'
import 'leaflet/dist/leaflet.css'

export type MapMarker = {
  lat: number
  lng: number
  label: string
  /** showcase(시공 사례)는 노랑, 제보는 청록으로 구분 */
  showcase?: boolean
}

type Props = {
  markers: MapMarker[]
  /** 핀 찍기 모드 — 클릭 좌표를 부모에 넘긴다(제보 폼용) */
  onPick?: (lat: number, lng: number) => void
  className?: string
}

// 대한민국 중심(세종 인근) 기본 뷰
const DEFAULT_CENTER: [number, number] = [36.48, 127.29]
const DEFAULT_ZOOM = 7

export default function SafetyMap({ markers, onPick, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const pickMarkerRef = useRef<CircleMarker | null>(null)
  const onPickRef = useRef(onPick)

  useEffect(() => {
    onPickRef.current = onPick
  }, [onPick])

  useEffect(() => {
    let disposed = false
    async function init() {
      if (!containerRef.current || mapRef.current) return
      const L = (await import('leaflet')).default
      if (disposed || !containerRef.current) return

      const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView(
        DEFAULT_CENTER,
        DEFAULT_ZOOM,
      )
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      // 마커는 이미지 아이콘 대신 브랜드 색 원으로(번들 아이콘 경로 문제 회피)
      const bounds: [number, number][] = []
      for (const marker of markers) {
        L.circleMarker([marker.lat, marker.lng], {
          radius: 9,
          color: '#ffffff',
          weight: 2,
          fillColor: marker.showcase ? '#FFD200' : '#0b6c7d',
          fillOpacity: 0.95,
        })
          .addTo(map)
          .bindPopup(marker.label)
        bounds.push([marker.lat, marker.lng])
      }
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
      }

      if (onPickRef.current) {
        map.on('click', (event) => {
          const { lat, lng } = event.latlng
          if (!pickMarkerRef.current) {
            pickMarkerRef.current = L.circleMarker([lat, lng], {
              radius: 10,
              color: '#ffffff',
              weight: 2,
              fillColor: '#069CBB',
              fillOpacity: 1,
            }).addTo(map)
          } else {
            pickMarkerRef.current.setLatLng([lat, lng])
          }
          onPickRef.current?.(lat, lng)
        })
      }

      mapRef.current = map
    }
    void init()
    return () => {
      disposed = true
      mapRef.current?.remove()
      mapRef.current = null
      pickMarkerRef.current = null
    }
    // markers는 서버에서 내려오는 정적 목록 — 마운트 시 1회만 그린다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={containerRef} className={className ?? 'h-[420px] w-full'} />
}
