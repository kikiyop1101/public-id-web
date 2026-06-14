"use client";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import KakaoMap from "./KakaoMap";
import { geocodeAddresses } from "@/lib/geocode";
import {
  type Facility,
  type Status,
  statusOf,
  daysLeftOf,
  plannedDaysOf,
  maintenanceEnd,
  fmtDate,
  ddayLabel,
  typeIcon,
  STATUS_META,
  BRAND_DARK,
} from "@/lib/facilities";

type StatusFilter = "all" | Status;

const RANK: Record<Status, number> = {
  managed: 0,
  planned: 1,
  installed: 2,
  ended: 3,
  demolished: 4,
};

function StatusPill({ status }: { status: Status }) {
  const m = STATUS_META[status];
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-medium"
      style={{ background: m.bg, color: m.text }}
    >
      {m.label}
    </span>
  );
}

function ddayDisplay(f: Facility, now: Date): { text: string; color: string } {
  const st = statusOf(f, now);
  if (st === "planned") {
    const pd = plannedDaysOf(f, now);
    return {
      text: pd == null ? "예정" : pd >= 0 ? `D-${pd}` : "지남",
      color: STATUS_META.planned.text,
    };
  }
  if (st === "managed")
    return { text: ddayLabel(daysLeftOf(f, now)), color: STATUS_META.managed.text };
  if (st === "installed") return { text: "완료", color: STATUS_META.installed.text };
  if (st === "ended") return { text: "종료", color: STATUS_META.ended.text };
  return { text: "철거", color: STATUS_META.demolished.text };
}

