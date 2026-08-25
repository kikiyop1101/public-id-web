// 캠페인 지도의 노란 핀(시공 사례) — 홈페이지 안전관리지도와 같은 구글 시트
// "안전관리 시설대장"을 그대로 읽는다. 시트가 정본이므로 대표님이 시트를 고치면
// 캠페인 지도도 따라 바뀐다(사본을 만들지 않는다).
//
// 주소→좌표만 정적 매핑(src/data/showcase-coords.json)으로 푼다. 카카오 지오코더는
// 브라우저 전용 + 도메인 등록이 필요해 서버에서 쓸 수 없어서다. 시트에 새 주소가
// 생기면 홈페이지 /safety-map 을 한 번 열고 localStorage 의 pid_geo_v2 값을
// showcase-coords.json 에 반영하면 된다(좌표 없는 행은 조용히 빠진다 — 지어내지 않는다).

import coords from '@/data/showcase-coords.json'

const SHEET_CSV =
  'https://docs.google.com/spreadsheets/d/1aiLLLyNiofy9n8pPjT8UIFaSgdRXcWTR7wsdm6uWy_Q/export?format=csv&gid=0'

export type ShowcaseSite = {
  label: string
  lat: number
  lng: number
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  const source = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  for (let i = 0; i < source.length; i++) {
    const char = source[i]
    if (inQuotes) {
      if (char === '"') {
        if (source[i + 1] === '"') {
          field += '"'
          i++
        } else inQuotes = false
      } else field += char
    } else if (char === '"') inQuotes = true
    else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else field += char
  }
  if (field.length || row.length) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

/**
 * 지도에 노란 핀으로 올릴 시공 사례.
 * - 철거완료일이 있는 곳은 표시물이 이미 없으므로 제외한다.
 * - 좌표를 모르는 주소도 제외한다.
 */
export async function loadShowcaseSites(): Promise<ShowcaseSite[]> {
  let text: string
  try {
    const res = await fetch(SHEET_CSV, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    text = await res.text()
  } catch {
    return [] // 시트를 못 읽어도 캠페인 페이지는 열려야 한다
  }

  const rows = parseCSV(text).filter((row) => row.some((cell) => cell.trim() !== ''))
  if (rows.length < 2) return []

  const header = rows[0].map((cell) => cell.trim())
  const at = (name: string) => header.indexOf(name)
  const col = {
    type: at('종류'),
    name: at('명칭/위치'),
    address: at('주소'),
    demolished: at('철거완료일'),
  }
  const get = (row: string[], index: number) => (index >= 0 ? (row[index] ?? '').trim() : '')
  const coordMap = coords as Record<string, { lat: number; lng: number }>

  const sites: ShowcaseSite[] = []
  for (const row of rows.slice(1)) {
    if (get(row, col.demolished)) continue
    const point = coordMap[get(row, col.address)]
    if (!point) continue
    const type = get(row, col.type)
    const name = get(row, col.name)
    // "근방 횡단보도"처럼 명칭만으로 어디인지 모르는 행이 있어 주소의 동·읍을 앞에 붙인다.
    const area = get(row, col.address).match(/[가-힣]+(?:동|읍|면|리)(?=\s|$)/)?.[0] ?? ''
    const place = area && !name.includes(area) ? `${area} ${name}`.trim() : name
    sites.push({
      label: [place, type].filter(Boolean).join(' · ') || '시공 사례',
      lat: point.lat,
      lng: point.lng,
    })
  }
  return sites
}
