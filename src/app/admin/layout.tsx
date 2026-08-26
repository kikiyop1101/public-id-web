import type { Metadata } from 'next'

// 관리자 영역은 검색 색인 제외 (robots.ts의 /admin disallow와 이중 방어)
export const metadata: Metadata = {
  title: '관리자',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
