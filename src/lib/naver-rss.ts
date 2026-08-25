export type NaverItem = { title: string; link: string; pubDate: string }

function pick(block: string, tag: string): string {
  const m = block.match(
    new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`),
  )
  return m ? m[1].trim() : ''
}

// 네이버 블로그 RSS(XML)에서 item들을 파싱. 외부 의존 없이 정규식으로.
export function parseNaverRss(xml: string): NaverItem[] {
  const items: NaverItem[] = []
  const re = /<item>([\s\S]*?)<\/item>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(xml))) {
    const block = m[1]
    items.push({
      title: pick(block, 'title'),
      link: pick(block, 'link'),
      pubDate: pick(block, 'pubDate'),
    })
  }
  return items
}
