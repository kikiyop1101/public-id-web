import fs from 'node:fs'
import path from 'node:path'

// public/products/<폴더>를 스캔해 제품 미디어를 자동 구성한다.
// 규칙: '구조분석*' = 메인(영상 webm/mp4가 있으면 영상 우선, 없으면 gif),
//       '참조*'   = 갤러리(jpg/png/jfif는 사진, mp4/webm은 영상 타일).
// 서버(빌드 타임) 전용 — 클라이언트 컴포넌트에서 import 금지.

export type MainMedia =
  | { kind: 'video'; webm?: string; mp4?: string; fallbackImage?: string }
  | { kind: 'image'; src: string }
  | null

export type GalleryItem =
  | { kind: 'image'; src: string; name: string }
  | { kind: 'video'; src: string; name: string }

export type ProductMedia = { main: MainMedia; gallery: GalleryItem[] }

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.jfif', '.webp', '.gif'])
const VIDEO_EXT = new Set(['.mp4', '.webm'])

function publicUrl(folder: string, file: string): string {
  return `/products/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`
}

export function getProductMedia(folder: string): ProductMedia {
  const dir = path.join(process.cwd(), 'public', 'products', folder)
  let files: string[] = []
  try {
    files = fs.readdirSync(dir)
  } catch {
    return { main: null, gallery: [] }
  }

  // 메인: 구조분석 영상(webm/mp4) 우선, 없으면 구조분석 gif → 첫 참조 이미지
  const nonRef = files.filter((f) => !f.startsWith('참조'))
  const mainWebm = nonRef.find((f) => f.toLowerCase().endsWith('.webm'))
  const mainMp4 = nonRef.find((f) => f.toLowerCase().endsWith('.mp4'))
  const mainGif = nonRef.find(
    (f) => f.startsWith('구조분석') && f.toLowerCase().endsWith('.gif'),
  )

  const refs = files
    .filter((f) => f.startsWith('참조'))
    .sort((a, b) => a.localeCompare(b, 'ko', { numeric: true }))

  const gallery: GalleryItem[] = []
  for (const f of refs) {
    const ext = path.extname(f).toLowerCase()
    if (IMAGE_EXT.has(ext)) gallery.push({ kind: 'image', src: publicUrl(folder, f), name: f })
    else if (VIDEO_EXT.has(ext)) gallery.push({ kind: 'video', src: publicUrl(folder, f), name: f })
  }

  let main: MainMedia = null
  if (mainWebm || mainMp4) {
    main = {
      kind: 'video',
      webm: mainWebm ? publicUrl(folder, mainWebm) : undefined,
      mp4: mainMp4 ? publicUrl(folder, mainMp4) : undefined,
      fallbackImage: mainGif ? publicUrl(folder, mainGif) : undefined,
    }
  } else if (mainGif) {
    main = { kind: 'image', src: publicUrl(folder, mainGif) }
  } else {
    const firstImage = gallery.find((g) => g.kind === 'image')
    if (firstImage) main = { kind: 'image', src: firstImage.src }
  }

  return { main, gallery }
}

// 홈 카드용 대표 이미지: 실제 참조 사진 우선.
// (구조분석 gif는 흰 배경 도식이라 작은 흰 카드에서 묻혀 안 보임 — 상세 섹션 전용.
//  '가이드/구조' 파일은 건너뛰고 첫 실사진, 없을 때만 gif로 폴백.)
export function getCardImage(folder: string): string | null {
  const { main, gallery } = getProductMedia(folder)
  const photo =
    gallery.find((g) => g.kind === 'image' && !/가이드|구조/.test(g.name)) ??
    gallery.find((g) => g.kind === 'image')
  if (photo) return photo.src
  if (main?.kind === 'image') return main.src
  if (main?.kind === 'video' && main.fallbackImage) return main.fallbackImage
  return null
}
