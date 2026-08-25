import type { Metadata } from 'next'
import Link from 'next/link'
import { PRODUCTS } from '@/lib/products'
import { getProductMedia } from '@/lib/product-media'
import ProductTabs from '@/components/ProductTabs'
import ProductSection from '@/components/ProductSection'

export const metadata: Metadata = {
  title: '제품 — 친환경 그래픽 노면표시재·노란발자국·직물시트·홍보판촉물',
  description: '퍼블릭아이디의 친환경 제품군 4종을 소개합니다.',
}

export default function ProductsPage() {
  return (
    <>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-[1200px] px-5 py-16 text-center sm:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl">제품군</h1>
          <p className="mt-3 text-white/70">
            친환경 소재로 만드는 네 가지 제품. 위 탭을 눌러 바로 이동하세요.
          </p>
        </div>
      </section>

      <ProductTabs />

      {PRODUCTS.map((product, index) => (
        <ProductSection
          key={product.id}
          product={product}
          media={getProductMedia(product.folder)}
          index={index}
        />
      ))}

      {/* 견적·구독으로 잇는 최종 CTA */}
      <section className="bg-cloud">
        <div className="mx-auto max-w-[1200px] px-5 py-20 text-center sm:px-8">
          <h2 className="text-ink text-2xl font-bold sm:text-3xl">
            우리 공간에는 얼마나 들까요?
          </h2>
          <p className="text-ink-soft mx-auto mt-3 max-w-xl">
            설치 장소·규격·수량을 알려주시면 맞춤 견적으로 회신드립니다. 시공 후
            관리까지 원하시면 구독을 함께 살펴보세요.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/quote"
              className="bg-arch shadow-teal/20 inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:brightness-105"
            >
              맞춤 견적 받기
            </Link>
            <Link
              href="/subscribe"
              className="hover:bg-teal inline-flex h-12 items-center justify-center rounded-full bg-navy px-6 text-[15px] font-semibold text-white transition"
            >
              구독 알아보기
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
