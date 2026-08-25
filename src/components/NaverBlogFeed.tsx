import { parseNaverRss } from '@/lib/naver-rss'

// 네이버 블로그 최신글 링크 섹션. RSS URL 미설정/실패 시 아무것도 렌더하지 않음(graceful).
export default async function NaverBlogFeed() {
  const url = process.env.NAVER_BLOG_RSS_URL
  if (!url) return null

  let items
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    items = parseNaverRss(await res.text()).slice(0, 5)
  } catch {
    return null
  }
  if (!items.length) return null

  return (
    <section className="mt-14">
      <h2 className="text-ink text-lg font-bold">네이버 블로그 최신글</h2>
      <ul className="mt-4 divide-y divide-line border-t border-line">
        {items.map((item) => (
          <li key={item.link}>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-black/[0.02]"
            >
              <span className="text-ink min-w-0 flex-1 truncate text-sm">{item.title}</span>
              <span className="text-teal shrink-0 text-xs">네이버 ↗</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
