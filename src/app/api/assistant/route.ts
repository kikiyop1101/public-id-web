import { ASSISTANT_SYSTEM } from "@/lib/assistant-knowledge";
import { clientIp, dailyCapExceeded, rateLimited } from "@/lib/rate-limit";

// 고객용 AI 도우미 — Claude Haiku 5.5 호출(서버). 키는 ANTHROPIC_API_KEY(서버 env).
// 비용 가드레일: Haiku + 시스템 프롬프트 캐싱 + max_tokens 상한 + 대화 길이 제한.

type Msg = { role: "user" | "assistant"; content: string };

const MAX_TURNS = 12; // 한 대화에 허용하는 메시지 수
const MAX_CHARS = 1500; // 메시지당 글자 상한

// 간단 in-memory rate limit — 인스턴스 단위 best-effort(서버리스에선 인스턴스마다 별도). 공용 = src/lib/rate-limit.ts
// 더 강한 제한이 필요하면 Vercel KV / Upstash Redis 등 공유 스토어로 교체.
const RATE_MAX = 15; // IP당 분당 요청 수
const DAILY_MAX = 500; // 인스턴스당 하루 상한(과금 보호) — IP 제한·본문 검증을 통과해 실제로 Claude 를 부르는 요청만 센다

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "도우미가 아직 설정되지 않았어요." }, { status: 503 });
  }

  const tooMany = () =>
    Response.json(
      { error: "요청이 많아요. 잠시 후 다시 시도하시거나 070-4150-1172 로 연락 주세요." },
      { status: 429 },
    );

  if (rateLimited(`assistant:${clientIp(request.headers)}`, RATE_MAX, 60_000)) return tooMany();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "잘못된 요청이에요." }, { status: 400 });
  }

  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_TURNS) {
    return Response.json({ error: "대화가 너무 길어요. 새로 시작하거나 문의로 연결해 드릴게요." }, { status: 400 });
  }

  const messages: Msg[] = [];
  for (const m of raw) {
    const role = (m as Msg)?.role;
    const content = (m as Msg)?.content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
      return Response.json({ error: "잘못된 메시지 형식이에요." }, { status: 400 });
    }
    messages.push({ role, content: content.slice(0, MAX_CHARS) });
  }
  if (messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "잘못된 요청이에요." }, { status: 400 });
  }

  // IP 를 바꿔 가며 부르는 것까지 막는 하루 총량 상한(os-curator 와 같은 구조).
  if (dailyCapExceeded("assistant", DAILY_MAX)) return tooMany();

  let res: Response;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-5-5",
        max_tokens: 900, // Haiku 5.5 는 생각(thinking)이 max_tokens 를 먹는다 — 낮추면 답이 중간에 잘린다
        output_config: { effort: "low" },
        system: [
          { type: "text", text: ASSISTANT_SYSTEM, cache_control: { type: "ephemeral" } },
        ],
        messages,
      }),
    });
  } catch {
    return Response.json({ error: "잠시 후 다시 시도해 주세요." }, { status: 502 });
  }

  if (!res.ok) {
    return Response.json(
      { error: "답변을 가져오지 못했어요. 070-4150-1172 로 문의해 주세요." },
      { status: 502 },
    );
  }

  let data: { content?: { type: string; text?: string }[] };
  try {
    data = (await res.json()) as typeof data;
  } catch {
    return Response.json(
      { error: "답변을 가져오지 못했어요. 070-4150-1172 로 문의해 주세요." },
      { status: 502 },
    );
  }
  const reply = data.content?.find((b) => b.type === "text")?.text?.trim();
  if (!reply) {
    return Response.json({ error: "답변이 비어 있어요. 문의로 도와드릴게요." }, { status: 502 });
  }

  return Response.json({ reply });
}
