import Image from 'next/image'
import type { Product } from '@/lib/products'
import type { ProductMedia } from '@/lib/product-media'
import ProductGallery from '@/components/ProductGallery'

// 제품 한 섹션: 구조분석 메인(영상 우선) + 설명 + 참조 갤러리.
export default function ProductSection({
  product,
  media,
  index,
}: {
  product: Product
  media: ProductMedia
  index: number
}) {
  const reversed = index % 2 === 1
  const { main, gallery } = media

  return (
    <section id={product.id} className="border-line scroll-mt-32 border-b">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* 구조분석 메인 미디어 */}
          <div className={reversed ? 'md:order-2' : ''}>
            {/* 구조분석 다이어그램은 잘리면 안 되므로 16:9 + contain */}
            <div className="border-line relative aspect-video w-full overflow-hidden rounded-[28px] border bg-white">
              {main?.kind === 'video' ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={main.fallbackImage}
                  className="h-full w-full object-contain"
                >
                  {main.webm && <source src={main.webm} type="video/webm" />}
                  {main.mp4 && <source src={main.mp4} type="video/mp4" />}
                </video>
              ) : main?.kind === 'image' ? (
                <Image
                  src={main.src}
                  alt={`${product.name} 구조분석`}
                  width={800}
                  height={450}
                  unoptimized={main.src.toLowerCase().endsWith('.gif')}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="bg-arch flex h-full w-full items-center justify-center">
                  <span className="px-6 text-center text-2xl font-bold text-white/90">
                    {product.name}
                  </span>
                </div>
              )}
              {/* 구조분석 자료 보호 — 우클릭이 이미지가 아닌 이 레이어에 닿게 해 저장 메뉴를 차단 */}
              <div aria-hidden className="absolute inset-0" />
            </div>
          </div>

          {/* 설명 */}
          <div className={reversed ? 'md:order-1' : ''}>
            <p className="text-teal text-sm font-semibold">{product.tagline}</p>
            <h2 className="text-ink mt-2 text-2xl font-bold sm:text-3xl">{product.name}</h2>
            <p className="text-ink-soft mt-4 leading-relaxed">{product.summary}</p>
            {product.basePrice && (
              <p className="text-ink mt-3 text-sm font-semibold">
                {product.basePrice}
              </p>
            )}
            <ul className="mt-6 space-y-2">
              {product.points.map((point) =>
                point.strong ? (
                  <li key={point.text} className="flex items-center gap-2 text-sm">
                    <span className="bg-yellow inline-block h-2 w-2 rounded-full" />
                    <span className="bg-yellow/20 text-ink rounded-md px-2 py-0.5 font-bold">
                      {point.text}
                    </span>
                  </li>
                ) : (
                  <li key={point.text} className="text-ink flex items-center gap-2 text-sm">
                    <span className="bg-lime inline-block h-2 w-2 rounded-full" />
                    {point.text}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        {/* 참조 갤러리 */}
        {gallery.length > 0 && (
          <div className="mt-10">
            <h3 className="text-ink-soft mb-3 text-sm font-semibold">
              시공·제작 사례 <span className="text-teal">({gallery.length})</span>
            </h3>
            <ProductGallery items={gallery} productName={product.name} />
          </div>
        )}
      </div>
    </section>
  )
}
