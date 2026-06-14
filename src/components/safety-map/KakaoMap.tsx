"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { loadKakaoMaps } from "@/lib/kakao";
import { type Facility, statusOf, STATUS_META } from "@/lib/facilities";

function pinImage(kakao: any, color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="38" viewBox="0 0 30 38"><path d="M15 0C6.7 0 0 6.5 0 14.5 0 24.6 15 38 15 38s15-13.4 15-23.5C30 6.5 23.3 0 15 0z" fill="${color}"/><circle cx="15" cy="14.2" r="5.2" fill="#fff"/></svg>`;
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return new kakao.maps.MarkerImage(url, new kakao.maps.Size(30, 38), {
    offset: new kakao.maps.Point(15, 38),
  });
}

export default function KakaoMap({
  facilities,
  selectedId,
  onSelect,
  now,
}: {
  facilities: Facility[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  now: Date;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const kakaoRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const clustererRef = useRef<any>(null);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadKakaoMaps()
      .then((kakao) => {
        if (cancelled || !boxRef.current) return;
        kakaoRef.current = kakao;
        mapRef.current = new kakao.maps.Map(boxRef.current, {
          center: new kakao.maps.LatLng(36.5, 127.8),
          level: 13,
        });
        clustererRef.current = new kakao.maps.MarkerClusterer({
          map: mapRef.current,
          averageCenter: true,
          minLevel: 8,
          gridSize: 70,
        });
        setReady(true);
      })
      .catch(() => setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const kakao = kakaoRef.current;
    const map = mapRef.current;
    const clusterer = clustererRef.current;
    if (!ready || !kakao || !map || !clusterer) return;
    clusterer.clear();
    const mappable = facilities.filter(
      (f) => typeof f.lat === "number" && typeof f.lng === "number",
    );
    const images: Record<string, any> = {
      active: pinImage(kakao, STATUS_META.active.color),
      expiring: pinImage(kakao, STATUS_META.expiring.color),
      expired: pinImage(kakao, STATUS_META.expired.color),
    };
    const markers = mappable.map((f) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(f.lat, f.lng),
        image: images[statusOf(f, now)],
        title: f.name,
      });
      kakao.maps.event.addListener(marker, "click", () => onSelect(f.id));
      return marker;
    });
    clusterer.addMarkers(markers);
    if (facilities.length) {
      const bounds = new kakao.maps.LatLngBounds();
      facilities.forEach((f) =>
        bounds.extend(new kakao.maps.LatLng(f.lat, f.lng)),
      );
      map.setBounds(bounds);
      if (facilities.length === 1) map.setLevel(6);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facilities, ready, now]);

  useEffect(() => {
    const kakao = kakaoRef.current;
    const map = mapRef.current;
    if (!ready || !kakao || !map || !selectedId) return;
    const f = facilities.find((x) => x.id === selectedId);
    if (f) map.panTo(new kakao.maps.LatLng(f.lat, f.lng));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, ready]);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-2xl border border-line bg-cloud p-6 text-center text-sm leading-relaxed text-ink-soft">
        지도를 불러오지 못했습니다.
        <br />
        카카오 개발자 콘솔에 현재 접속 도메인이 등록되어 있는지 확인해 주세요.
      </div>
    );
  }
  return (
    <div
      ref={boxRef}
      className="h-full w-full overflow-hidden rounded-2xl border border-line bg-cloud"
    />
  );
}
