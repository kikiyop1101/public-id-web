<!-- 사본: 정본은 볼트 Agent/PI정본/_design-system/design.md. 클라우드 세션용(2026-09-27). 정본이 바뀌면 이 파일을 다시 복사한다. -->

---
version: 1.1.0
name: PublicID Design Language
description: 퍼블릭아이디 시각 언어 정본 — public-id.co.kr 실측 기반. 조용한 무채색 캔버스 위에 청록 하나만 구조색으로 쓰고, 라임→청록 아치 그라디언트가 로고의 다리 모티프를 반복하며, 라임·노랑은 제품 표시용으로만 극소량 등장한다. PI-DS 토큰(색·컴포넌트 규격)이 "무엇"이라면 이 문서는 "어떻게 조합하는가"다.
source: 시스템-외부보관\1-웹앱\public-id-web\src (globals.css · components · app) 코드 실측 2026-07-26 · impeccable v4.0.4 선별 병합 2026-08-02(§5 모션 스케일·§8 금지 보강·부록 C, 근거=design-md-업그레이드제안-임페커블-갭분석.md) · 벤치마크 비교감사 반영 2026-08-13(§2 무채 램프·강조 간격, §3 히어로 64px·행간 타이트닝 — 근거=벤치마크-비교감사-2026-08-13.html)
supersedes: 없음 — tokens/·components/를 대체하지 않고 그 위에 얹는다

colors:
  primary: "#069CBB"
  primary-strong: "#0b6c7d"
  primary-600: "#0a8296"
  primary-soft: "#dff3f6"
  accent-lime: "#CADA1F"
  accent-yellow: "#FFD200"
  navy: "#16303D"
  navy-800: "#122631"
  ink: "#0F172A"
  ink-soft: "#57636b"
  canvas: "#ffffff"
  canvas-soft: "#f5f8f8"
  hairline: "#e4eaeb"
  on-primary: "#ffffff"
  arch: "linear-gradient(95deg, #CADA1F 0%, #7cc63f 42%, #069CBB 100%)"

typography:
  display-1:
    fontFamily: Pretendard
    fontSize: 64px
    fontSizeMobile: 36px
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: -0.025em
  heading-1:
    fontFamily: Pretendard
    fontSize: 36px
    fontSizeMobile: 30px
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: -0.025em
  heading-2:
    fontFamily: Pretendard
    fontSize: 28px
    fontSizeMobile: 24px
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: -0.025em
  heading-3:
    fontFamily: Pretendard
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: -0.011em
  title:
    fontFamily: Pretendard
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: -0.011em
  lead:
    fontFamily: Pretendard
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: -0.011em
  body-md:
    fontFamily: Pretendard
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: -0.011em
  body-sm:
    fontFamily: Pretendard
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: -0.011em
  caption:
    fontFamily: Pretendard
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: -0.011em
  eyebrow:
    fontFamily: Poppins
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: 0.18em
    textTransform: uppercase
  eyebrow-sm:
    fontFamily: Poppins
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: 0.16em
    textTransform: uppercase
  button:
    fontFamily: Pretendard
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: -0.011em
  num:
    fontFamily: Plus Jakarta Sans
    fontWeight: 700
    letterSpacing: 0

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 40px
  3xl: 48px
  4xl: 64px
  5xl: 80px
  6xl: 112px

rounded:
  md: 6px
  lg: 8px
  xl: 12px
  2xl: 16px
  3xl: 24px
  full: 9999px

elevation:
  flat: "none"
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
  lg: "0 10px 15px -3px rgb(6 156 187 / 0.20)"
  glow: "bg {colors.arch} · opacity 0.10 · blur 90px · size 360px · rounded-full"

breakpoints:
  sm: 640px
  lg: 1024px
  md: 768px

motion:
  base: "300ms"
  reveal: "700ms cubic-bezier(0.16, 1, 0.3, 1)"
  reveal-offset: "translateY(26px)"
  lift: "translateY(-2px)"

components:
  nav-bar:
    height: 64px
    backgroundColor: "{colors.canvas}"
    topRule: "4px {colors.arch}"
    logoHeight: "28px / 30px({breakpoints.sm})"
    linkTypography: "{typography.body-md} · fontWeight 500 · {colors.ink-soft}"
    linkGap: "{spacing.xl} + 4px"
    container: "max-width 1200px · padding-x {spacing.lg}-4px / {spacing.xl}({breakpoints.sm})"
  button-arch:
    background: "{colors.arch}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    height: "40px / 48px / 56px"
    paddingX: "{spacing.lg}-4px / {spacing.lg} / {spacing.xl}-4px"
    shadow: "{elevation.lg}"
    hover: "{motion.lift} + brightness(1.05)"
  button-navy:
    background: "{colors.navy}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    hover: "background {colors.primary} + {motion.lift}"
  button-teal:
    background: "{colors.primary-strong}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    hover: "background {colors.primary} + {motion.lift}"
  button-outline:
    background: "{colors.canvas}"
    border: "1px {colors.hairline}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    hover: "border {colors.primary} · text {colors.primary-strong}"
  button-light:
    background: "{colors.canvas}"
    textColor: "{colors.navy}"
    rounded: "{rounded.full}"
    hover: "background {colors.canvas-soft}"
  card:
    background: "{colors.canvas}"
    border: "1px {colors.hairline}"
    rounded: "{rounded.2xl}"
    padding: "{spacing.lg}"
    shadow: "{elevation.sm}"
  card-lg:
    background: "{colors.canvas}"
    border: "1px {colors.hairline}"
    rounded: "{rounded.3xl}"
    padding: "{spacing.xl}-4px / {spacing.xl}+4px({breakpoints.sm})"
    shadow: "{elevation.sm}"
  card-soft:
    background: "{colors.canvas-soft} @ 50%"
    border: "1px {colors.hairline}"
    rounded: "{rounded.3xl}"
    padding: "{spacing.xl} / {spacing.2xl}({breakpoints.sm})"
  text-input:
    background: "{colors.canvas}"
    border: "1px {colors.hairline}"
    rounded: "{rounded.xl}"
    padding: "{spacing.sm} {spacing.md}"
    typography: "{typography.body-md}"
    focus: "border {colors.primary} + ring 2px {colors.primary}@20%"
  eyebrow-label:
    typography: "{typography.eyebrow}"
    color: "{colors.primary-strong}"
    marginBottom: "{spacing.md}"
  badge-arch:
    background: "{colors.arch}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption} · fontWeight 600"
    rounded: "{rounded.full}"
    padding: "{spacing.xxs} {spacing.sm}"
  section-shell:
    paddingY: "{spacing.5xl} / {spacing.6xl}({breakpoints.sm})"
    background: "{colors.canvas} 또는 {colors.canvas-soft} 교대"
  section-band-dark:
    background: "{colors.navy}"
    textColor: "{colors.on-primary}"
    paddingY: "{spacing.5xl} / {spacing.6xl}({breakpoints.sm})"
  footer:
    background: "{colors.navy}"
    textColor: "{colors.on-primary} @ 70%"
    paddingY: "{spacing.4xl}"
    columnGap: "{spacing.2xl}"
    headingTypography: "{typography.eyebrow-sm} · {colors.primary}"
  focus-ring:
    outline: "2px solid {colors.primary-strong}"
    offset: "2px"
    rounded: "3px"
---

## 1️⃣ Overview

퍼블릭아이디의 화면은 **밝은 사무실 책상**처럼 보인다. 바탕은 순백 `{colors.canvas}`이거나 아주 옅은 청회색 `{colors.canvas-soft}`이고, 텍스트는 잉크색 `{colors.ink}`와 그보다 흐린 `{colors.ink-soft}` 두 단계로만 간다. 면과 면은 그림자가 아니라 1px 헤어라인 `{colors.hairline}`으로 나뉜다. 여기까지가 화면의 90%다 — 조용하고, 정보가 앞에 나온다.

그 조용한 바탕 위에서 **색은 딱 하나만 구조를 칠한다**: 청록 `{colors.primary-strong}`. eyebrow 라벨, 링크, 포커스, 강조 텍스트가 전부 이 색이다. 라임 `{colors.accent-lime}`과 노랑 `{colors.accent-yellow}`은 구조를 칠하지 않는다 — 제품(노란발자국·노란볼라드)을 가리킬 때만 등장한다.

브랜드의 성격은 **아치 그라디언트** `{colors.arch}`가 혼자 짊어진다. 라임에서 청록으로 95도 기울어 흐르는 이 띠는 로고의 다리(bridge) 모티프이며, 헤더 최상단 4px 라인 · 주 CTA 버튼 · 배지 · 배경 글로우로만 나타난다. 실측 26곳. 이것이 "퍼블릭아이디처럼 보이게" 만드는 단 하나의 장치다.

**핵심 특징**
- 무채색 캔버스 위 **구조색 1개**(`{colors.primary-strong}`) — 실측 사용비 무채색 337 : 청록 46 : 라임·노랑 16 = **80 : 15 : 2**
- 면 분리는 **1px 헤어라인**(`{colors.hairline}` 77회) — 그림자는 `{elevation.sm}`이 15회로 지배적, 진한 그림자 없음
- **완전 둥근 CTA**(`{rounded.full}` 47회) vs **16px 카드**(`{rounded.2xl}` 31회) 의 대비
- 제목은 **800 웨이트 + 음수 자간**(`{typography.heading-1}`), 본문은 400 — 위계를 굵기로만 만든다
- eyebrow는 **대문자 + `{typography.eyebrow}` 0.18em 자간**의 청록 라벨 — 전 페이지 반복되는 내비게이션 신호
- 섹션 리듬은 `{spacing.5xl}` → `{spacing.6xl}` 단 하나 (실측 34회 중 34회)
- 네이비 `{colors.navy}`는 **반전 밴드**(푸터·강조 섹션)로만 — 본문 배경 아님

