// BreadcrumbList JSON-LD — 서브페이지 공용(claude-seo 2차 감사: 사이트 전체 3페이지뿐 → 확장).
// trail에 홈은 넣지 않는다(자동으로 앞에 붙는다). path는 "/about"처럼 루트 상대경로.
const BASE = 'https://www.public-id.co.kr'

export default function BreadcrumbLd({
  trail,
}: {
  trail: { name: string; path: string }[]
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: BASE },
      ...trail.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: t.name,
        item: `${BASE}${t.path}`,
      })),
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
  )
}
