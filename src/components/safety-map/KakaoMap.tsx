"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import { loadKakaoMaps } from "@/lib/kakao";
import { type Facility, statusOf, STATUS_META } from "@/lib/facilities";

function pinImage(kakao: any, color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="38" viewBox="0 0 30 38"><path d="M15 0C6.7 0 0 6.5 0 14.5 0 24.6 15 38 15 38s15-13.4 15-23.5C30 6.5 23.3 0 15 0z" fill="${color}"/><circle cx="15" cy="14.2" r="5.2" fill="#fff"/></svg>`;
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return new kakao.maps.MarkerImage(url, new kakao.maps.Size(30, 38), {
    offset: new kakao.maps.Point(15, 38),
  });
}

function mappableOf(facilities: Facility[]) {
  return facilities.filter(
    (f) =>
      typeof f.lat === "number" &&
      typeof f.lng === "number" &&
      !Number.isNaN(f.lat) &&
      !Number.isNaN(f.lng),
  );
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
  // keep latest data for the effect without making it a dependency.
  // 렌더 중 ref를 쓰지 않도록(react-hooks/refs) 매 커밋 effect에서 갱신 — 아래
  // 마커/panTo effect보다 먼저 선언돼 항상 최신값을 읽는다.
  const dataRef = useRef({ facilities, now, onSelect });
  useEffect(() => {
    dataRef.current = { facilities, now, onSelect };
  });
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);

  // Stable signature of the plotted points. The marker/bounds effect runs ONLY
  // when this changes — preventing repeated setBounds() on identical re-renders,
  // which was aborting in-flight map tiles (blank map with many markers).
  const sig = useMemo(
    () =>
      mappableOf(facilities)
        .map(
          (f) =>
            `${f.id}:${f.lat!.toFixed(5)},${f.lng!.toFixed(5)}:${statusOf(f, now)}`,
        )
        .join("|"),
    [facilities, now],
  );

  useEffect(() => {
    let cancelled = false;
    loadKakaoMaps()
      .then((kakao) => {
        if (cancelled || !boxRef.current) return;
        kakaoRef.current = kakao;
        mapRef.current = new kakao.maps.Map(boxRef.current, {
          center: new kakao.maps.LatLng(36.5, 127.8),
          level: 12,
        });
        clustererRef.current = new kakao.maps.MarkerClusterer({
          map: mapRef.current,
          averageCenter: true,
          minLevel: 7,
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
    const { facilities, now, onSelect } = dataRef.current;
    const mappable = mappableOf(facilities);

    clusterer.clear();
    const images: Record<string, any> = {
      planned: pinImage(kakao, STATUS_META.planned.pin),
      installed: pinImage(kakao, STATUS_META.installed.pin),
      managed: pinImage(kakao, STATUS_META.managed.pin),
      ended: pinImage(kakao, STATUS_META.ended.pin),
      demolished: pinImage(kakao, STATUS_META.demolished.pin),
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

    if (mappable.length) {
      const bounds = new kakao.maps.LatLngBounds();
      mappable.forEach((f) =>
        bounds.extend(new kakao.maps.LatLng(f.lat, f.lng)),
      );
      map.setBounds(bounds);
      if (mappable.length === 1) map.setLevel(5);
    }
    // force a tile re-fetch after the view settles (recovers any aborted tiles)
    const t = setTimeout(() => {
      try {
        map.relayout();
      } catch {
        /* noop */
      }
    }, 250);
    return () => clearTimeout(t);
  }, [sig, ready]);

  useEffect(() => {
    const kakao = kakaoRef.current;
    const map = mapRef.current;
    if (!ready || !kakao || !map || !selectedId) return;
    const f = dataRef.current.facilities.find((x) => x.id === selectedId);
    if (f && typeof f.lat === "number" && typeof f.lng === "number")
      map.panTo(new kakao.maps.LatLng(f.lat, f.lng));
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
