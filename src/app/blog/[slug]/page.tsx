import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/blog'

export const dynamic = 'force-dynamic'

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
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

      <div className="text-ink mt-6 whitespace-pre-wrap leading-relaxed">{post.body}</div>
    </article>
  )
}
