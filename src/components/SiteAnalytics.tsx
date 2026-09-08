"use client";

import Script from "next/script";
import { useEffect } from "react";
import { track } from "@vercel/analytics";

// 체류시간 "시계" (2026-09-08 체류시간 기획안 0주차).
// 1) GA4 — NEXT_PUBLIC_GA_ID(G-XXXX)가 있을 때만 로드. 참여시간·참여율 정본.
// 2) Microsoft Clarity — NEXT_PUBLIC_CLARITY_ID가 있을 때만 로드. 히트맵·세션 녹화.
// 3) EngagementBeacon — 계정 없이도 도는 자체 시계. 화면이 보이는 동안만 초를 세어
//    30초·60초·180초 문턱을 넘을 때 Vercel Analytics 커스텀 이벤트를 한 번씩 보낸다.
//    → 대시보드에서 engaged_60s / 전체 방문 = "1분 넘게 머문 비율"을 바로 읽는다.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

const THRESHOLDS = [30, 60, 180] as const;

function EngagementBeacon() {
  useEffect(() => {
    let visibleSec = 0;
    let lastTick = performance.now();
    const sent = new Set<number>();
    const path = () => window.location.pathname;

    const tick = () => {
      const now = performance.now();
      if (document.visibilityState === "visible") {
        visibleSec += (now - lastTick) / 1000;
        for (const t of THRESHOLDS) {
          if (visibleSec >= t && !sent.has(t)) {
            sent.add(t);
            track(`engaged_${t}s`, { path: path() });
          }
        }
      }
      lastTick = now;
    };
    const onVis = () => {
      lastTick = performance.now();
    };
    const id = window.setInterval(tick, 5000);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);
  return null;
}

export default function SiteAnalytics() {
  return (
    <>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {CLARITY_ID && (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
        </Script>
      )}
      <EngagementBeacon />
    </>
  );
}
