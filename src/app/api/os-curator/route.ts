import { KITS } from '@/lib/os-kits'
import { kitPath } from '@/lib/os-kit-pages'
import { clientIp, dailyCapExceeded, rateLimited } from '@/lib/rate-limit'

// 우리회사OS AI 큐레이터 — 방문자가 회사·고민을 한 줄로 쓰면 키트 2~3종을 추천.
// 비용 가드레일: Haiku 5.5 + max_tokens + rate limit + 시스템 프롬프트 캐싱(Haiku 5.5 는 약 3.5K 토큰 프롬프트도 캐시됨 — 실측).
// 생각(thinking)은 끈다 — 켜 두면 max_tokens 를 먹어 JSON 이 잘린다.

const MAX_CHARS = 300
const MIN_CHARS = 5

// in-memory rate limit — 인스턴스 단위 best-effort(서버리스에선 인스턴스마다 별도). 공용 = src/lib/rate-limit.ts
const RATE_MAX = 3 // IP당 분당 요청 수
const DAILY_MAX = 300 // 인스턴스당 하루 상한(과금 보호) — IP 제한·본문 검증을 통과해 실제로 Claude 를 부르는 요청만 센다

const CATALOG = KITS.map(
  (k) => `- ${k.no}${k.name} (분류: ${k.group}) — ${k.tagline}`,
).join('\n')
const NAMES = KITS.map((k) => k.name).join(', ')

const SYSTEM = `당신은 퍼블릭아이디 '우리회사OS' 시리즈의 키트 큐레이터입니다.
우리회사OS는 중소기업·1인 기업이 반복 업무를 AI에 맡기게 해주는 실행 키트입니다. 내려받아 더블클릭하면 창이 열리고, 빈칸을 채우면 결과물이 파일로 나옵니다. 개발 지식이 필요 없습니다.

## 키트 카탈로그 (이 목록에 있는 것만 추천)
${CATALOG}

## 임무
방문자가 자기 회사와 고민을 한 줄로 적어 보냅니다. 카탈로그에서 가장 도움이 될 키트 2~3개를 골라, 그 회사의 상황에 맞는 언어로 추천 이유와 사용 장면을 설명하세요.

## 규칙
- 반드시 아래 JSON 형식으로만 답합니다. JSON 밖에 다른 텍스트를 쓰지 않습니다.
- "name"은 카탈로그의 키트 이름(${NAMES})과 정확히 일치해야 합니다.
- reason: 방문자가 적은 고민을 그대로 받아 "지금 이 일이 이렇게 힘든데 → 이 키트가 이렇게 바꿔 줍니다" 순서로 2~3문장. 과장·확정 수치 약속 금지.
- scenario: 그 회사가 키트를 실제로 쓰는 하루 장면 1~2문장. 구체적으로.
- 뭘 맡길지 자체가 막막해 보이면 ①진단(0원 무료)을 포함하세요. 예산 얘기가 없고 고민이 가벼우면 미니 키트(9,900원대)부터 권해도 좋습니다.
- 입력이 회사·업무와 무관하거나(장난·욕설·다른 주제) 판단할 정보가 없으면 picks를 빈 배열로 하고 intro에 "회사가 하는 일이나 요즘 힘든 업무를 한 줄로 적어 주시면 맞는 키트를 골라 드려요"라고 정중히 안내하세요.
- 존댓말, 자연스러운 한국어. 이모지 금지.

## 출력 형식 (JSON만)
{"intro":"방문자 상황을 한 문장으로 되짚는 인사","picks":[{"name":"키트이름","reason":"...","scenario":"..."}]}`

type Pick = { name: string; reason: string; scenario: string }

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return Response.json({ error: '큐레이터가 아직 설정되지 않았어요.' }, { status: 503 })
  }

  const tooMany = () =>
    Response.json({ error: '요청이 많아요. 잠시 후 다시 시도해 주세요.' }, { status: 429 })

  if (rateLimited(`os-curator:${clientIp(request.headers)}`, RATE_MAX, 60_000)) return tooMany()

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: '잘못된 요청이에요.' }, { status: 400 })
  }

  const about = (body as { about?: unknown })?.about
  if (typeof about !== 'string' || about.trim().length < MIN_CHARS) {
    return Response.json(
      { error: '회사가 하는 일이나 힘든 업무를 한 줄로 적어 주세요.' },
      { status: 400 },
    )
  }

  // 하루 상한은 여기서만 올린다 — 종전엔 429·400 으로 막힌 요청도 세서 한 IP 가 하루치를 바닥낼 수 있었다.
  if (dailyCapExceeded('os-curator', DAILY_MAX)) return tooMany()

  let res: Response
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-5-5',
        max_tokens: 1200,
        thinking: { type: 'disabled' },
        system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: about.trim().slice(0, MAX_CHARS) }],
      }),
    })
  } catch {
    return Response.json({ error: '잠시 후 다시 시도해 주세요.' }, { status: 502 })
  }

  if (!res.ok) {
    return Response.json({ error: '추천을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.' }, { status: 502 })
  }

  let data: { content?: { type: string; text?: string }[]; stop_reason?: string }
  try {
    data = (await res.json()) as typeof data
  } catch {
    return Response.json({ error: '추천을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.' }, { status: 502 })
  }
  const raw = data.content?.find((b) => b.type === 'text')?.text?.trim()
  if (!raw) {
    return Response.json({ error: '추천이 비어 있어요. 다시 시도해 주세요.' }, { status: 502 })
  }

  // 모델이 코드펜스·서두를 붙여도 첫 '{'부터 마지막 '}'까지를 JSON으로 취급.
  const jsonStart = raw.indexOf('{')
  const jsonEnd = raw.lastIndexOf('}')
  let parsed: { intro?: unknown; picks?: unknown }
  try {
    if (jsonStart < 0 || jsonEnd <= jsonStart) throw new Error('no json')
    parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1))
  } catch {
    console.error('[os-curator] JSON 파싱 실패:', `stop_reason=${data.stop_reason}`, raw.slice(0, 300))
    return Response.json({ error: '추천을 정리하지 못했어요. 다시 시도해 주세요.' }, { status: 502 })
  }

  const intro = typeof parsed.intro === 'string' ? parsed.intro : ''
  const picks: (Pick & { no: string; tagline: string; price: number; url: string; path: string })[] = []
  if (Array.isArray(parsed.picks)) {
    for (const p of parsed.picks as Pick[]) {
      const kit = KITS.find((k) => k.name === p?.name)
      if (!kit || typeof p.reason !== 'string' || typeof p.scenario !== 'string') continue
      picks.push({
        name: kit.name,
        no: kit.no,
        tagline: kit.tagline,
        price: kit.price,
        url: kit.url,
        path: kitPath(kit), // 상품별 페이지(/os/<slug>) — '자세히 보기'는 내부, 래피드는 '구매'만
        reason: p.reason,
        scenario: p.scenario,
      })
      if (picks.length >= 3) break
    }
  }

  return Response.json({ intro, picks })
}
