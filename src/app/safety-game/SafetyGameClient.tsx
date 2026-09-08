"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { GAME_SECONDS, SCENES, gradeFor, type Hazard, type Scene } from "@/lib/safety-game";
import { cn } from "@/lib/cn";

// "숨은 위험 찾기" 게임 엔진 (2026-09-08). 장면 이미지 위 타원 핫스팟을 탭해 위험 8곳을 찾는다.
// 설계: 해외 안전기관(OSHA·Road Safety Scotland·EHS Global Tech)의 spot-the-hazard 형식에
// ① 찾을 때마다 해설 + "우리 제품이 해결" 카드 ② 도전(60초)/자유 모드 ③ 힌트(감점) ④ 모바일 2배 확대
// ⑤ 등급·결과 카드 이미지 저장·공유 ⑥ 장면별 최고 기록(브라우저 저장) 을 더했다. 개인정보 수집 없음.

type Mode = "timed" | "free";
type Phase = "start" | "play" | "result";
type Ping = { id: number; x: number; y: number; ok: boolean };

const BEST_KEY = "pi-safety-game-best";
const FIND_SCORE = 100;
const HINT_COST = 30;
const MISS_COST = 5;

function readBest(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(BEST_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export default function SafetyGameClient({ initialScene }: { initialScene?: string }) {
  const [phase, setPhase] = useState<Phase>("start");
  const [scene, setScene] = useState<Scene>(
    () => SCENES.find((s) => s.id === initialScene) ?? SCENES[0],
  );
  const [mode, setMode] = useState<Mode>("timed");
  const [found, setFound] = useState<string[]>([]);
  const [current, setCurrent] = useState<Hazard | null>(null);
  const [misses, setMisses] = useState(0);
  const [hints, setHints] = useState(0);
  const [hintTarget, setHintTarget] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(GAME_SECONDS);
  const [elapsed, setElapsed] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pings, setPings] = useState<Ping[]>([]);
  const [best, setBest] = useState<Record<string, number>>({});
  const [announce, setAnnounce] = useState("");
  const [saved, setSaved] = useState<"idle" | "ok" | "fail">("idle");
  const imgRef = useRef<HTMLImageElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pingSeq = useRef(0);
  const finishedRef = useRef(false);

  const total = scene.hazards.length;
  const foundCount = found.length;
  const timeBonus = mode === "timed" ? seconds * 2 : 0;
  const score = Math.max(0, foundCount * FIND_SCORE - hints * HINT_COST - misses * MISS_COST) + (phase === "result" ? timeBonus : 0);

  // 브라우저 저장소는 마운트 뒤 다음 프레임에 읽는다(SSR 불일치·effect 내 동기 setState 회피).
  useEffect(() => {
    const id = requestAnimationFrame(() => setBest(readBest()));
    return () => cancelAnimationFrame(id);
  }, []);

  const finish = useCallback(
    (reason: "all" | "time" | "quit") => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setPhase("result");
      const finalScore = Math.max(0, found.length * FIND_SCORE - hints * HINT_COST - misses * MISS_COST) + (mode === "timed" ? seconds * 2 : 0);
      const next = { ...readBest() };
      if ((next[scene.id] ?? 0) < finalScore) {
        next[scene.id] = finalScore;
        try {
          localStorage.setItem(BEST_KEY, JSON.stringify(next));
        } catch {}
      }
      setBest(next);
      track("game_complete", { scene: scene.id, mode, found: found.length, score: finalScore, sec: elapsed, reason });
    },
    [found.length, hints, misses, mode, seconds, scene.id, elapsed],
  );

  // 타이머 — 도전 모드는 카운트다운, 자유 모드는 경과 시간만.
  useEffect(() => {
    if (phase !== "play") return;
    const id = window.setInterval(() => {
      setElapsed((e) => e + 1);
      if (mode === "timed") setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, mode]);

  useEffect(() => {
    if (phase === "play" && mode === "timed" && seconds === 0) finish("time");
  }, [phase, mode, seconds, finish]);

  useEffect(() => {
    if (phase === "play" && foundCount === total) {
      const t = window.setTimeout(() => finish("all"), 900);
      return () => window.clearTimeout(t);
    }
  }, [phase, foundCount, total, finish]);

  const start = (s: Scene, m: Mode) => {
    setScene(s);
    setMode(m);
    setFound([]);
    setCurrent(null);
    setMisses(0);
    setHints(0);
    setHintTarget(null);
    setSeconds(GAME_SECONDS);
    setElapsed(0);
    setZoom(1);
    setPings([]);
    setSaved("idle");
    finishedRef.current = false;
    setPhase("play");
    setAnnounce(`${s.name} 시작. 위험 ${s.hazards.length}곳을 찾으세요.`);
    track("game_start", { scene: s.id, mode: m });
  };

  const addPing = (x: number, y: number, ok: boolean) => {
    const id = ++pingSeq.current;
    setPings((p) => [...p.slice(-5), { id, x, y, ok }]);
    window.setTimeout(() => setPings((p) => p.filter((q) => q.id !== id)), 900);
  };

  const onTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (phase !== "play") return;
    const img = imgRef.current;
    if (!img) return;
    const r = img.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * 100;
    const py = ((e.clientY - r.top) / r.height) * 100;
    if (px < 0 || px > 100 || py < 0 || py > 100) return;
    // 타원 판정 — 손가락 오차를 감안해 반경을 15% 넉넉하게.
    const hit = scene.hazards.find((h) => {
      if (found.includes(h.id)) return false;
      const dx = (px - h.x) / (h.rx * 1.15);
      const dy = (py - h.y) / (h.ry * 1.15);
      return dx * dx + dy * dy <= 1;
    });
    if (hit) {
      setFound((f) => [...f, hit.id]);
      setCurrent(hit);
      setHintTarget(null);
      addPing(hit.x, hit.y, true);
      setAnnounce(`${foundCount + 1}번째 위험 발견: ${hit.title}`);
      track("game_found", { scene: scene.id, hazard: hit.id });
    } else {
      setMisses((m) => m + 1);
      addPing(px, py, false);
    }
  };

  const useHint = () => {
    const left = scene.hazards.filter((h) => !found.includes(h.id));
    if (!left.length) return;
    const pick = left[Math.floor(Math.random() * left.length)];
    setHints((h) => h + 1);
    setHintTarget(pick.id);
    setAnnounce("힌트: 화면에서 깜빡이는 자리를 살펴보세요.");
    track("game_hint", { scene: scene.id });
    window.setTimeout(() => setHintTarget((t) => (t === pick.id ? null : t)), 2200);
  };

  const toggleZoom = () => {
    const next = zoom === 1 ? 2 : 1;
    setZoom(next);
    if (next === 2) {
      requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (el) {
          el.scrollLeft = el.scrollWidth / 4;
          el.scrollTop = el.scrollHeight / 4;
        }
      });
    }
  };

  const grade = useMemo(() => gradeFor(foundCount, total), [foundCount, total]);

  // 결과 카드 PNG (1080×1350) — 외부 라이브러리 없이 Canvas API.
  const saveCard = async () => {
    try {
      const W = 1080, H = 1350;
      const c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const ctx = c.getContext("2d");
      if (!ctx) throw new Error("no ctx");
      ctx.fillStyle = "#f1f1f0";
      ctx.fillRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, 0, W, 0);
      g.addColorStop(0, "#CADA1F");
      g.addColorStop(0.42, "#7cc63f");
      g.addColorStop(1, "#069CBB");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, 14);
      const thumb = new Image();
      thumb.src = `/safety-game/scene-${scene.id}-thumb.webp`;
      await new Promise<void>((res) => {
        thumb.onload = () => res();
        thumb.onerror = () => res();
      });
      if (thumb.complete && thumb.naturalWidth) {
        const th = Math.round((W - 120) * (thumb.naturalHeight / thumb.naturalWidth));
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(60, 70, W - 120, th, 28);
        ctx.clip();
        ctx.drawImage(thumb, 60, 70, W - 120, th);
        ctx.restore();
      }
      const sans = "'Pretendard', system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "#0b6c7d";
      ctx.font = `600 26px ${sans}`;
      ctx.fillText("숨은 위험 찾기 · " + scene.name, 60, 690);
      ctx.fillStyle = "#0F172A";
      ctx.font = `800 96px ${sans}`;
      ctx.fillText(`${foundCount} / ${total}`, 60, 800);
      ctx.font = `700 44px ${sans}`;
      ctx.fillText(grade.label, 60, 870);
      ctx.fillStyle = "#57636b";
      ctx.font = `500 30px ${sans}`;
      ctx.fillText(`점수 ${score.toLocaleString()} · ${mode === "timed" ? "도전 모드 60초" : "자유 모드"} · ${elapsed}초`, 60, 925);
      ctx.fillStyle = "#e4eaeb";
      ctx.fillRect(60, 960, W - 120, 2);
      ctx.font = `500 28px ${sans}`;
      scene.hazards.forEach((h, i) => {
        const y = 1010 + i * 40;
        const ok = found.includes(h.id);
        ctx.fillStyle = ok ? "#2E9E5B" : "#C9403C";
        ctx.beginPath();
        ctx.arc(74, y - 10, 9, 0, Math.PI * 2);
        ctx.fillStyle = ok ? "#2E9E5B" : "#9aa7ae";
        ctx.fill();
        ctx.fillStyle = "#0F172A";
        ctx.fillText(h.title, 100, y);
      });
      ctx.fillStyle = "#0b6c7d";
      ctx.font = `700 28px ${sans}`;
      ctx.fillText("www.public-id.co.kr/safety-game", 60, H - 60);
      const blob: Blob | null = await new Promise((res) => c.toBlob(res, "image/png"));
      if (!blob) throw new Error("no blob");
      const file = new File([blob], `안전지킴이-${scene.id}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "숨은 위험 찾기 결과", text: `${scene.name}에서 위험 ${foundCount}/${total}곳 발견 — ${grade.label}` });
        track("game_share", { via: "webshare" });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
        track("game_share", { via: "download" });
      }
      setSaved("ok");
    } catch {
      setSaved("fail");
    }
  };

  const cta = (to: string) => track("game_cta", { to, scene: scene.id });

  /* ───────────── 시작 화면 ───────────── */
  if (phase === "start") {
    return (
      <div>
        <div className="grid gap-5 md:grid-cols-3">
          {SCENES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setScene(s)}
              className={cn(
                "group overflow-hidden rounded-3xl border bg-white text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2",
                scene.id === s.id ? "border-teal-700 shadow-lg shadow-teal/10" : "border-line hover:border-teal",
              )}
              aria-pressed={scene.id === s.id}
            >
              <div className="relative aspect-video overflow-hidden bg-cloud">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/safety-game/scene-${s.id}-thumb.webp`}
                  alt=""
                  width={640}
                  height={357}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                />
                {best[s.id] ? (
                  <span className="absolute left-3 top-3 rounded-full bg-navy/85 px-3 py-1 font-display text-xs font-semibold text-white">
                    최고 {best[s.id].toLocaleString()}점
                  </span>
                ) : null}
              </div>
              <div className="p-5">
                <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">{s.eyebrow}</p>
                <h3 className="mt-2 text-lg font-bold text-ink">{s.name}</h3>
                <p className="mt-2 break-keep text-sm leading-relaxed text-ink-soft">{s.intro}</p>
                <p className="mt-3 text-xs text-ink-soft">추천: {s.audience}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-line bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="모드">
            {(
              [
                ["timed", "도전 모드", `${GAME_SECONDS}초 안에 · 남은 시간 보너스`],
                ["free", "자유 모드", "시간 제한 없음 · 교육용"],
              ] as const
            ).map(([m, label, desc]) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={mode === m}
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700",
                  mode === m ? "border-teal-700 bg-teal-100/60" : "border-line hover:border-teal",
                )}
              >
                <span className="block text-sm font-bold text-ink">{label}</span>
                <span className="block text-xs text-ink-soft">{desc}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => start(scene, mode)}
            className="inline-flex h-14 items-center justify-center rounded-full bg-arch px-8 text-[15px] font-semibold text-white shadow-lg shadow-teal/20 transition hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            {scene.name} 시작하기
          </button>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-ink-soft">
          그림 속 위험해 보이는 곳을 누르면 됩니다. 하나 찾을 때마다 왜 위험한지, 어떻게 고치는지 바로 보여 드립니다. 점수와 기록은 이 브라우저에만 저장되며 개인정보를 수집하지 않습니다.
        </p>
      </div>
    );
  }

  /* ───────────── 플레이 · 결과 공통 상단 ───────────── */
  const left = scene.hazards.filter((h) => !found.includes(h.id));

  return (
    <div>
      <div className="sr-only" aria-live="polite">
        {announce}
      </div>

      {/* 상태 바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3">
        <div className="min-w-0">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-700">{scene.eyebrow}</p>
          <p className="truncate text-sm font-bold text-ink">{scene.name}</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="rounded-full bg-teal-100 px-3 py-1 font-display text-sm font-semibold text-teal-700">
            {foundCount} / {total}
          </span>
          <span
            className={cn(
              "rounded-full px-3 py-1 font-display text-sm font-semibold tabular-nums",
              mode === "timed" && seconds <= 10 && phase === "play" ? "bg-danger-bg text-danger-deep" : "bg-navy text-white",
            )}
            aria-label={mode === "timed" ? "남은 시간" : "경과 시간"}
          >
            {mode === "timed"
              ? `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`
              : `${elapsed}초`}
          </span>
          <span className="hidden rounded-full border border-line px-3 py-1 font-display text-sm font-semibold text-ink sm:inline">
            {score.toLocaleString()}점
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* 장면 */}
        <div>
          <div
            ref={scrollRef}
            className={cn(
              "relative overflow-auto rounded-3xl border border-line bg-cloud",
              zoom === 2 ? "max-h-[70vh] overscroll-contain" : "",
            )}
            style={{ touchAction: zoom === 2 ? "pan-x pan-y" : "manipulation" }}
          >
            <div
              className={cn("relative select-none", phase === "play" && "cursor-crosshair")}
              style={{ width: `${zoom * 100}%` }}
              onClick={onTap}
              role={phase === "play" ? "button" : undefined}
              aria-label={phase === "play" ? `${scene.name} 장면. 위험해 보이는 곳을 누르세요.` : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={`/safety-game/scene-${scene.id}.webp`}
                srcSet={`/safety-game/scene-${scene.id}-m.webp 960w, /safety-game/scene-${scene.id}.webp 1920w`}
                sizes="(max-width: 1024px) 100vw, 860px"
                alt={`${scene.name} 장면 일러스트`}
                width={1920}
                height={1071}
                draggable={false}
                className="block h-auto w-full"
              />
              {/* 찾은 위험 마커 */}
              {scene.hazards.map((h, i) =>
                found.includes(h.id) ? (
                  <span
                    key={h.id}
                    className="pointer-events-none absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-yellow font-display text-sm font-bold text-navy shadow-md"
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                ) : null,
              )}
              {/* 결과 화면에선 못 찾은 것도 점선으로 */}
              {phase === "result" &&
                left.map((h) => (
                  <span
                    key={h.id}
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-danger"
                    style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.rx * 2}%`, height: `${h.ry * 2}%` }}
                    aria-hidden
                  />
                ))}
              {/* 힌트 펄스 */}
              {hintTarget &&
                scene.hazards
                  .filter((h) => h.id === hintTarget)
                  .map((h) => (
                    <span
                      key={h.id}
                      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${h.x}%`, top: `${h.y}%` }}
                      aria-hidden
                    >
                      <span className="block h-14 w-14 animate-ping rounded-full bg-teal/60 motion-reduce:animate-none motion-reduce:ring-4 motion-reduce:ring-teal" />
                    </span>
                  ))}
              {/* 탭 피드백 */}
              {pings.map((p) => (
                <span
                  key={p.id}
                  className={cn(
                    "pointer-events-none absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 motion-reduce:animate-none",
                    p.ok ? "animate-ping border-yellow" : "animate-ping border-white/80",
                  )}
                  style={{ left: `${p.x}%`, top: `${p.y}%`, animationIterationCount: 1 }}
                  aria-hidden
                />
              ))}
            </div>
          </div>

          {phase === "play" && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={useHint}
                disabled={!left.length}
                className="inline-flex h-10 items-center rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink transition hover:border-teal hover:text-teal-700 disabled:opacity-50"
              >
                힌트 보기 <span className="ml-1 text-xs text-ink-soft">−{HINT_COST}점</span>
              </button>
              <button
                type="button"
                onClick={toggleZoom}
                className="inline-flex h-10 items-center rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink transition hover:border-teal hover:text-teal-700"
                aria-pressed={zoom === 2}
              >
                {zoom === 1 ? "2배 확대" : "확대 해제"}
              </button>
              <button
                type="button"
                onClick={() => finish("quit")}
                className="ml-auto inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold text-ink-soft transition hover:text-ink"
              >
                그만하고 결과 보기
              </button>
            </div>
          )}
        </div>

        {/* 해설 카드 */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          {phase === "play" && !current && (
            <div className="rounded-3xl border border-line bg-white p-6">
              <div className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/mascot/pui-greet-clear.png" alt="퍼이" width={64} height={64} className="h-16 w-auto shrink-0" />
                <div>
                  <p className="text-sm font-bold text-ink">퍼이가 도와드릴게요</p>
                  <p className="mt-1 break-keep text-sm leading-relaxed text-ink-soft">
                    아이 눈높이에서 위험해 보이는 곳을 눌러 보세요. 찾을 때마다 이 자리에 해설이 나옵니다.
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-1 text-xs text-ink-soft">
                <li>찾기 +{FIND_SCORE}점 · 잘못 누름 −{MISS_COST}점 · 힌트 −{HINT_COST}점</li>
                {mode === "timed" && <li>남은 1초당 +2점 보너스</li>}
              </ul>
            </div>
          )}
          {phase === "play" && current && (
            <HazardCard hazard={current} index={found.indexOf(current.id) + 1} onCta={cta} />
          )}
          {phase === "result" && (
            <div className="rounded-3xl border border-teal-700 bg-white p-6 shadow-lg shadow-teal/10">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Result</p>
              <p className="mt-2 font-display text-5xl font-extrabold tracking-tight text-ink">
                {foundCount}
                <span className="text-2xl text-ink-soft"> / {total}</span>
              </p>
              <p className="mt-2 text-lg font-bold text-ink">{grade.label}</p>
              <p className="mt-1 break-keep text-sm leading-relaxed text-ink-soft">{grade.note}</p>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-cloud p-2">
                  <dt className="text-[11px] text-ink-soft">점수</dt>
                  <dd className="font-display text-base font-bold text-ink">{score.toLocaleString()}</dd>
                </div>
                <div className="rounded-xl bg-cloud p-2">
                  <dt className="text-[11px] text-ink-soft">시간</dt>
                  <dd className="font-display text-base font-bold text-ink">{elapsed}초</dd>
                </div>
                <div className="rounded-xl bg-cloud p-2">
                  <dt className="text-[11px] text-ink-soft">최고</dt>
                  <dd className="font-display text-base font-bold text-ink">{(best[scene.id] ?? score).toLocaleString()}</dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-col gap-2">
                <Link
                  href="/safety-report"
                  onClick={() => cta("safety-report")}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-arch px-5 text-[15px] font-semibold text-white shadow-lg shadow-teal/20 transition hover:brightness-105"
                >
                  우리 학교·동네 점검 요청
                </Link>
                <Link
                  href="/estimate"
                  onClick={() => cta("estimate")}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-navy px-5 text-[15px] font-semibold text-white transition hover:bg-teal"
                >
                  고치는 데 얼마? 견적 시뮬레이터
                </Link>
                <button
                  type="button"
                  onClick={saveCard}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-white px-5 text-[15px] font-semibold text-ink transition hover:border-teal hover:text-teal-700"
                >
                  {saved === "ok" ? "결과 카드 저장됨" : saved === "fail" ? "저장 실패 — 다시 시도" : "결과 카드 저장·공유"}
                </button>
                <button
                  type="button"
                  onClick={() => start(scene, mode)}
                  className="inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold text-teal-700 transition hover:text-teal"
                >
                  다시 도전
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* 결과: 전체 해설 */}
      {phase === "result" && (
        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">위험 {total}곳, 전부 해설</h2>
            <div className="flex flex-wrap gap-2">
              {SCENES.filter((s) => s.id !== scene.id).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => start(s, mode)}
                  className="inline-flex h-10 items-center rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink transition hover:border-teal hover:text-teal-700"
                >
                  다음 장면: {s.name} →
                </button>
              ))}
            </div>
          </div>
          <ol className="mt-6 grid gap-4 md:grid-cols-2">
            {scene.hazards.map((h, i) => (
              <li key={h.id}>
                <HazardCard hazard={h} index={i + 1} missed={!found.includes(h.id)} onCta={cta} compact />
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}

function HazardCard({
  hazard,
  index,
  missed,
  compact,
  onCta,
}: {
  hazard: Hazard;
  index: number;
  missed?: boolean;
  compact?: boolean;
  onCta: (to: string) => void;
}) {
  return (
    <div className={cn("h-full rounded-3xl border bg-white", compact ? "p-5" : "p-6", missed ? "border-dashed border-line-strong" : "border-line")}>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold",
            missed ? "bg-cloud text-ink-soft" : "bg-yellow text-navy",
          )}
        >
          {index}
        </span>
        <h3 className="break-keep text-base font-bold leading-snug text-ink">{hazard.title}</h3>
        {missed && <span className="ml-auto shrink-0 rounded-full bg-danger-bg px-2.5 py-0.5 text-[11px] font-semibold text-danger-deep">놓침</span>}
      </div>
      <p className="mt-3 break-keep text-sm leading-relaxed text-ink-soft">{hazard.why}</p>
      <div className="mt-4 rounded-2xl bg-cloud p-4">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-700">퍼블릭아이디는 이렇게</p>
        <p className="mt-1.5 break-keep text-sm leading-relaxed text-ink">{hazard.fix}</p>
        <Link
          href={hazard.product.href}
          onClick={() => onCta(hazard.product.href)}
          className="mt-3 inline-flex items-center text-sm font-semibold text-teal-700 transition hover:text-teal"
        >
          {hazard.product.label} 보기 →
        </Link>
      </div>
    </div>
  );
}