## 2️⃣ Colors

> 법적·사실 정본은 `..\BRAND_CONSTANTS.md`. 토큰 값은 그것을 파생하며 `tokens/primitive.json`·홈페이지 `globals.css`와 3자 일치 확인됨(2026-07-26 실측).

### 브랜드
| 토큰 | 값 | 용도 |
|---|---|---|
| `{colors.primary}` | `#069CBB` | 브랜드 청록 원본. 호버 배경·아이콘·굵은 면. 텍스트로는 잘 쓰지 않음(대비 부족) |
| `{colors.primary-strong}` | `#0b6c7d` | **구조색 정본.** eyebrow 라벨·링크·강조 텍스트·포커스 링·**보조 CTA(`button-teal`)**. 실측 46회로 액센트 중 최다 |
| `{colors.primary-600}` | `#0a8296` | 중간 단계. 그라디언트 보간·호버 |
| `{colors.primary-soft}` | `#dff3f6` | 청록 배경 칩·하이라이트 면 |
| `{colors.accent-lime}` | `#CADA1F` | **아치 그라디언트 시작점 전용.** 단독 면·텍스트로 쓰지 않음 |
| `{colors.accent-yellow}` | `#FFD200` | **제품색.** 노란발자국·노란볼라드를 가리킬 때만. 실측 6회 |
| `{colors.navy}` | `#16303D` | 반전 밴드(푸터·강조 섹션)·secondary 버튼 |
| `{colors.navy-800}` | `#122631` | 네이비 면 위 한 단계 더 어두운 층 |
| `{colors.arch}` | `linear-gradient(95deg, #CADA1F 0%, #7cc63f 42%, #069CBB 100%)` | **시그니처.** 헤더 상단 4px 라인·주 CTA·배지·배경 글로우 |

### 표면
| 토큰 | 값 | 용도 |
|---|---|---|
| `{colors.canvas}` | `#ffffff` | 기본 바탕·카드 면. 실측 `bg-white` 47회 |
| `{colors.canvas-soft}` | `#f5f8f8` | 교대 섹션 바탕·부드러운 카드. 실측 `bg-cloud` 37회. 흰 섹션과 번갈아 리듬을 만듦 |
| `{colors.navy}` | `#16303D` | 반전 밴드. 실측 `bg-navy` 9회 — 한 페이지에 1~2회만 |

### 텍스트
| 토큰 | 값 | 용도 |
|---|---|---|
| `{colors.ink}` | `#0F172A` | 제목·본문 기본. 실측 92회(최다) |
| `{colors.ink-soft}` | `#57636b` | 설명문·캡션·비활성 내비 링크. 실측 84회 |
| `{colors.primary-strong}` | `#0b6c7d` | eyebrow·링크·강조어 |
| `{colors.on-primary}` | `#ffffff` | 네이비·아치 면 위 텍스트. 푸터는 `#ffffff @ 70%` |

### 보더
| 토큰 | 값 | 용도 |
|---|---|---|
| `{colors.hairline}` | `#e4eaeb` | **유일한 기본 보더.** 카드·인풋·구분선·섹션 경계. 실측 77회 |
| `{colors.primary}` | `#069CBB` | 호버·포커스 시 보더 전환. 실측 16회 |
| `{colors.on-primary}` @ 15% | `rgba(255,255,255,0.15)` | 네이비 면 위 칩 보더 |

### 상태색 (2026-08-11 노출 — 토큰엔 진작 있었다)

| 역할 | 본색 | 진한 | 배경 | 보더 |
|---|---|---|---|---|
| 성공 | `#2E9E5B` | `#1E7A46` | `#E8F6EE` | `#B7E2C8` |
| 주의 | `#E2842F` | `#C2641B` | `#FCF4EC` | `#F4D7BC` |
| 위험 | `#C9403C` | `#B5322E` | `#FBEEEE` | `#F0CBCA` |
| 정보 | `{colors.primary}` | `{colors.primary-strong}` | `#E6F6F9` | `#B9E6ED` |

**규율은 매체에 따라 다르다**(대표 확정 2026-08-11). 부록 C-1 모드 4분법과 같은 갈래다.

| 매체 | 모드 | 상태색 사용 |
|---|---|---|
| 웹 UI·대시보드·관제탑·GUI·앱 | Operate | **의미 전용.** 장식 금지, 한 화면에 한 종류 |
| 카드뉴스·SNS·쓰레드 카드·상세페이지·배너·영상 | Persuade | **표현 색으로 자유롭게** — 주황·적색을 강조·포인트로 써도 된다 |
| 제안서·회사소개서 | Persuade | 표현 허용하되 절제(문서는 오래 본다) |

- **UI에서**: 상태색은 화면이 사용자에게 *상태를 알릴 때만* 등장한다. 성공과 경고가 동시에 뜨면 무엇을 봐야 할지 모른다.
- **SNS·콘텐츠에서**: 브랜드 색이 청록·라임·옐로에 몰려 있어 **따뜻한 쪽이 노랑 하나뿐**이었다(2026-08-11 대표 지적 — "색상 표현이 잘 안 되는 느낌"). 주황·적색을 열어 온도 대비를 만든다. 80:15:2는 브랜드 3색에 대한 규칙이므로 상태색은 그 배분 밖이지만, **무채색 우위(70% 이상)는 어느 매체에서도 유지**한다.
- ⛔ **매체 불문 — 옐로(`{colors.accent-yellow}`)와 주황(`#E2842F`)을 한 화면에 같이 쓰지 않는다.** 옐로=제품색(노란발자국·볼라드), 주황=표현/상태색. 같이 나오면 무엇이 제품 지시인지 안 읽힌다. **둘 중 하나만 고른다.**
- 이 색들은 2026-08-11 이전에도 `tokens/primitive.json`의 `color.state`에 있었으나 **이 문서가 보여주지 않아 아무도 쓰지 않았다.** 램프(50~900)도 마찬가지다 — 토큰에 있는 것을 여기서 감추면 그 자리에서 색을 지어내게 된다(실측: 파스텔 하이라이트·보더 보정색을 매번 새로 만들었다).

### 무채 램프 (2026-08-13 노출 — 벤치마크 비교감사 후속)

> Linear는 무채 10단 전부에 이름을 붙여 쓰고, 그래서 모든 회색이 사다리 위에 있다. 우리는 램프가 `tokens/primitive.json`에 진작 있었는데 **이 문서가 감춰서** 그 자리에서 회색을 지어냈다(제안서 실측 "비슷한 회색 27종" — §A-6 ②). 이제 여기 노출한다.

| 토큰 | 값 | 비고 |
|---|---|---|
| `gray.50` | `#F6F8F8` | cloud/soft 면 |
| `gray.100` | `#EDF1F2` | |
| `gray.200` | `#E4EAEB` | = `{colors.hairline}` |
| `gray.300` | `#CDD5D8` | 결 위 보더(부록 D-3) |
| `gray.400` | `#9AA7AE` | faint 보조 |
| `gray.500` | `#6B7780` | muted 보조 글자 |
| `gray.600` | `#58595B` | 본문·인쇄 주력 |
| `gray.700` | `#3C4A52` | body 본문 |
| `gray.800` | `#283238` | |
| `gray.900` | `#1A2227` | ink 진한 본문 |

- **규칙: 회색이 더 필요하면 이 램프에서만 고른다 — 새 회색을 만들지 않는다.** 웹 화면의 기본 4색(`{colors.ink}`·`{colors.ink-soft}`·`{colors.hairline}`·`{colors.canvas-soft}`)이 먼저고, 그걸로 부족할 때만 램프로 내려간다(인쇄는 §A-6 ② "회색 4종" 유지).
- ⚠️ 램프에는 홈페이지 실측값과 1~2 밝기 차이 나는 형제값이 있다(`gray.50` ↔ `canvas-soft`, `gray.600` ↔ `ink-soft`). **같은 화면에서 형제를 섞지 않는다** — 실측 4색을 쓰는 화면이면 끝까지 실측 4색.

### 색 배분 규칙 (슬롭 방지 핵심)
실측 비율은 **무채색 337 : 청록계 46 : 라임·노랑 16**이다. 규칙으로 고정한다:

- 한 화면(또는 한 페이지)에서 **무채색이 면적의 80% 이상**
- **청록계는 15% 이하** — 그리고 청록이 칠하는 것은 *행동과 라벨*뿐(CTA·링크·eyebrow·포커스)
- **라임+노랑 합계 2% 이하** — 제품 지시 또는 아치 그라디언트 내부에서만
- 네이비는 **한 페이지에 반전 밴드 1~2개**까지
- **청록 강조 요소끼리 최소 32px 간격**(2026-08-13, Mercury 차용) — CTA·링크 뭉치·배지가 32px 미만으로 붙으면 어느 것도 강조로 읽히지 않는다. 붙여야 하면 하나만 청록으로 남긴다.

## 3️⃣ Typography

### 폰트 패밀리
- **한글·기본**: `Pretendard` — `--font-sans`. 전 본문·제목이 이 하나로 간다.
- **영문 라벨·디스플레이**: `Poppins` — `--font-display`. eyebrow와 푸터 소제목 등 **대문자 라틴 라벨에만**.
- **숫자**: `Plus Jakarta Sans` — 수치·KPI. 클래스 `.num`.
- 전역 `letter-spacing: -0.011em` · `word-break: keep-all` · `overflow-wrap: break-word`
- 제목 `text-wrap: balance` · 문단 `text-wrap: pretty`

