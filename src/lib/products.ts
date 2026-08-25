export type ProductPoint = {
  text: string
  /** true면 제품 섹션에서 눈에 띄게 강조(수상작 등) */
  strong?: boolean
}

export type Product = {
  id: 'roadmark' | 'footprint' | 'fabric' | 'promo'
  /** public/products/<folder> — 폴더만 추가하면 갤러리가 자동 구성된다 */
  folder: string
  name: string
  tagline: string
  summary: string
  points: ProductPoint[]
  anchor: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'roadmark',
    folder: '친환경그래픽노면표시재',
    name: '친환경 그래픽 노면표시재',
    tagline: '바닥에 새기는 안전과 브랜드',
    summary:
      '도로·보도·주차장 바닥에 시공하는 친환경 그래픽 노면표시재. 안전 그래픽과 브랜드 그래픽을 오래 지속되게 구현합니다.',
    points: [
      { text: '친환경 소재 인쇄' },
      { text: '높은 내구성·논슬립' },
      { text: '맞춤 그래픽 디자인' },
    ],
    anchor: '/products#roadmark',
  },
  {
    id: 'footprint',
    folder: '친환경그래픽노면표시재-노란발자국',
    name: '친환경 그래픽 노면표시재 · 노란발자국',
    tagline: '어린이 교통안전 시그니처',
    summary:
      '횡단보도 앞 대기 지점을 알려주는 노란발자국. 퍼블릭아이디의 시그니처 어린이 교통안전 노면표시재입니다.',
    points: [
      { text: '어린이 보행 안전 유도' },
      { text: '스쿨존·횡단보도 특화' },
      { text: '규격 가이드 제공' },
    ],
    anchor: '/products#footprint',
  },
  {
    id: 'fabric',
    folder: '친환경그래픽직물시트',
    name: '친환경 그래픽 직물시트',
    tagline: '벽과 기둥, 천장을 캔버스로',
    summary:
      '실내외 벽면(울퉁불퉁한 면·벽돌면 외)과 기둥(신호등·전봇대 등), 천장에 부착하는 친환경 그래픽 직물시트. 공간의 분위기와 브랜드 메시지를 손쉽게 바꿉니다.',
    points: [
      { text: '실내외 벽면·기둥면·천장면 등 시공' },
      { text: '탈부착 용이' },
      { text: '대형 그래픽 대응' },
      { text: '기존 안내판 등 화면 교체 용이 — 감싸서 새것처럼' },
      { text: '노란볼라드 — GD(굿디자인) 수상작', strong: true },
    ],
    anchor: '/products#fabric',
  },
  {
    id: 'promo',
    folder: '친환경홍보판촉물',
    name: '친환경 홍보판촉물',
    tagline: '전하고 싶은 마음을 친환경으로',
    summary:
      '친환경 소재를 기반으로 한 홍보·판촉물. 캠페인과 브랜드에 어울리는 굿즈를 기획·제작합니다.',
    points: [
      { text: '친환경 소재' },
      { text: '소량·맞춤 제작' },
      { text: '캠페인 연계 기획' },
    ],
    anchor: '/products#promo',
  },
]
