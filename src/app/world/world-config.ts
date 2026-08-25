// 스크롤 월드 — 장면 정본. 카피·색만 여기서 고친다(영상 파일명은 파이프라인이 정한다).
// 사실 정본 = Agent\퍼블릭아이디기본자료\BRAND_CONSTANTS.md

export type WorldSection = {
  id: string
  label: string
  still: string
  stillMobile?: string
  clip: string
  clipMobile?: string
  accent: string
  eyebrow: string
  title: string
  body: string
  tags?: (string | { label: string; href: string })[]
  scroll?: number
  linger?: number
  cta?: {
    primary: { label: string; href: string }
    secondary: { label: string; href: string }
  }
}

export const WORLD_SECTIONS: WorldSection[] = [
  {
    id: 'material',
    label: '소재',
    still: '/world/poster1.webp',
    stillMobile: '/world/poster1-m.webp',
    clip: '/world/vid/dive1.mp4',
    clipMobile: '/world/vid/dive1-m.mp4',
    accent: '#069CBB',
    eyebrow: '친환경에서 시작합니다',
    title: '재료부터 다릅니다.',
    body: '친환경 그래픽 자재와 GREENGUARD GOLD(UL) 인증받은 Latex 잉크로 출력합니다.',
    tags: [
    { label: 'Homepage', href: '/' },
    { label: 'Products', href: '/products' },
  ],
    scroll: 2.1,
  },
  {
    id: 'make',
    label: '제작',
    still: '/world/poster2.webp',
    stillMobile: '/world/poster2-m.webp',
    clip: '/world/vid/dive2.mp4',
    clipMobile: '/world/vid/dive2-m.mp4',
    accent: '#17A2AE',
    eyebrow: '만드는 곳',
    title: '도면이 그래픽이 되는 자리.',
    body: 'HP Latex 대형출력기가 그래픽을 인쇄하고, 저희가 직접 재단해 시공 단위로 포장합니다.',
    tags: [
    { label: '친환경그래픽노면표시재', href: '/products#roadmark' },
    { label: '친환경그래픽직물시트', href: '/products#fabric' },
  ],
    scroll: 2.0,
  },
  {
    id: 'install',
    label: '시공',
    still: '/world/poster3.webp',
    stillMobile: '/world/poster3-m.webp',
    clip: '/world/vid/dive3.mp4',
    clipMobile: '/world/vid/dive3-m.mp4',
    accent: '#FFD200',
    eyebrow: '붙이는 순간',
    title: '스쿨존에 노란발자국을 붙입니다.',
    body: '인도의 대기공간에 친환경 그래픽 노면표시재를 부착해 아이가 설 자리를 만듭니다.',
    tags: [
    { label: '노란발자국', href: '/products#footprint' },
    { label: '친환경그래픽노면표시재', href: '/products#roadmark' },
  ],
    scroll: 2.6,
    linger: 0.45,
  },
  {
    id: 'care',
    label: '관리',
    still: '/world/poster4.webp',
    stillMobile: '/world/poster4-m.webp',
    clip: '/world/vid/dive4.mp4',
    clipMobile: '/world/vid/dive4-m.mp4',
    accent: '#92BB2F',
    eyebrow: '그다음이 진짜',
    title: '붙이고 끝이 아닙니다.',
    body: '안전시설관리 구독(정기점검)으로 상태를 확인하고, 필요한 곳을 점검합니다.',
    tags: [
    { label: '노란볼라드', href: '/products#fabric' },
    { label: '안전시설관리점검', href: 'https://www.public-id.co.kr/safety-map' },
  ],
    scroll: 2.1,
  },
  {
    id: 'products',
    label: '제품',
    still: '/world/poster5.webp',
    stillMobile: '/world/poster5-m.webp',
    clip: '/world/vid/dive5.mp4',
    clipMobile: '/world/vid/dive5-m.mp4',
    accent: '#069CBB',
    eyebrow: '제품군',
    title: '콘텐츠 · 아이템, 한 곳에서.',
    body: '친환경(그래픽노면표시재 · 그래픽직물시트 · 홍보판촉물)\n& 다양한 콘텐츠와 캠페인 아이템.',
    scroll: 2.7,
    linger: 0.5,
    cta: {
      primary: { label: '제품 살펴보기', href: '/' },
      secondary: {
        label: '스마트스토어에서 구매',
        href: 'https://smartstore.naver.com/public-id',
      },
    },
  },
]

export const WORLD_CONNECTORS = [
  '/world/vid/conn1.mp4',
  '/world/vid/conn2.mp4',
  '/world/vid/conn3.mp4',
  '/world/vid/conn4.mp4',
]

export const WORLD_CONNECTORS_MOBILE = [
  '/world/vid/conn1-m.mp4',
  '/world/vid/conn2-m.mp4',
  '/world/vid/conn3-m.mp4',
  '/world/vid/conn4-m.mp4',
]
