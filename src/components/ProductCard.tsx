import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/products'

// 홈 제품 카드. image는 서버에서 구조분석 gif(애니메이션) 또는 첫 참조 이미지를 넘겨준다.
export default function ProductCard({
  product,
  image,
}: {
  product: Product
  image: string | null
}) {
  return (
    <Link
      href={product.anchor}
      className="border-line hover:shadow-teal/5 group block overflow-hidden rounded-2xl border bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-white">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized={image.toLowerCase().endsWith('.gif')}
            // 구조분석 다이어그램(gif)은 전체가 보여야 하고, 사진은 꽉 채운다
            className={image.toLowerCase().endsWith('.gif') ? 'object-contain' : 'object-cover'}
          />
        ) : (
          <div className="bg-arch flex h-full w-full items-center justify-center">
            <span className="px-6 text-center text-xl font-bold text-white/90">{product.name}</span>
          </div>
        )}
        {/* 구조분석 자료 보호 — 우클릭이 이미지가 아닌 이 레이어에 닿게 해 저장 메뉴를 차단 */}
        <div aria-hidden className="absolute inset-0" />
      </div>
      <div className="p-5">
        <p className="text-teal text-xs font-semibold">{product.tagline}</p>
        <h3 className="text-ink mt-1 text-lg font-bold">{product.name}</h3>
        <p className="text-ink-soft mt-2 text-sm leading-relaxed">{product.summary}</p>
        <span className="border-teal text-teal group-hover:bg-teal mt-4 inline-flex h-9 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition group-hover:text-white">
          자세히 보기
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  )
}