### 위계
| 토큰 | 크기(모바일→데스크톱) | 웨이트 | 행간 | 자간 | 용도 |
|---|---|---|---|---|---|
| `{typography.display-1}` | 36px → 48px(sm) → **64px 홈 / 56px 서브**(lg) | 800 | 1.08~1.1 | −0.025em | 페이지 히어로 h1 (2026-08-13 벤치마크 감사 B안 — 종전 48px·1.15에서 확대·타이트닝, 본문 대비 4.3배) |
| `{typography.heading-1}` | 30px → 36px | 800 | 1.2 | −0.025em | **섹션 제목 정본**(실측 11회 동일 패턴) |
| `{typography.heading-2}` | 24px → 28px | 800 | 1.25 | −0.025em | 하위 섹션 제목 (2026-08-13 행간 1.375→1.25 타이트닝 — 벤치마크 동급 1.13~1.2 대비 유일하게 느슨하던 단) |
| `{typography.heading-3}` | 20px | 700 | 1.4 | −0.011em | 카드 제목 |
| `{typography.title}` | 18px | 700 | 1.4 | −0.011em | 기능 제목·콜아웃 |
| `{typography.lead}` | 18px | 400 | 1.625 | −0.011em | 히어로 설명문. `{colors.ink-soft}` · 최대폭 42em |
| `{typography.body-md}` | 15px | 400 | 1.625 | −0.011em | 본문·내비 링크 |
| `{typography.body-sm}` | 14px | 400 | 1.5 | −0.011em | **최다 사용(107회)** — 라벨·표·칩·부가설명 |
| `{typography.caption}` | 12px | 400 | 1.5 | −0.011em | 각주·메타. 실측 38회 |
| `{typography.eyebrow}` | 14px | 600 | 1.33 | **+0.18em** | 섹션 위 대문자 라벨. `{colors.primary-strong}` (실측 13회) |
| `{typography.eyebrow-sm}` | 12px | 600 | 1.33 | **+0.16em** | 푸터·소형 라벨 (실측 6회) |
| `{typography.button}` | 15px | 600 | 1.5 | −0.011em | 버튼 라벨 |

### 원칙
- **위계는 굵기로 만든다.** 제목 800 ↔ 본문 400. 그 사이 600(라벨)·700(카드 제목)만 존재하며, 실측 웨이트 분포는 semibold 78 · bold 40 · medium 24 · extrabold 22 로 **500 이하 본문 웨이트에 클래스를 붙이지 않는다**(기본값 400 유지).
- **클수록 자간을 더 좁힌다.** 30px 이상은 −0.025em, 그 아래는 전역 −0.011em.
- **자간을 벌리는 곳은 eyebrow 하나뿐**(+0.18em). 이 대비가 "라벨"과 "제목"을 구분하는 신호다.
- **페이지 히어로 h1은 `{typography.display-1}` 전용 — 그보다 작은 크기 금지**(2026-08-13, Apple "디스플레이 페이지 40px 미만 금지" 차용). 히어로가 섹션 제목 크기로 내려앉으면 첫 화면의 무게가 사라진다.
- 한글은 `keep-all` — 어절 단위로만 줄바꿈. 문장부호 앞뒤 강제 줄바꿈 금지.

## 4️⃣ Layout

### 스페이싱 체계
4px 배수. `{spacing.xxs}` 4 · `{spacing.xs}` 8 · `{spacing.sm}` 12 · `{spacing.md}` 16 · `{spacing.lg}` 24 · `{spacing.xl}` 32 · `{spacing.2xl}` 40 · `{spacing.3xl}` 48 · `{spacing.4xl}` 64 · `{spacing.5xl}` 80 · `{spacing.6xl}` 112

실측 사용 빈도: `{spacing.xs}` 25회 · `{spacing.sm}` 23회 · `{spacing.md}` 16회 · `{spacing.lg}` 11회 — **작은 간격일수록 자주 쓴다**. 큰 값은 섹션 경계에서만.

### 그리드·컨테이너
- 본문 최대폭 **1200px** 고정, 좌우 여백 `{spacing.lg}`−4px(20px) → `{breakpoints.sm}` 이상 `{spacing.xl}`(32px)
- 카드 그리드는 2단·3단. 열 간격 `{spacing.lg}`(24px), 행 간격 `{spacing.2xl}`(40px)
- 푸터만 12열 그리드, 열 간격 `{spacing.2xl}`
- 반전 밴드(`{colors.navy}`·`{colors.arch}`)는 **화면 끝까지 꽉 차고**, 내부 콘텐츠는 1200px 컨테이너를 지킨다

### 수직 리듬 (실측 정본)
| 구간 | 값 | 실측 |
|---|---|---|
| 섹션 상하 여백 | `{spacing.5xl}` 80px → `{breakpoints.sm}` `{spacing.6xl}` 112px | `py-20 sm:py-28` 18회/16회 — **다른 값 없음** |
| 페이지 히어로 | 64px → 80px → 96px (`{breakpoints.lg}`) | `py-16 sm:py-20 lg:py-24` |
| eyebrow → 제목 | `{spacing.md}` 16px | `mt-4` 11회 |
| 제목 → 설명문 | `{spacing.lg}`−4px 20px | `mt-5` |
| 제목 → 본문(카드 내부) | `{spacing.sm}` 12px | `mt-3` |
| 카드 내부 여백 | `{spacing.lg}` 24px (기본) / 28px→36px (큰 카드) | `p-6` / `p-7 sm:p-9` |

### 여백 철학
**여백이 유일한 그룹핑 장치다.** 구분선(`<hr>`)을 쓰지 않는다 — 섹션은 80/112px 여백과 배경색 교대(`{colors.canvas}` ↔ `{colors.canvas-soft}`)로만 나뉜다. 카드는 헤어라인 1px만 두르고 무거운 테두리를 쓰지 않는다.

**비율로 고정**(매체가 바뀌어도 유지):
- 섹션 상하 여백 = 본문 크기 × **5.3배**(모바일) ~ **7.5배**(데스크톱)
- eyebrow → 제목 간격 = 본문 크기 × **1.07배**
- 제목 → 설명문 간격 = 본문 크기 × **1.33배**
- 카드 내부 여백 = 본문 크기 × **1.6배**

**간격 리듬 = tight/generous 대비**(2026-08-02 보강): 관련 항목은 바짝, 다른 그룹은 넉넉히. 한 간격값을 균일 반복하면 모든 요소가 같은 무게가 되어 위계가 사라진다 — 간격의 단조 반복 자체가 슬롭 신호다. 제목 위 여백은 아래 여백보다 항상 넓게(어긋나면 제목이 위 문단에 붙어 보인다).

**스켈레톤 테스트**: 카피를 전부 지우고 구조만 봐도 이 섹션이 무엇이고 왜 중요한지 읽혀야 한다. 글자 크기로만 만든 강조는 여기서 걸린다.

## 5️⃣ Elevation & Depth

| 단계 | 처리 | 용도 | 실측 |
|---|---|---|---|
| 0 — 평면 | 1px `{colors.hairline}`, 그림자 없음 | 대부분의 카드·인풋·구분 | 보더 77회 |
| 1 — 얹힘 | `{elevation.sm}` = `0 1px 2px rgba(22,48,61,.07), 0 1px 1px rgba(22,48,61,.04)` | 떠 있는 카드 | **15회(지배적)** |
| 2 — 들림 | `{elevation.md}` = `0 6px 16px -4px rgba(22,48,61,.12), 0 2px 4px -1px rgba(22,48,61,.06)` | 호버·팝오버에만 | 2026-08-11 신설 |
| 3 — 컬러 | `{elevation.lg}` = `0 8px 18px -6px rgba(6,156,187,.34)` | 아치 CTA 버튼만 | 4회 |

**그림자는 거의 쓰지 않는다.** 깊이는 그림자가 아니라 ①헤어라인 ②배경색 교대 ③아치 글로우 세 가지로 만든다.

> **그림자 색은 검정이 아니라 네이비 반투명이다**(2026-08-11 전환). 페이퍼 표면 위에서 검정 그림자는 때가 낀 것처럼 탁해진다 — 종이 위의 그림자는 차갑지 않다.

### 아치 글로우 (배경 장식)
`{elevation.glow}` — 360×360px 원, `{colors.arch}` 배경, `opacity 0.10`(진한 면 위에서는 `0.18`), `blur 90px`, 섹션 모서리 바깥으로 반쯤 걸치게 배치. `pointer-events: none` + `aria-hidden`. 히어로·강조 섹션에만, **한 화면에 1개**.

### 모션
- 기본 전환 `{motion.base}` 300ms
- 스크롤 등장 `{motion.reveal}` — `opacity 0→1` + `translateY(26px)→0`, 700ms `cubic-bezier(0.16, 1, 0.3, 1)`
- 버튼 호버 `{motion.lift}` — `translateY(-2px)`, 아치 버튼은 `brightness(1.05)` 추가
- `prefers-reduced-motion: reduce` 시 전부 무효화(필수)

#### 타이밍 스케일 (2026-08-02 신설 — 종전 Known Gap #6 해소)

| 지속시간 | 용도 | 우리 토큰 |
|---|---|---|
| 100~150ms | 즉각 피드백(클릭·토글) | — |
| 150~300ms | 일반 상태 전환 | `{motion.base}` 300ms |
| 300~500ms | 레이아웃·오버레이·뷰 전환 | — |
| 500~800ms | **연출된 등장(focal) — 페이지당 1곳** | `{motion.reveal}` 700ms |

- **퇴장은 등장보다 빠르게.** bounce·elastic 이징 금지 — 감속 도착은 `cubic-bezier(0.16, 1, 0.3, 1)` 하나로.
- **모션은 "작정한 한 순간" 1개.** 모든 섹션에 동일한 등장 효과를 반복하는 것 자체가 슬롭이다 — 흩어진 효과는 연출이 아니다.
- 형제 요소 스태거는 "리스트가 리스트로 등장할 때"만, 총 지연에 상한을 둔다.
- Operate 화면(대시보드·GUI — 부록 C-1)은 150~250ms로 짧게, **페이지 로드 연출 금지**(작업 중인 사용자를 기다리게 하지 않는다).
- 애니메이션 속성은 `transform`·`opacity` 우선 — `width`/`height`/`top`/`left`처럼 레이아웃을 재계산시키는 속성은 애니메이션하지 않는다.

