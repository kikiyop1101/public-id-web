import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { safeEqual } from '@/lib/safe-equal'

// 구 스토어 도메인 → 본진 301 (2026-08-25 통합). 경로 보존이라 발행물 링크(store.../os 등)가 그대로 살아남는다.
const LEGACY_HOSTS = new Set([
  'store.public-id.co.kr',
  'www.store.public-id.co.kr',
  'public-greensign.com',
  'www.public-greensign.com',
])

export function proxy(req: NextRequest) {
  const host = req.headers.get('host')?.toLowerCase() ?? ''
  const { pathname, search } = req.nextUrl

  if (LEGACY_HOSTS.has(host)) {
    // store 루트 = 축제·행사 제안 사이트(2026-08-27 대표 지시 — "놀고 있는 도메인 활용").
    // 루트 접속만 /festival을 그대로 서빙(주소창 유지)하고, 하위 경로는 종전대로 www 301 —
    // 예전 발행물에 남은 store…/os 류 링크가 계속 살아 있어야 한다.
    if (host.includes('store.public-id.co.kr') && pathname === '/') {
      const url = req.nextUrl.clone()
      url.pathname = '/festival'
      return NextResponse.rewrite(url)
    }
    return NextResponse.redirect(`https://www.public-id.co.kr${pathname}${search}`, 301)
  }

  // 2026-09-28 대표 지시 — PI-System 주소는 소문자 /pis. /Pis 같은 대문자 변형은 소문자로 308.
  // next.config redirects는 대소문자 무시 매칭이라 무한 반복(09-17 실측) — 여기서만 대소문자를 구분해 판정한다.
  if (/^\/pis(\/|$)/i.test(pathname) && !pathname.startsWith('/pis')) {
    const url = req.nextUrl.clone()
    url.pathname = '/pis' + pathname.slice(4)
    return NextResponse.redirect(url, 308)
  }

  // /admin/* 보호. 로그인 페이지는 예외. 쿠키 토큰이 서버 토큰과 일치해야 통과.
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get('pg_admin')?.value
    if (!safeEqual(token, process.env.ADMIN_SESSION_TOKEN)) {
      const url = req.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  // 301·/admin 판정은 페이지 경로에만 필요. 확장자 있는 정적 파일(폰트·사진·영상·아이콘)은 제외(2026-09-28) —
  // 종전엔 Pretendard 서브셋 92개·제품 사진마다 엣지 미들웨어가 돌았다. 구 호스트의 robots.txt·sitemap.xml은 그대로 200(내용이 www 주소).
  matcher: ['/((?!_next/static|_next/image|.*\\.[a-zA-Z0-9]+$).*)'],
}
