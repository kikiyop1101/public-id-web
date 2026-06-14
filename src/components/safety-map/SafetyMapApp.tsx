"use client";
import { useEffect, useMemo, useState } from "react";
import KakaoMap from "./KakaoMap";
import { geocodeAddresses } from "@/lib/geocode";
import {
  type Facility,
  type Status,
  statusOf,
  daysLeftOf,
  endDateOf,
  fmtDate,
  ddayLabel,
  typeIcon,
  STATUS_META,
} from "@/lib/facilities";

type StatusFilter = "all" | Status;

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

export default function SafetyMapApp() {
  const [now, setNow] = useState<Date | null>(null);
  const [raw, setRaw] = useState<Facility[] | null>(null);
  const [coords, setCoords] = useState<Record<string, { lat: number; lng: number }>>({});
  const [loadError, setLoadError] = useState(false);

  const [audience, setAudience] = useState<"public" | "client">("public");
  const [typeF, setTypeF] = useState("all");
  const [clientF, setClientF] = useState("all");
  const [statusF, setStatusF] = useState<StatusFilter>("all");
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => setNow(new Date()), []);

  useEffect(() => {
    fetch("/api/facilities")
      .then((r) => r.json())
      .then((d) => setRaw(Array.isArray(d.facilities) ? d.facilities : []))
      .catch(() => {
        setRaw([]);
        setLoadError(true);
      });
  }, []);

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
    const c = { total: base.length, active: 0, expiring: 0, expired: 0 };
    if (now) for (const f of base) c[statusOf(f, now)]++;
    return c;
  }, [base, now]);

  const filtered = useMemo(() => {
    if (!now) return [] as Facility[];
    return base
      .filter((f) => statusF === "all" || statusOf(f, now) === statusF)
      .map((f) => ({ f, d: daysLeftOf(f, now) }))
      .sort((a, b) => a.d - b.d)
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

  const kpis: { key: StatusFilter; label: string; value: number; color?: string }[] = [
    { key: "all", label: "총 시설물", value: counts.total },
    { key: "active", label: "운영중", value: counts.active, color: STATUS_META.active.text },
    { key: "expiring", label: "만료 임박 · D-30", value: counts.expiring, color: STATUS_META.expiring.text },
    { key: "expired", label: "관리 종료", value: counts.expired, color: STATUS_META.expired.text },
  ];

  const toggleStatus = (k: StatusFilter) =>
    setStatusF((prev) => (k === "all" ? "all" : prev === k ? "all" : k));

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          퍼블릭아이디가 설치·관리하는 전국 안전시설 현황입니다.
        </p>
        <div className="inline-flex overflow-hidden rounded-full border border-line text-sm">
          <button
            type="button"
            onClick={() => setAudience("public")}
            className={`px-4 py-1.5 transition ${audience === "public" ? "bg-navy text-white" : "text-ink-soft hover:text-ink"}`}
          >
            공개 실적 보기
          </button>
          <button
            type="button"
            onClick={() => setAudience("client")}
            className={`border-l border-line px-4 py-1.5 transition ${audience === "client" ? "bg-navy text-white" : "text-ink-soft hover:text-ink"}`}
          >
            발주처 전용 보기
          </button>
        </div>
      </div>

      {audience === "client" && (
        <div className="mb-4 rounded-xl border border-line bg-cloud px-4 py-3 text-sm text-ink-soft">
          발주처 전용 보기는 <b className="font-semibold text-ink">2단계</b>에서
          제공됩니다 — 각 발주처에 자기 시설만 보이는 전용 링크가 발급됩니다.
        </div>
      )}

      {loadError && (
        <div className="mb-4 rounded-xl border border-line bg-cloud px-4 py-3 text-sm text-ink-soft">
          시설 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {kpis.map((k) => {
          const active = statusF === k.key && k.key !== "all";
          return (
            <button
              key={k.key}
              type="button"
              onClick={() => toggleStatus(k.key)}
              className={`rounded-xl border bg-cloud px-4 py-3 text-left transition hover:border-teal/40 ${active ? "border-teal" : "border-transparent"}`}
            >
              <div className="text-[13px] text-ink-soft">{k.label}</div>
              <div
                className="mt-0.5 text-2xl font-bold"
                style={{ color: k.color ?? "var(--color-ink)" }}
              >
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
        <select
          value={statusF}
          onChange={(e) => setStatusF(e.target.value as StatusFilter)}
          className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-teal"
        >
          <option value="all">전체 상태</option>
          <option value="active">운영중</option>
          <option value="expiring">만료 임박</option>
          <option value="expired">관리 종료</option>
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
                  ? "시트에 등록된 시설이 없습니다."
                  : "조건에 맞는 시설이 없습니다."}
              </div>
            )}
            {filtered.map((f) => {
              const st = statusOf(f, now);
              const Icon = typeIcon(f.type);
              const isSel = f.id === selectedId;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedId(f.id)}
                  className={`flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left transition hover:bg-cloud ${isSel ? "bg-cloud" : ""}`}
                >
                  <Icon
                    className="h-5 w-5 shrink-0"
                    style={{ color: STATUS_META[st].color }}
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
                    style={{ color: STATUS_META[st].color }}
                  >
                    {ddayLabel(daysLeftOf(f, now))}
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
        색은 상태(운영중·임박·만료), 아이콘은 시설 종류를 나타냅니다.
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
  const d = daysLeftOf(f, now);
  const Icon = typeIcon(f.type);
  const install = new Date(`${f.installDate}T00:00:00`).getTime();
  const end = endDateOf(f).getTime();
  const pct = Math.max(
    0,
    Math.min(100, Math.round(((now.getTime() - install) / (end - install)) * 100)),
  );
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
              style={{ color: STATUS_META[st].color }}
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
            <Row label="설치일" value={f.installDate} />
            <Row
              label="관리종료일"
              value={`${fmtDate(endDateOf(f))}${f.endDate ? "" : " (자동)"}`}
              valueColor={STATUS_META[st].color}
            />
          </dl>

          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-ink-soft">
              <span>관리기간</span>
              <span style={{ color: STATUS_META[st].color }}>{ddayLabel(d)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-cloud">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: STATUS_META[st].color }}
              />
            </div>
            {f.note && <p className="mt-3 text-sm text-ink-soft">{f.note}</p>}
          </div>
        </div>
      </div>
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