#### 스크롤 연동 (scroll-linked) — 2026-09-03 신설 (▶FFWtxjvW2ts "웹 슬롭 7요소" 대조, 홈 실측 반영)
위 "연출 등장 1곳"은 **등장(entrance)** 예산이다. 스크롤 연동은 등장이 아니라 **피드백**(스크롤하는 동안 화면이 응답한다는 신호)이라 예산이 따로 있다 — 정지 화면이 레퍼런스 수준이어도 이게 0이면 "정리 안 된 느낌"이 남는다(대표 08-26). 반대편 극단(전면 스크롤 스크럽 /world)은 몰입 페이지에서만.
- 허용 3종, **페이지당 합계 3곳 이하**(홈 = 히어로·게이트웨이·스탯 밴드로 소진):
  ① **깊이 레이어** — 히어로 1곳. 레이어 ≤3, 배경은 느리게(+)·전경은 빠르게(−), 이동량 ≤ 섹션 통과당 44px. 구현 = `components/ScrollDepth.tsx`(섹션 진행률 `--sp`) + `.depth{--d}`. 창(클립) 안 사진은 클립을 `<g>`에 고정하고 사진만 움직인다.
  ② **스티키 카드 스택** — 리스트·카드 섹션 1곳, `{breakpoints.lg}`+에서만(모바일은 일반 흐름). 오프셋 **16px**, 카드 배경은 표면색 불투명, seam = 헤어라인 + **위쪽으로만 번지는 저강도 네이비 그림자 1개**(`0 -10px 24px -14px rgba(22,48,61,.22)`, elevation.sm 계열 — 헤어라인만으로는 겹침이 안 읽혔다, 09-03 비평가 실측). 구현 = `.stack-card{--i}`.
  ③ **숫자 카운트업** — 스탯 밴드 1곳, 뷰포트 60% 진입 1회, ≤1200ms ease-out. **SSR·JS 꺼짐·reduced-motion에서는 최종값이 그대로**. 구현 = `components/CountUp.tsx`.
