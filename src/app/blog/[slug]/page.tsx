import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/blog'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  const description = post.body.replace(/\s+/g, ' ').trim().slice(0, 150)
  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      ...(post.cover_image ? { images: [{ url: post.cover_image }] } : {}),
    },
  }
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
    ...(post.cover_image ? { image: post.cover_image } : {}),
    author: {
      '@type': 'Organization',
      '@id': 'https://www.public-id.co.kr/#organization',
      name: '퍼블릭아이디',
    },
    publisher: { '@id': 'https://www.public-id.co.kr/#organization' },
  }

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
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

      <div className="text-ink mt-6 whitespace-pre-wrap leading-relaxed">{post.body}</div>
    </article>
  )
}