export default function SafetyMapApp({ token }: { token?: string }) {
  const [now, setNow] = useState<Date | null>(null);
  const [raw, setRaw] = useState<Facility[] | null>(null);
  const [scopedClient, setScopedClient] = useState<string | null>(null);
  const [coords, setCoords] = useState<Record<string, { lat: number; lng: number }>>({});
  const [loadError, setLoadError] = useState(false);

  const [typeF, setTypeF] = useState("all");
  const [clientF, setClientF] = useState("all");
  const [statusF, setStatusF] = useState<StatusFilter>("all");
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => setNow(new Date()), []);

  useEffect(() => {
    const url = token
      ? `/api/facilities?token=${encodeURIComponent(token)}`
      : "/api/facilities";
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setRaw(Array.isArray(d.facilities) ? d.facilities : []);
        if (token) setScopedClient(d.client ?? null);
      })
      .catch(() => {
        setRaw([]);
        setLoadError(true);
      });
  }, [token]);

  useEffect(() => {
    if (!raw || raw.length === 0) return;
    let cancelled = false;
    geocodeAddresses(raw.map((f) => f.address))
      .then((c) => {
        if (!cancelled) setCoords(c);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [raw]);

  const facilities: Facility[] = useMemo(
    () =>
      (raw ?? []).map((f) => {
        const c = coords[f.address.trim()];
        return c ? { ...f, lat: c.lat, lng: c.lng } : f;
      }),
    [raw, coords],
  );

  const types = useMemo(
    () => Array.from(new Set(facilities.map((f) => f.type).filter(Boolean))),
    [facilities],
  );
  const clients = useMemo(
    () => Array.from(new Set(facilities.map((f) => f.client).filter(Boolean))).sort(),
    [facilities],
  );

  const base = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return facilities.filter(
      (f) =>
        (typeF === "all" || f.type === typeF) &&
        (clientF === "all" || f.client === clientF) &&
        (!needle ||
          `${f.name}${f.address}${f.client}`.toLowerCase().includes(needle)),
    );
  }, [facilities, typeF, clientF, q]);

  const counts = useMemo(() => {
    const c = { total: base.length, planned: 0, installed: 0, managed: 0, ended: 0, demolished: 0 };
    if (now) for (const f of base) c[statusOf(f, now)]++;
    return c;
  }, [base, now]);

  const filtered = useMemo(() => {
    if (!now) return [] as Facility[];
    return base
      .filter((f) => statusF === "all" || statusOf(f, now) === statusF)
      .map((f) => {
        const st = statusOf(f, now);
        const sub =
          st === "managed"
            ? daysLeftOf(f, now)
            : st === "planned"
              ? (plannedDaysOf(f, now) ?? 0)
              : 0;
        return { f, key: RANK[st] * 1_000_000 + sub };
      })
      .sort((a, b) => a.key - b.key)
      .map((x) => x.f);
  }, [base, statusF, now]);

  const unmapped = useMemo(
    () => filtered.filter((f) => f.lat == null || f.lng == null).length,
    [filtered],
  );

  const selected = useMemo(
    () => facilities.find((f) => f.id === selectedId) ?? null,
    [facilities, selectedId],
  );

  if (!now || raw === null)
    return (
      <div className="h-[520px] animate-pulse rounded-2xl border border-line bg-cloud" />
    );

  if (token && scopedClient === null)
    return (
      <div className="rounded-2xl border border-line bg-cloud p-10 text-center">
        <p className="font-semibold text-ink">유효하지 않은 링크입니다</p>
        <p className="mt-2 text-sm text-ink-soft">
          링크를 다시 확인해 주세요.{" "}
          <a href="/contact" className="text-teal-700 underline">
            문의하기
          </a>
        </p>
      </div>
    );

  const kpis: { key: StatusFilter; label: string; value: number; color: string }[] = [
    { key: "all", label: "총 시설물", value: counts.total, color: BRAND_DARK },
    { key: "planned", label: "설치 예정", value: counts.planned, color: STATUS_META.planned.text },
    { key: "installed", label: "설치 완료", value: counts.installed, color: STATUS_META.installed.text },
    { key: "managed", label: "관리중", value: counts.managed, color: "#08A0B8" },
    { key: "ended", label: "관리 종료", value: counts.ended, color: STATUS_META.ended.text },
    { key: "demolished", label: "철거 완료", value: counts.demolished, color: STATUS_META.demolished.text },
  ];

  const toggleStatus = (k: StatusFilter) =>
    setStatusF((prev) => (k === "all" ? "all" : prev === k ? "all" : k));

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <div className="mb-4">
        {token ? (
          <p className="text-sm text-ink-soft">
            <b className="font-semibold text-ink">{scopedClient}</b> 전용 안전시설
            현황입니다. 이 링크는 귀 기관 전용으로 발급되었습니다.
          </p>
        ) : (
          <p className="text-sm text-ink-soft">
            퍼블릭아이디가 설치·관리하는 전국 안전시설 현황입니다.
          </p>
        )}
      </div>

      {loadError && (
        <div className="mb-4 rounded-xl border border-line bg-cloud px-4 py-3 text-sm text-ink-soft">
          시설 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((k) => {
          const isActive = statusF === k.key && k.key !== "all";
          return (
            <button
              key={k.key}
              type="button"
              onClick={() => toggleStatus(k.key)}
              className={`rounded-xl border bg-cloud px-4 py-3 text-left transition hover:border-teal/40 ${isActive ? "border-teal" : "border-transparent"}`}
            >
              <div className="text-[13px] text-ink-soft">{k.label}</div>
              <div className="mt-0.5 text-2xl font-bold" style={{ color: k.color }}>
                {k.value}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <select
          value={typeF}
          onChange={(e) => setTypeF(e.target.value)}
          className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-teal"
        >
          <option value="all">전체 종류</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {!token && (
          <select
            value={clientF}
            onChange={(e) => setClientF(e.target.value)}
            className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-teal"
          >
            <option value="all">전체 발주처</option>
            {clients.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
        <select
          value={statusF}
          onChange={(e) => setStatusF(e.target.value as StatusFilter)}
          className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-teal"
        >
          <option value="all">전체 상태</option>
          <option value="planned">설치 예정</option>
          <option value="installed">설치 완료</option>
          <option value="managed">관리중</option>
          <option value="ended">관리 종료</option>
          <option value="demolished">철거 완료</option>
        </select>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="명칭·주소·발주처 검색"
          className="min-w-[160px] flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-teal"
        />
      </div>

      <div className="mt-4 flex flex-col gap-4 lg:grid lg:grid-cols-[360px_1fr]">
        <div className="order-2 flex max-h-[520px] flex-col overflow-hidden rounded-2xl border border-line lg:order-1">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5 text-xs text-ink-soft">
            <span>시설 목록 {filtered.length}</span>
            {unmapped > 0 && <span>지도 미표시 {unmapped}</span>}
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-ink-soft">
                {facilities.length === 0
                  ? "등록된 시설이 없습니다."
                  : "조건에 맞는 시설이 없습니다."}
              </div>
            )}
            {filtered.map((f) => {
              const st = statusOf(f, now);
              const Icon = typeIcon(f.type);
              const isSel = f.id === selectedId;
              const dd = ddayDisplay(f, now);
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedId(f.id)}
                  className={`flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left transition hover:bg-cloud ${isSel ? "bg-cloud" : ""}`}
                >
                  <Icon
                    className="h-5 w-5 shrink-0"
                    style={{ color: STATUS_META[st].text }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-ink">
                      {f.type} · {f.name}
                    </span>
                    <span className="block truncate text-xs text-ink-soft">
                      {f.client}
                    </span>
                  </span>
                  <StatusPill status={st} />
                  <span
                    className="w-10 shrink-0 text-right text-xs font-medium"
                    style={{ color: dd.color }}
                  >
                    {dd.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="order-1 h-[360px] lg:order-2 lg:h-[520px]">
          <KakaoMap
            facilities={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
            now={now}
          />
        </div>
      </div>

      {selected && (
        <SelectedDetail
          f={selected}
          now={now}
          onClose={() => setSelectedId(null)}
        />
      )}

      <p className="mt-4 text-xs text-ink-soft">
        ※ 데이터는 구글 시트에서 자동으로 불러옵니다(수정 후 최대 1분 내 반영). 마커
        색은 상태(설치 예정·설치 완료·관리중·관리 종료·철거 완료), 아이콘은 시설
        종류를 나타냅니다.
      </p>
    </div>
  );
}

function SelectedDetail({
  f,
  now,
  onClose,
}: {
  f: Facility;
  now: Date;
  onClose: () => void;
}) {
  const st = statusOf(f, now);
  const Icon = typeIcon(f.type);
  const me = maintenanceEnd(f);

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
      <div className="grid gap-0 md:grid-cols-[260px_1fr]">
        {f.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={f.photo}
            alt={`${f.name} 현장 사진`}
            className="h-44 w-full object-cover md:h-full"
          />
        )}
        <div className="p-5">
          <div className="flex items-start gap-3">
            <Icon
              className="mt-0.5 h-6 w-6 shrink-0"
              style={{ color: STATUS_META[st].text }}
            />
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-ink">{f.name}</div>
              <div className="text-sm text-ink-soft">
                {f.type} · {f.client}
              </div>
            </div>
            <StatusPill status={st} />
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="text-ink-soft transition hover:text-ink"
            >
              ✕
            </button>
          </div>

          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            <Row label="주소" value={f.address} />
            {f.quantity && <Row label="수량" value={f.quantity} />}

            {st === "planned" && (
              <Row
                label="설치 예정일"
                value={f.plannedDate || "미정"}
                valueColor={STATUS_META.planned.text}
              />
            )}
            {st !== "planned" && <Row label="설치일" value={f.installDate} />}
            {(st === "managed" || st === "ended") && f.maintenancePeriod && (
              <Row label="유지보수기간" value={f.maintenancePeriod} />
            )}
            {(st === "managed" || st === "ended") && me && (
              <Row
                label="관리 종료일"
                value={fmtDate(me)}
                valueColor={STATUS_META[st].text}
              />
            )}
            {st === "demolished" && (
              <Row
                label="철거 완료일"
                value={f.demolishedDate || "—"}
                valueColor={STATUS_META.demolished.text}
              />
            )}
          </dl>

          {(st === "managed" || st === "ended") && me ? (
            <PeriodBar f={f} now={now} st={st} />
          ) : st === "planned" ? (
            <Note color={STATUS_META.planned.text}>
              아직 설치 전입니다
              {f.plannedDate ? ` — 설치 예정일 ${f.plannedDate}` : ""}.
            </Note>
          ) : st === "installed" ? (
            <Note color={STATUS_META.installed.text}>
              설치 완료된 시설입니다 (유지보수 계약 미설정).
            </Note>
          ) : st === "demolished" ? (
            <Note color={STATUS_META.demolished.text}>철거 완료된 시설입니다.</Note>
          ) : null}

          {f.note && <p className="mt-3 text-sm text-ink-soft">{f.note}</p>}
        </div>
      </div>
    </div>
  );
}

function PeriodBar({ f, now, st }: { f: Facility; now: Date; st: Status }) {
  const me = maintenanceEnd(f);
  if (!me || !f.installDate) return null;
  const install = new Date(`${f.installDate}T00:00:00`).getTime();
  const end = me.getTime();
  const pct = Math.max(
    0,
    Math.min(100, Math.round(((now.getTime() - install) / (end - install)) * 100)),
  );
  return (
    <div className="mt-4">
      <div className="mb-1 flex justify-between text-xs text-ink-soft">
        <span>유지보수 기간</span>
        <span style={{ color: STATUS_META[st].text }}>
          {ddayLabel(daysLeftOf(f, now))}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-cloud">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: STATUS_META[st].pin }}
        />
      </div>
    </div>
  );
}

function Note({ color, children }: { color: string; children: ReactNode }) {
  return (
    <div
      className="mt-4 rounded-xl bg-cloud px-4 py-3 text-sm"
      style={{ color }}
    >
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-1.5">
      <dt className="shrink-0 text-ink-soft">{label}</dt>
      <dd
        className="text-right text-ink"
        style={valueColor ? { color: valueColor, fontWeight: 500 } : undefined}
      >
        {value}
      </dd>
    </div>
  );
}
