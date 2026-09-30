import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { pageMeta } from '@/lib/seo'
import LiteYouTube from '@/components/LiteYouTube'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/blog'
import BreadcrumbLd from '@/components/BreadcrumbLd'

export const dynamic = 'force-dynamic'

// 본문은 플레인 텍스트다. 유튜브 주소만 있는 줄은 파사드 영상으로, 그 밖의 http(s) 주소는 링크로 바꾼다.
const YOUTUBE_LINE =
  /^https?:\/\/(?:(?:www\.|m\.)?youtube\.com\/watch\?(?:\S*?&)?v=|youtu\.be\/)([\w-]{11})\S*$/
const URL_IN_TEXT = /https?:\/\/[^\s<>"']+/g

function linkify(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(URL_IN_TEXT)) {
    const url = m[0].replace(/[.,!?)\]]+$/, '')
    const start = m.index
    if (start > last) out.push(text.slice(last, start))
    out.push(
      <a
        key={`${keyPrefix}-${start}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all text-teal-700 underline underline-offset-2"
      >
        {url}
      </a>,
    )
    last = start + url.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function renderBody(body: string, title: string): ReactNode[] {
  const blocks: ReactNode[] = []
  let buf: string[] = []
  const flush = () => {
    // 영상 앞뒤의 빈 줄은 영상 여백이 대신한다
    while (buf.length && buf[0].trim() === '') buf.shift()
    while (buf.length && buf[buf.length - 1].trim() === '') buf.pop()
    if (buf.length) {
      const key = `t${blocks.length}`
      blocks.push(
        <div key={key} className="whitespace-pre-wrap">
          {linkify(buf.join('\n'), key)}
        </div>,
      )
    }
    buf = []
  }
  for (const line of body.split(/\r?\n/)) {
    const yt = line.trim().match(YOUTUBE_LINE)
    if (yt) {
      flush()
      blocks.push(
        <LiteYouTube key={`v${blocks.length}`} id={yt[1]} title={title} place="blog" className="my-6" />,
      )
    } else {
      buf.push(line)
    }
  }
  flush()
  return blocks
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  const description = post.body.replace(/\s+/g, ' ').trim().slice(0, 150)
  return pageMeta({
    title: post.title,
    description,
    path: `/blog/${post.slug}`,
    ogType: 'article',
    ...(post.cover_image ? { images: [{ url: post.cover_image, alt: post.title }] } : {}),
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.created_at,
    mainEntityOfPage: `https://www.public-id.co.kr/blog/${post.slug}`,
    image: post.cover_image ?? 'https://www.public-id.co.kr/og.png',
    author: {
      '@type': 'Organization',
      '@id': 'https://www.public-id.co.kr/#organization',
      name: '퍼블릭아이디',
    },
    publisher: { '@id': 'https://www.public-id.co.kr/#organization' },
  }

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <BreadcrumbLd
        trail={[
          { name: '기업 블로그', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <Link href="/blog" className="text-teal text-sm hover:underline">
        ← 블로그로
      </Link>

      {post.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_image}
          alt={post.title}
          width={1600}
          height={900}
          className="mt-4 aspect-[16/9] w-full rounded-2xl object-cover"
        />
      )}

      <h1 className="text-ink mt-6 text-2xl font-bold sm:text-3xl">{post.title}</h1>
      <time
        dateTime={post.created_at}
        className="text-ink-soft mt-2 block text-sm"
      >
        {new Date(post.created_at).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </time>

      <div className="text-ink mt-6 leading-relaxed">{renderBody(post.body, post.title)}</div>
    </article>
  )
}