- 금지: 마우스 추적·3D 틸트·무한 루프 배경·글자 단위 리빌(`hero-rise` 스태거로 족함)·스크롤 하이재킹(휠 속도 변경)·스크롤에 따라 색이 바뀌는 배경.
- 속성은 `transform`·`opacity`만, 리스너는 passive+rAF, `prefers-reduced-motion: reduce`에서 전부 정지(최종 상태 표시). 로드 애니메이션(`forwards` 필)과 같은 요소에 얹을 땐 키프레임에서 `transform`을 빼야 스크롤 transform이 덮이지 않는다(`arch-fade` 사례).
- **검증은 정지 캡처로 못 한다** — `Agent\관리본부\_tools\shot.mjs <url> <out> --scroll`(뷰포트 80% 간격 연속 프레임 + 가로 넘침 px, `--mobile` 병행)로 프레임 사이 이동량·겹침·빈 프레임을 눈으로 본다(부록 B-2 #17·#18).

## 6️⃣ Shapes

| 토큰 | 값 | 용도 | 실측 |
|---|---|---|---|
| `{rounded.md}` | 6px | 소형 태그 | 2회 |
| `{rounded.lg}` | 8px | 작은 칩·이미지 썸네일 | 8회 |
| `{rounded.xl}` | 12px | **인풋·소형 카드** | 11회 |
| `{rounded.2xl}` | 16px | **카드 기본** | 31회 |
| `{rounded.3xl}` | 24px | 큰 카드·이미지 프레임·강조 패널 | 15회 |
| `{rounded.full}` | 9999px | **버튼·배지·칩·아바타 전부** | **47회(최다)** |

### 규칙
- **버튼과 배지는 예외 없이 `{rounded.full}`.** 사각 버튼은 이 브랜드에 없다.
- **인풋은 `{rounded.xl}` 12px** — 버튼과 형태를 일부러 다르게 해서 "누르는 것"과 "적는 것"을 구분한다.
- 카드는 16px 기본, 크고 중요한 것만 24px.
- 사진·이미지는 `{rounded.2xl}` 또는 `{rounded.3xl}` 프레임 안에서 잘림 없이 스케일. 강한 아트디렉션 크롭 없음.

## 7️⃣ Components

> 컴포넌트의 **접근성·상태 규격**은 `components/<이름>.md` 20종이 정본이다. 여기서는 **실제 홈페이지에서 관측된 조합값**만 적는다.

### 내비게이션

**`nav-bar`** — 상단 고정 헤더
- 높이 `64px`. 최상단에 **4px `{colors.arch}` 라인**이 화면 폭 전체로 깔린다 — 이게 첫 브랜드 신호다.
- 배경 `{colors.canvas}`, 컨테이너 1200px, 좌우 `{spacing.lg}`−4px → `{spacing.xl}`(`{breakpoints.sm}`)
- 로고 높이 `28px` → `30px`(`{breakpoints.sm}`)
- 메뉴 링크: `{typography.body-md}` 웨이트 500, `{colors.ink-soft}`, 링크 간격 `36px`, 호버 시 `{colors.ink}`로 진해짐 + 아치 밑줄이 좌→우로 늘어남(`{motion.base}`)
- 우측 버튼: 주 액션 navy(`{rounded.full}` 높이 40px) + 필요 시 보조 1개(`button-teal` 또는 outline, 같은 높이). **같은 대상을 히어로와 헤더 양쪽에 둘 때는 두 곳의 강조를 일치**시킨다 — 한쪽만 튀면 어색하다(07-26).
- `{breakpoints.lg}` 미만에서 메뉴·버튼 숨김 → 40×40px 햄버거

**`footer`**
- 배경 `{colors.navy}`, 텍스트 `{colors.on-primary}` @ 70%, 상하 여백 `{spacing.4xl}`
- 12열 그리드, 열 간격 `{spacing.2xl}`
- 소제목: `{typography.eyebrow-sm}` + `{colors.primary}`
- 칩: `{rounded.full}`, 보더 `{colors.on-primary}` @ 15%, 최소 높이 36px, 호버 시 보더 `{colors.primary}`

### 버튼
모든 버튼 공통: `{rounded.full}` · `{typography.button}` · `{motion.base}` · 포커스 링 `{components.focus-ring}` · 줄바꿈 금지(`white-space: nowrap`)

| 크기 | 높이 | 좌우 여백 | 글자 |
|---|---|---|---|
| sm | 40px | `{spacing.lg}`−4px (20px) | 14px |
| md | 48px | `{spacing.lg}` (24px) | 15px |
| lg | 56px | `{spacing.xl}`−4px (28px) | 15px |

**`button-arch`** — 주 CTA. 배경 `{colors.arch}` · 글자 `{colors.on-primary}` · 그림자 `{elevation.lg}` · 호버 `{motion.lift}` + `brightness(1.05)`. **한 화면에 1개**가 원칙.
**`button-navy`** — 보조 CTA. 배경 `{colors.navy}` → 호버 시 `{colors.primary}`로 전환 + `{motion.lift}`.
**`button-teal`** — 보조 CTA(외부·별도 목적지용). 배경 `{colors.primary-strong}` `#0b6c7d` · 글자 `{colors.on-primary}` → 호버 시 `{colors.primary}` + `{motion.lift}`. **네이비 반전 밴드가 있는 페이지에서 보조 CTA가 필요할 때** navy 대신 쓴다 — 버튼과 밴드가 같은 네이비면 버튼이 그 섹션으로 가는 링크처럼 읽힌다(2026-07-26 대표 지적, 홈 히어로 '퍼블릭아이디 월드'). 청록은 정본상 *행동과 라벨을 칠하는 색*이라 CTA 성격과 맞고, 흰 글자 대비도 충분하다.

**`button-outline`** — 3순위. 배경 `{colors.canvas}` · 보더 1px `{colors.hairline}` · 글자 `{colors.ink}` → 호버 시 보더 `{colors.primary}` · 글자 `{colors.primary-strong}`.
  · **페이퍼 표면 위에서는(부록 D) 배경 `rgba(255,255,255,.72)` + 보더 `gray.400` `#9AA7AE`** — 투명 배경이면 버튼으로 읽히지 않는다(2026-08-11 실측: 보더 `#e4eaeb`는 페이퍼와 밝기 차 13). 호버 시 배경 `.95` + 보더 `{colors.primary}`.
**`button-light`** — 진한 면(네이비·아치) 위에서만. 배경 `{colors.canvas}` · 글자 `{colors.navy}`.

### 카드
**`card`** — 기본. `{colors.canvas}` · 보더 1px `{colors.hairline}` · `{rounded.2xl}` · 여백 `{spacing.lg}` · 그림자 `{elevation.sm}`
**`card-lg`** — 중요 카드. `{rounded.3xl}` · 여백 28px → 36px(`{breakpoints.sm}`) · 그림자 `{elevation.sm}`
**`card-soft`** — 강조 패널. 배경 `{colors.canvas-soft}` @ 50% · `{rounded.3xl}` · 여백 `{spacing.xl}` → `{spacing.2xl}`

카드 내부 순서 고정: **아이콘 또는 배지 → 제목(`{typography.heading-3}`) → 본문(`{typography.body-sm}` · `{colors.ink-soft}`)**. 제목과 본문 사이 `{spacing.sm}`.

### 인풋
**`text-input`** — 배경 `{colors.canvas}` · 보더 1px `{colors.hairline}` · **`{rounded.xl}` 12px** · 여백 `{spacing.sm} {spacing.md}` · 글자 `{typography.body-md}` · `outline: none`
포커스 시: 보더 `{colors.primary}` + 링 2px `{colors.primary}` @ 20%

### 라벨·배지
**`eyebrow-label`** — 섹션 제목 위. `{typography.eyebrow}` · `{colors.primary-strong}` · 아래 간격 `{spacing.md}`. **거의 모든 섹션이 이걸로 시작한다**(실측 19회).
**`badge-arch`** — `{colors.arch}` 배경 · `{colors.on-primary}` 글자 · `{typography.caption}` 웨이트 600 · `{rounded.full}` · 여백 `{spacing.xxs} {spacing.sm}`

### 섹션 껍데기
**`section-shell`** — 상하 `{spacing.5xl}` → `{spacing.6xl}`(`{breakpoints.sm}`). 배경은 `{colors.canvas}`와 `{colors.canvas-soft}`를 **번갈아** 쓴다.
**`section-band-dark`** — 배경 `{colors.navy}` 전면. 제목 `{colors.on-primary}`, eyebrow는 `{colors.primary-soft}` 또는 밝은 청록. 한 페이지 1~2회.
**`section-band-arch`** — 배경 `{colors.arch}` 전면. **페이지당 최대 1회**, 보통 최종 CTA.

### 포커스
`{components.focus-ring}` — `outline: 2px solid {colors.primary-strong}` · `outline-offset: 3px` · **`border-radius`는 대상의 것을 따라간다**(둥근 버튼엔 둥근 링 — 고정 3px을 쓰면 pill 버튼에 사각 링이 걸린다, 2026-08-11 교정).
**진한 면 위에서는 링을 흰색으로 뒤집는다** — 청록 링은 네이비·아치 면에서 판독되지 않는다. 어떤 경우에도 `outline: none`만 남기지 않는다.

## 8️⃣ Do's and Don'ts

### ✅ Do
- 무채색(`{colors.ink}`·`{colors.ink-soft}`·`{colors.hairline}`·`{colors.canvas}`·`{colors.canvas-soft}`)으로 **80% 이상**을 채우고, 색은 마지막에 얹는다.
- 구조를 칠하는 색은 **`{colors.primary-strong}` 하나**로 제한한다 — CTA·링크·eyebrow·포커스.
- 섹션은 **`{spacing.5xl}` → `{spacing.6xl}`** 여백과 **배경색 교대**로만 나눈다.
- 모든 섹션을 **`{components.eyebrow-label}`로 연다** — 대문자 청록 라벨이 페이지 전체의 내비게이션 신호다.
- 제목은 **800 웨이트 + `−0.025em` 자간**, 본문은 400으로 두어 위계를 굵기로만 만든다.
- 면 분리는 **1px `{colors.hairline}`**. 그림자는 `{elevation.sm}` 이하.
- **아치 그라디언트는 페이지당 3곳 이하** — 헤더 4px 라인 + 주 CTA + (선택)배경 글로우 1개.
- 버튼·배지는 **예외 없이 `{rounded.full}`**, 인풋은 `{rounded.xl}`.
- 한글은 **`word-break: keep-all`**, 어절 단위 줄바꿈.
- `prefers-reduced-motion: reduce`에서 `{motion.reveal}`·`{motion.lift}`를 전부 끈다.

### ❌ Don't
- **4색(청록·라임·노랑·네이비)을 균등하게 쓰지 않는다.** 이것이 AI 슬롭의 1번 원인이다 — 실측 비율은 80:15:2다.
- **`{colors.accent-lime}`·`{colors.accent-yellow}`로 CTA나 구조 면을 칠하지 않는다.** 노랑은 제품(노란발자국·노란볼라드) 지시 전용, 라임은 아치 그라디언트 내부 전용.
- **`{colors.primary-strong}` 외의 두 번째 구조색을 도입하지 않는다.**
- **아이콘+제목+설명 카드 3개를 균등 그리드로 나열하지 않는다.** 페이지의 기본값이 되는 순간 슬롭이다 — 카드 묶음은 페이지당 1회, 나머지는 다른 형태(표·타임라인·수치 블록·이미지+텍스트 2단)로 바꾼다.
- **가운데 정렬을 기본값으로 쓰지 않는다.** 히어로와 최종 CTA만 가운데, 나머지는 좌측 정렬.
- **구분선(`<hr>`)으로 섹션을 나누지 않는다.** 여백과 배경색이 그 역할이다.
- **진한 그림자·다중 그림자를 쓰지 않는다.** 이 브랜드의 깊이는 헤어라인이다.
- **섹션 여백을 80/112px 외의 값으로 임의 조정하지 않는다.** 실측상 예외가 없다.
- **본문에 웨이트 클래스를 붙이지 않는다**(400 기본 유지). 500 이상은 라벨·제목·버튼에만.
- **네이비를 본문 배경으로 쓰지 않는다** — 반전 밴드 한정.
- **아치 그라디언트를 텍스트 본문에 쓰지 않는다.** `text-arch`는 히어로 대형 숫자·단어 1개까지.
- **한글 문단을 양쪽 정렬(justify)하지 않는다.**
- *(이하 2026-08-02 보강 — impeccable 선별 병합)*
- **카드 안에 카드를 넣지 않는다.** 중첩 카드는 예외 없이 잘못.
- **히어로-메트릭 템플릿을 기본값으로 쓰지 않는다** — "큰 숫자+작은 라벨+통계 나열+액센트" 조합. 수치는 자체 데이터로, 배치는 매번 설계한다.
- **장식용 섹션 번호(01/02/03)를 쓰지 않는다** — 순서 자체가 독자에게 정보일 때만.
- **1px 초과 색 border-left/right 콜아웃을 쓰지 않는다** — 카드·인용·경고 박스의 두꺼운 색 왼줄은 AI 생성 UI의 1번 지문이다(detect CLI `side-tab` 규칙).
- **이모지·유니코드 글리프를 아이콘 대용으로 쓰지 않는다** — 아이콘은 일관된 스트로크의 라이브러리(lucide)나 자체 SVG로 그린다.
- **모노스페이스를 "기술적 느낌" 코스튬으로 쓰지 않는다** — 코드·데이터·측정값에만.
- **hard-offset 그림자(`4px 4px 0`)를 쓰지 않는다** — 네오브루탈리즘을 선택한 적 없는 브랜드에서 제로블러 블록 그림자는 코스튬이다.

## 9️⃣ Responsive

### 브레이크포인트
| 이름 | 폭 | 실측 | 주요 변화 |
|---|---|---|---|
| 기본(모바일) | ~639px | — | 1열 스택, 히어로 36px, 섹션 여백 80px, 좌우 20px |
| `{breakpoints.sm}` | 640px+ | **83회(주력)** | 타이포 한 단계 상승, 섹션 여백 112px, 좌우 32px, 카드 여백 확대 |
| `{breakpoints.md}` | 768px+ | 11회 | 푸터 12열 그리드 전개 |
| `{breakpoints.lg}` | 1024px+ | 43회 | 헤더 메뉴·버튼 노출(햄버거 해제), 다단 그리드 완성 |

`xl`·`2xl`은 사용하지 않는다 — 1200px 컨테이너에서 성장이 멈춘다.

### 전략
- **`{breakpoints.sm}`이 주 분기점이다.** 대부분의 반응형 처리를 여기 하나로 끝낸다(83회). 브레이크포인트를 늘리지 말 것.
- 타이포는 **한 단계씩만** 오른다: 제목 30→36px, 히어로 36→48px.
- 그리드는 3단 → (`{breakpoints.lg}` 미만) 2단 → (모바일) 1단.
- 반전 밴드는 모든 폭에서 화면 끝까지 유지, 내부 컨테이너만 좁아진다.

### 터치 타겟
- 버튼 최소 높이 **40px**(`h-10`), 권장 48px(`h-12`)
- 햄버거 **40×40px**
- 푸터 칩 최소 높이 **36px**
- ⚠️ WCAG 권장 44×44px에 40px·36px이 미달한다 — §🔟 Known Gaps 참조

### 이미지
`{rounded.2xl}`/`{rounded.3xl}` 프레임 안에서 유동 스케일. 크롭 아트디렉션 없음. 로고는 높이 기준(`h-7`/`h-8`)으로 잡고 폭은 auto.

## 🔟 Known Gaps

이 문서가 **다루지 못하는 것**을 명시한다. 여기 적힌 항목은 "규칙이 없다"는 뜻이므로, 해당 작업 시 대표 확인을 받는다.

| # | 빠진 것 | 현재 상태 | 어디를 봐야 하나 |
|---|---|---|---|
| 1 | ~~인쇄·문서 매체 실측~~ | ✅ **해소(07-26)** — 제안서 8종 92p PDF 실측 대조 완료, 결과는 §부록 A-2·A-3·A-6에 반영. 남은 것은 **재빌드**(기존 PDF는 아직 옛 폰트·여백) | §A-6 ⑤ 검증 스크립트 |
| 2 | **카드뉴스·SNS 정사각 규격** | 홈페이지에 존재하지 않는 매체. 별도 렌더러 정본이 따로 있다 | `Agent\콘텐츠본부\카드뉴스\` |
| 3 | **터치 타겟 44px 미달** | 버튼 40px·푸터 칩 36px. 의도인지 누락인지 미확정 | 대표 판단 필요 |
| 4 | **다크 모드** | `tokens/theme-dark.json`은 존재하나 홈페이지 미구현. 실사용 검증 없음 | `tokens/theme-dark.json` |
| 5 | **아이콘 스타일 통일** | 홈페이지는 자체 SVG(`components/icons.tsx`), 제안서는 lucide 팩 — 두 계통이 갈려 있다 | `document-design-standards` 스킬 |
| 6 | ~~모션 토큰 체계~~ | ✅ **해소(2026-08-02)** — §5 타이밍 스케일 4단(100~800ms)·이징·focal 1곳 원칙 신설 | §5 모션 |
| 7 | **그림자 스케일** | Tailwind 기본값을 그대로 쓴다. 브랜드 고유 elevation 정의 없음 | 미정의 |
| 8 | **데이터 시각화(차트) 규격** | 색 순서·축·범례 규칙 없음 | `dataviz` 스킬(범용) |
| 9 | **일러스트·마스코트 배치 규칙** | 퍼이 캐릭터를 화면 어디에·얼마 크기로 두는지 미정의 | `_brand-kit\brand-kit.json` characters |
| 10 | **표(table) 조판** | 홈페이지에 본격 표가 거의 없어 헤더·행 구분·정렬 규칙을 뽑지 못함 | `components/` 미수록 |

---

## 부록 A — 매체 번역 (웹 → 제안서·인쇄)

> 본 문서 §1~🔟은 **웹 실측**이다. 제안서·회사소개서(A4 고정 조판)에 그대로 옮기면 깨진다. 무엇이 넘어가고 무엇이 안 넘어가는지 여기서 가른다.
> ✅ **2026-07-26 제안서 8종(92p) PDF 실측 대조 완료.** 아래 표의 "현행"은 실측치, "정본"은 이 문서가 정하는 값이다. 둘이 다른 칸은 **고쳐야 할 지점**이다. 대조 방법·발견은 §A-6.

### A-1. 넘어가는 것 / 안 넘어가는 것

| 넘어감 ⭕ | 안 넘어감 ❌ |
|---|---|
| 색 배분 **80 : 15 : 2** (§2 마지막) | px 절대값 — 1200px 컨테이너는 A4에서 무의미 |
| 구조색 1개 원칙(`{colors.primary-strong}`) | `{motion.reveal}`·호버·포커스 — 인쇄에 상태가 없음 |
| 타이포 **위계 배수**(§A-2) | `{breakpoints.sm}` 등 반응형 전체 |
| 여백 **비율**(§4 여백 철학) | 무한 세로 스크롤 전제의 섹션 개념 |
| eyebrow → 제목 → 본문 순서 | `{elevation.glow}` blur 90px — 인쇄 재현 불가 |
| `{rounded.full}` 버튼 / 카드 라운딩 대비 | `{elevation.lg}` 컬러 그림자 |
| 아치 그라디언트를 **소량만** 쓰는 규율 | — |
| §8 Don't 전 항목 | — |

### A-2. 타이포 환산 (본문 10.5pt 기준)

웹 본문 15px = 인쇄 본문 10.5pt로 놓고 **배수를 유지**한다.

> ⚠️ 2026-08-13 웹 히어로가 64px로 커졌지만(벤치마크 감사 B안) **인쇄 표지 34pt는 그대로 유지**한다 — 인쇄는 지면 폭이 고정이라 웹 화면의 스케일 확장을 따라가지 않는다. 아래 표의 display-1 "웹 48px" 열은 인쇄 환산의 앵커로 남긴 종전 값.

| 토큰 | 웹 | 배수 | **인쇄 정본** | 현행 실측 | |
|---|---|---|---|---|---|
| `{typography.display-1}` | 48px | ×3.2 | **34pt** (표지 제목) | 40 / 34pt | ⚠️ 2종 혼재 |
| `{typography.heading-1}` | 36px | ×2.4 | **23pt** (섹션·간지 제목) | 23pt | ✅ |
| `{typography.heading-2}` | 28px | ×1.87 | **20pt** (페이지 제목) | — | ⚠️ 없음(13pt로 대체) |
| `{typography.heading-3}` | 20px | ×1.33 | **13pt** (카드·블록 제목) | 13pt | ✅ |
| `{typography.lead}` | 18px | ×1.2 | **12pt** (리드문) | 12 / 12.5pt | ⚠️ 2종 |
| `{typography.body-md}` | 15px | ×1.0 | **10pt** (본문 기준) | 10pt (41.8%) | ✅ |
| `{typography.body-sm}` | 14px | ×0.93 | **9pt** (표·부가설명) | 9 / 9.5pt | ⚠️ 2종 |
| `{typography.eyebrow}` | 14px | ×0.93 | **9pt** (대문자 라벨) | 9pt | ✅ |
| `{typography.caption}` | 12px | ×0.8 | **8.5pt** (각주·출처) | 8.5 / 8pt | ⚠️ 2종 |

**인쇄 본문 기준은 10pt**(웹 15px에 대응). 실측 41.8%가 이미 10pt이므로 이를 정본으로 확정한다 — 상위 CLAUDE.md의 "10.5~11pt"는 웹·일반 문서용 범위이고, A4 제안서 조판은 10pt로 고정한다.

⚠️ **크기 종류를 9개로 제한한다.** 현행은 8·8.5·9·9.5·10·10.5·11·11.5·12·12.5·13·23·34·40pt = **14종**이라 위계가 읽히지 않는다. 위 표의 9개만 쓰고, 새 크기를 만들지 않는다.

행간·자간: 본문 **1.65** · 자간 **−0.01em** · `word-break: keep-all`. 23pt 이상 제목만 자간 −0.025em.

⚠️ **폰트 폴백 사고(2026-07-26 발견·수리)**: `assets/fonts/`에 `Pretendard-Regular.otf`(400)·`Pretendard-SemiBold.otf`(600)가 **없어서** 8종 PDF 전체가 **맑은 고딕으로 폴백**되어 있었다(실측 글자 100%). 두 파일을 `_brand-kit\fonts\`에서 보충했으나 **재빌드 전까지 기존 PDF는 여전히 맑은 고딕**이다. 앞으로 문서를 낼 때마다 **완성 PDF의 실제 임베드 폰트를 확인**한다 — 검증법 §A-6.

### A-3. 여백 환산

| 구간 | **인쇄 정본** | 현행 실측 | |
|---|---|---|---|
| 페이지 상단 마진 | **20mm** | 20.5mm | ✅ |
| 페이지 **하단** 마진 | **24mm** | 16.7mm | ❌ **상단보다 좁다 — 교정 대상** |
| 페이지 좌우 마진 | **20mm** | 20.0mm | ✅ |
| 블록(카드) 내부 여백 | 본문 × 1.6 = **6mm** | — | — |
| eyebrow → 제목 | 본문 × 1.07 = **4mm** | — | — |
| 제목 → 리드문 | 본문 × 1.33 = **5mm** | — | — |
| 블록 사이 간격 | 본문 × 2.7 = **10mm** | — | — |

❌ **하단 마진은 상단보다 넓어야 한다.** 인쇄물은 광학 중심이 기하 중심보다 위에 있어서, 상하 마진이 같거나 하단이 좁으면 판면이 아래로 처져 보인다. 현행은 상 20.5 / 하 16.7mm로 **반대**다 — 하단을 **24mm**로 넓힌다(상단의 1.2배).

### A-4. 페이지 = 섹션

**웹의 섹션 1개 = 인쇄의 페이지 1장**으로 매핑한다. 따라서:
- 페이지 하나에 **메시지 하나**. 웹 섹션이 그렇듯 섞지 않는다.
- 페이지도 **eyebrow 라벨로 연다** — 웹의 `{components.eyebrow-label}`이 인쇄에선 러닝헤더 아래 섹션 라벨이 된다.
- 배경색 교대(`{colors.canvas}` ↔ `{colors.canvas-soft}`)는 **간지에서만** — 본문 페이지를 회색으로 깔지 않는다(인쇄 비용·가독).
- 반전 밴드(`{colors.navy}`)는 **표지·간지·뒷표지 한정**.

### A-5. 인쇄 고유 규칙 (웹에 없음 — 기존 정본 준수)

이 항목들은 이 문서가 새로 정하지 않는다. **`회사소개서-제안서_2026\CLAUDE.md`와 `document-design-standards` 스킬이 정본**이다:
- 라운딩: `.card` **4.5mm** · `.callout`/`.law`/`.price` **3.5mm** (대표 확정 2026-07-19) — §6 배수 유도값 4mm와 정합
- 시그니처 밴드: **표지 금지**, 간지·뒷표지 **하단 중앙** `.band-bottom`(bottom 13mm · 폭 46%)
- 픽토그램: lucide 팩에서 개념 매칭 인라인 SVG (손그림 금지)
- 인포그래픽: "원+텍스트" 수준 금지 — 아이콘 내장 + 아치 센터 배지 + 필 라벨 + 리더선
- 실적 수치 정본: `credibility.ts` → `verify_facts_sync.py` PASS 필수

### A-6. 인쇄 전용 규칙 — 웹에서 안 넘어오는 것 (2026-07-26 실측으로 신설)

웹은 스크롤이라 섹션이 끝나면 다음 섹션이 바로 붙는다. **A4는 페이지가 고정이라, 콘텐츠가 페이지를 못 채우면 그대로 구멍이 된다.** 이 차이가 8종 실측에서 최대 결함으로 나왔다.

#### ① 페이지 충전율 ≥ 80% (신규 정본)
본문 영역(마진 안쪽) 세로의 **80% 이상**을 채운다. 하단에 **40mm 넘는 빈 공간을 남기지 않는다.**

> **실측: 92p 중 82p(89%)가 하단 40mm+ 공백.** 간지(의도된 여백)를 빼도 본문 페이지 대부분이 60~140mm씩 비어 있었다. 4개 카드만 놓고 아래 1/4을 비운 페이지가 반복된다 — "여유"가 아니라 **미완성으로 읽힌다.**

못 채우면 **비운 채로 내지 않는다.** 셋 중 하나를 한다:
1. **내용 보강** — 근거 수치·사례·캡션·출처를 채운다(빈칸을 장식으로 메우지 말 것)
2. **앞뒤 페이지와 병합** — 두 페이지가 각각 60%면 한 페이지로 합친다
3. **레이아웃 재배치** — 2×2 카드를 세로 리스트로 펴서 판면을 채운다

**예외**: 간지(divider)·표지·뒷표지는 의도된 여백이므로 충전율을 적용하지 않는다.

#### ② 회색은 4종까지 (신규 정본)
`{colors.ink}` · `{colors.ink-soft}` · `{colors.hairline}` · `{colors.canvas-soft}` **네 개만** 쓴다.

> **실측: 텍스트 색만 27종.** 정본 색은 전체의 14.9%뿐이고, 나머지가 미세하게 다른 청회색이었다 — `#6b7780`(31.8%, 본문 회색인데 정본 `#57636b`와 다름) · `#58595b` · `#9aa7ae` · `#b9ccd2` · `#c2d2d7` · `#d6e3e7` · `#bccbd1` · `#cbd9dd` · `#9fb6be` 등. **비슷한 회색 15종이 섞이면 문서가 탁해지고 통일감이 사라진다.** 이것이 §8 Don't 1항(색 균등배분)과 함께 슬롭 인상의 양대 원인이다.

원칙(2026-08-02 보강): 우리 회색은 전부 **틴티드 그레이**(청록 색조가 밴 회색 — `#57636b`·`#f5f8f8`이 그 예)다. 순수 무채 회색(`#888` 류)을 새로 만들지 않는다. 톤을 낮출 때도 완전 무채화가 아니라 **채도 70~85%로 감쇠**한다. 색 면(네이비·청록) 위 보조 텍스트는 회색 금지 — 그 색조에서 파생하거나 흰색 투명도로(푸터 white@70%가 정답 사례).

#### ③ 라임의 인쇄 예외
웹에서는 라임을 텍스트에 쓰지 않지만(§8), **표지·간지의 네이비 면 위에서는 라임 텍스트를 허용**한다 — 청록은 네이비 위에서 대비가 부족하다. 본문 페이지(흰 바탕)에서는 웹 규칙대로 **금지**.

#### ④ 카드 그리드는 문서당 2회까지
2×2 또는 3×1 균등 카드 그리드는 **한 문서에 2페이지까지**. 나머지는 표·타임라인·수치 블록·이미지+텍스트 2단으로 바꾼다(§8 Don't).

#### ⑤ 검증 방법 (재현 가능)
문서를 낸 뒤 아래를 실행해 수치로 확인한다. PyMuPDF(`fitz`) 사용, 별도 설치 불필요.

```
① 임베드 폰트   : doc[p].get_fonts()  → Pretendard/PlusJakartaSans 외가 나오면 폴백 사고
② 색 종류       : span["color"] 집계   → 정본 밖 색이 20%를 넘으면 재점검
③ 하단 공백     : 본문 최하단 y ~ 푸터 시작 y  → 40mm 초과 페이지 수
④ 타이포 종류   : span["size"] 집계    → 9종 초과면 위계 붕괴
⑤ 마진          : 텍스트 bbox 합집합 vs 페이지 rect
```

---

## 부록 B — 이 문서 사용법

### B-1. 언제 읽나
`시스템\` 안에서 **눈에 보이는 것을 만들 때 전부** — 제안서·회사소개서·카드뉴스·상세페이지·배너·대시보드·웹페이지·시안. 루트 `CLAUDE.md`에서 자동 로드된다.

**예외** — 이 문서를 적용하지 않는 곳:
- `Agent\타사거래처\` — 거래처 수주. 클라이언트 BI만.
- `Agent\영업본부\디자인시스템-영업상품\` — 타사 DS를 만들어 파는 도구.
- `Agent\콘텐츠본부\publicid-bot\`의 DS 가이드라인 생성 기능 — 영업/거래처용.

### B-2. 제출 전 자가검수 (시각작업 3게이트 ③)
렌더해서 **눈으로 본 뒤** 아래를 세어본다. 하나라도 걸리면 고치고 다시 낸다.

1. **색 배분** — 무채색 80% 이상인가? 청록 외 두 번째 구조색이 들어갔나?
2. **노랑·라임** — 제품 지시 또는 아치 내부가 아닌 곳에 쓰였나?
3. **아치** — 페이지당 3곳 이하인가?
4. **카드 3개 균등 그리드** — 페이지의 기본 레이아웃이 되어버렸나?
5. **가운데 정렬** — 히어로·최종 CTA 외에 쓰였나?
6. **eyebrow** — 섹션/페이지가 대문자 청록 라벨로 열리는가?
7. **여백** — 섹션 80/112px(인쇄 25mm)에서 임의로 벗어났나?
8. **웨이트** — 본문에 500 이상이 붙었나? 제목이 800인가?
9. **라운딩** — 버튼이 `{rounded.full}`인가? 인풋과 형태가 구분되는가?
10. **한글** — `keep-all`인가? 어절 중간에서 끊기는 곳이 있나?
11. **없어야 할 것이 아니라 있어야 할 것** — 요소 목록을 적고 렌더 결과에서 하나씩 확인했나? (누락은 여백으로 읽혀 눈에 안 띈다)
12. **대비**(2026-08-02 추가) — 본문 텍스트 ≥4.5:1, 큰 글자·컨트롤·포커스 표시 ≥3:1인가? (인쇄물에도 준용 — 잉크·색약 가독)
13. **색 면 위 텍스트** — 네이비·청록 면 위에 회색 텍스트가 있나? (그 색조 파생 또는 흰색 투명도로)
14. **모션**(웹·영상만) — 연출 등장이 페이지당 1곳인가? 모든 섹션에 같은 효과가 반복되나? 퇴장이 등장보다 빠른가?
15. **표면**(2026-08-11 추가) — 결을 깐 화면인가? 그렇다면 헤어라인을 `gray.300`으로 올렸고,
    외곽선 버튼에 반투명 흰 배경을 줬고, 카드가 반투명이라 결이 비치는가? (부록 D-3 3건)
16. **스퀸트 테스트** — 렌더를 흐리게(실눈) 봐도 주요 요소 1·보조 2~3·그룹 경계가 순서대로 읽히는가?
17. **모바일 2벌**(2026-09-03 추가, 웹·앱만) — 390px 뷰포트(`Agent\관리본부\_tools\shot.mjs … --mobile`) 풀페이지를 데스크톱과 나란히 봤나? 스티키·고정 요소가 폰에서 본문을 가리거나 가로 넘침을 만들지 않나?
18. **스크롤 연동**(2026-09-03 추가, 웹만) — 스크롤 연동이 페이지당 3곳 이하인가? `shot.mjs … --scroll` 프레임에서 레이어 이동량 차이·카드 겹침·카운트 정착이 보이고 빈 프레임·잘림·가로 넘침(0px)이 없나? reduced-motion에서 최종 상태로 정지하나?

### B-3. 이 문서를 고칠 때
- 색 값을 바꾸려면 `..\BRAND_CONSTANTS.md` → `tokens/*.json` → 재빌드 순서를 먼저 지킨다. 여기 값만 고치면 3자 불일치가 난다.
- 홈페이지가 개편되면 **실측을 다시 뜬다**(§source의 grep 방식). 이 문서는 파생물이므로 정본이 바뀌면 따라와야 한다.
- 버전 분기 금지 — 덮어쓴다.

---

## 부록 C — 모드·검증 보강 (2026-08-02 신설, impeccable v4.0.4 선별 병합)

> 출처·채택/기각 근거 = `design-md-업그레이드제안-임페커블-갭분석.md`(같은 폴더). 우리 브랜드 커밋(eyebrow·80:15:2·본문 15px)과 충돌하는 원본 규칙은 **기각**했고, 여기엔 채택분만 있다.

### C-1. 방문자 모드 4분법 — 산출물마다 규율이 다르다

모드는 **화면 기준**이지 제품 기준이 아니다(도구의 랜딩페이지는 Persuade, 패션 브랜드의 문서는 Read).

| 모드 | 성공 기준 | 우리 산출물 | 규율 |
|---|---|---|---|
| **Persuade**(설득) | 방문자가 결정하고 행동한다 | 홈페이지·상세페이지·카드뉴스·제안서 | 표현 허용. 첫 화면이 논지를 편다. 주 CTA가 보인다 |
| **Operate**(작업) | 방문자가 과업을 완수한다 | 대시보드·관제탑·GUI·칸반 | **일관성 > 표현.** 밀도 허용. 같은 버튼=같은 모양. 스켈레톤 로딩. 시스템 폰트 허용. 모션 150~250ms·로드 연출 금지 |
| **Read**(읽기) | 방문자가 이해한다 | 위키·리포트·가이드 | 구조·본문 폭·내비게이션 우선, 그 다음 머물고 싶은 읽기 경험 |
| **Experience**(체험) | 작품 자체가 주인공 | 퍼블릭아이디 월드·쇼케이스 | 첫 화면부터 작품이 이끌고 인터페이스는 물러난다 |

- Operate의 실패 유형은 "밋밋함"이 아니라 **"목적 없는 낯섦"** — 과장된 버튼·제각각 폼 컨트롤·라벨의 디스플레이 폰트. 기준은 **익숙함을 벌어서 얻기(earned familiarity)** — 도구는 과업 속으로 사라져야 한다.
- Operate 컴포넌트는 상태 7종(기본·호버·포커스·활성·비활성·로딩·오류)을 다 갖추고 낸다. 빈 상태는 5요소(①무엇이 나올 자리 ②왜 중요한지 ③시작 CTA ④시각 요소 ⑤도움 링크) — "데이터 없음" 한 줄 금지.

### C-2. 위계·인지부하 수치

- 한 결정 지점의 옵션 **≤4개** 안전 · 5~7개 그룹화 · ≥8개 과부하.
- 정보 청킹 **≤4개** 단위. 상단 메뉴 **≤5개**. 액션 버튼 **주 1 + 보조 1~2**, 나머지는 메뉴로.
- 위계 공식: **주요 1 + 보조 2~3 + 나머지 톤다운** — 모두가 같은 무게면 아무것도 두드러지지 않는다(80:15:2의 레이아웃판).
- 결정에 필요한 맥락은 한 화면에 모은다 — 정보를 모으러 화면을 오가게 하지 않는다.
- 아이콘 단독 내비게이션 금지 — 텍스트 라벨 병기.

### C-3. AI 클리셰 3종 자기검증 (새 시각물·신규 서피스·타사 DS 작업 시)

AI가 만드는 화면은 주제와 무관하게 세 룩으로 수렴한다: ①**크림 바탕+고대비 세리프+테라코타/시그널레드** ②**니어블랙+네온 1색+글로우 엣지** ③**에디토리얼 헤어라인+이탤릭 세리프+모노 트래킹 라벨**.

- 브리프가 자유로운데 셋 중 하나에 착지했으면 실패 — 재작업.
- 판별 질문: **"카테고리 이름만 듣고 내 미학을 맞힐 수 있는가?"** 맞힐 수 있으면 기본값에 앉은 것.
- **첫 화면 기억 테스트**: 한 화면만 보고 떠난 방문자가 1시간 뒤 뭐라고 묘사할까 — 답이 "무드"뿐이면 실패.
- 자사 작업은 브랜드 정본이 착지점을 정해주므로 이 항목은 주로 **신규 서피스·타사거래처·타사 DS**에서 발동.

### C-4. UX 카피 (웹·GUI·대시보드 한정)

- **에러 3요소**: ①무엇이 실패했나 ②왜(알 때만) ③어떻게 복구하나. 내부 코드("Invalid input")를 본문으로 노출 금지.
- 확인 버튼에 **Yes/No/OK/Submit 금지** — 동작을 이름으로("삭제", "발송 취소"). 라벨은 동작의 결과를 서술한다.
- 같은 개념 = 같은 명사·동사, 제품 전체에서. 플레이스홀더는 예시이지 라벨이 아니다(라벨 상시 표시).
- **헤더가 인트로를 재진술하지 않는다. 같은 말은 한 번만** — 페이지 충전율(§A-6 ①)은 반복이 아니라 근거로 채운다.

### C-5. 프로덕션·성능 수치

**홈페이지·대시보드 HTML**: Core Web Vitals **LCP<2.5s · INP<200ms · CLS<0.1** · 이미지에 `aspect-ratio` 사전 지정(CLS 방지) · `font-display: swap`+필요 굵기만 로드 · 모바일 **입력 필드 16px 하한**(iOS 강제 확대 방지 — 본문 15px 정본은 유지) · flex/grid 아이템 `min-width: 0` · 말줄임 방식(1줄 ellipsis/다줄 line-clamp/자동 줄바꿈)을 디자인 룰로 명시.
**극단값 테스트**: 매우 긴 카피(100자+)·빈 값·이모지·대량 행에서 잘림과 줄바꿈을 렌더로 확인 — 완벽한 입력값에서만 작동하는 디자인은 미완성이다.
**상세페이지·카드뉴스 PNG**: 이미지 압축 **품질 80~85%** = 육안 무손실 기준선.

### C-6. 고치는 순서(트리아지)와 심각도

순서 고정: **①기능 결함(막힌 과업·오도 상태) → ②상태 누락(로딩·빈·오류·성공·비활성) → ③흐름·위계·반응형 드리프트 → ④시각·모션 불일치 → ⑤코드 청소.** 한 구석만 완벽하게 만들지 말 것 — 나머지가 같은 품질선 아래면 그 광은 낭비다.
심각도 태깅: **P0**(과업 차단·즉시) · **P1**(주요 혼란·출시 전) · **P2**(사소·다음 차수) · **P3**(폴리시). 판별: "사용자가 이 문제로 연락해 올까?" → 그렇다면 최소 P1.

### C-7. 기계 검수 — detect CLI (2026-08-02 시범 개통)

LLM 없이 59규칙으로 슬롭 패턴(side-tab 색 왼줄·중첩 카드·레이아웃 애니메이션 등)을 스캔한다. **홈페이지·대시보드 HTML 한정**(A4 조판엔 웹 규칙 오탐 있음).

```
node "Agent\관리본부\_tools\impeccable-detect\detect.mjs" --json <HTML파일 또는 src폴더>
```

- 결과는 **신호이지 판정이 아니다** — 브랜드 예외는 사람이 가른다(실측: 헤더 상단 4px 아치 라인이 `border-accent-on-rounded`로 오탐됨 — 이건 우리 시그니처라 무시).
- 자가검수(B-2)와 금요검수에서 보조 린터로 사용.

---

## 부록 D — 표면 질감 (타이벡 결) · 2026-08-11 대표 확정

> 종전 정본에는 **표면(질감)이라는 축이 아예 없었다** — 바탕은 흰색 아니면 `canvas-soft` 단색뿐이었다.
> 그래서 부드러운 화면을 만들려 할 때마다 그 자리에서 색을 지어냈다(=슬롭 경로). 이 부록이 그 구멍을 막는다.
> **2026-08-20 대표 확정: 배경 기본값이다** — "난 모든 배경은 타이벡 스타일을 원한다". 홈페이지가 이미 이 표면이고, 자사 웹앱·페이지를 새로 만들 때 배경은 흰 단색이 아니라 **이 페이퍼 표면(D-2 사양+D-3 보정)이 기본**이다(네이비 반전 밴드·아치 CTA는 질감 없이 유지, 인쇄·타사 작업 제외).

### D-1. 무엇인가
우리 **친환경 홍보판촉물의 중심 소재가 타이벡**이라는 사실을 표면으로 옮긴 것이다. 흉내 낸 노이즈가 아니라
홈페이지 our work 배너(`public/work/gen-banner.png`)의 **청록 단색 면에서 색·조명을 걷어내고 구김만 추출**했다.
남이 따라 해도 의미가 생기지 않는 차별화다 — 우리 제품의 표면이기 때문이다.

| 자산 | 경로 | 용도 |
|---|---|---|
| 결 · 단면 | `_brand-kit\textures\tyvek-결-단면.png` | **한 장짜리 산출물**(카드·표지·배너). 1080×1350, 타일링 없이 늘려 쓴다 |
| 결 · 타일 | `_brand-kit\textures\tyvek-결-타일.png` | **반복이 필요한 면**(웹·긴 문서). 이음매 없이 반복된다 |
| 결 · 타일(웹) | `_brand-kit\textures\tyvek-결-타일.webp` | 위와 같은 그림의 웹 배포본 **28KB**. 홈페이지는 이걸 쓴다 |

### D-2. 어떻게 쓰는가
바탕색 `{colors.paper}` **`#F1F1F0`** 위에 결을 **overlay**로 얹는다. 텍스처는 128(중간회색)이 평탄면이라
overlay/soft-light가 아니면 색이 탁해진다. **multiply 금지.**

```css
/* 매체별 사양 — 강도와 배율이 다르다 */
.surface        { background: #F1F1F0; position: relative; }
.surface::before{ content:""; position:absolute; inset:0; pointer-events:none;
                  background-image:url("…/tyvek-결-타일.webp");
                  mix-blend-mode: overlay; }
/* 웹·긴 문서 */ background-size: 320px 296px; background-repeat: repeat; opacity: .42;
/* 카드·표지 */ background-image:url("…/tyvek-결-단면.png"); background-size: cover; opacity: .60;
```

- **웹은 잘게·은은하게**(320px 타일 · 0.42), **한 장짜리는 크게·또렷하게**(cover · 0.60). 오래 보는 화면일수록 약해야 한다.
- 카드 크기가 1080×1350이 아니면 `단면`을 늘리지 말고 **`타일`을 쓴다**(늘리면 결이 방향성 있게 뭉갠다).

### D-3. 결이 깔린 면 위에서 달라지는 것 (필수 보정)
바탕이 흰색에서 회백으로 내려가면 **흰 배경을 전제로 잡은 값들이 무너진다.** 아래는 실측으로 확인한 3건이다.

1. **헤어라인이 사라진다** — `{colors.hairline}`(#e4eaeb)은 `#F1F1F0`과 밝기 차가 13뿐이다.
   결 위에서는 `{color.border.strong}`(gray.300 `#CDD5D8`)를 기본 보더로 쓴다.
2. **외곽선 버튼이 배경에 묻힌다** — 투명 배경 버튼은 버튼으로 안 읽힌다.
   **반투명 흰색(0.72)을 깔고** 테두리를 한 단계 진하게(gray.400 계열) 준다.
3. **`{colors.canvas-soft}`(#f5f8f8)가 뜬다** — 이 색은 푸른기가 있어 무채색 바탕 위에서 어긋난다.
   결 위의 카드·이미지 프레임은 **반투명 흰색(0.5)** 으로 바꿔 **결이 비치게** 한다. 불투명 흰 카드를 얹으면
   그 부분만 질감이 끊겨 "종이 위에 스티커를 붙인" 것처럼 읽힌다.

### D-4. 하지 말 것
- 결을 **거울 타일로 반복**하지 않는다(대칭 무늬가 벽지처럼 읽힌다 — 실측 확인). 반복은 `타일` 자산으로만.
- 배너 도안의 **색면 경계가 딸려 들어온 크롭**을 쓰지 않는다. 사선이 매 산출물 같은 자리에 박힌다.
- 결 위에 **또 다른 질감**(그레인·패턴)을 겹치지 않는다. 표면은 한 겹이다.
