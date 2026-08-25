import { PRODUCTS } from '@/lib/products'

// 스티키 앵커 탭. 클릭 시 해당 제품 섹션(#id)으로 스무스 스크롤(globals.css의 scroll-behavior).
export default function ProductTabs() {
  return (
    <nav className="sticky top-[68px] z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] gap-1 overflow-x-auto px-5 sm:px-8">
        {PRODUCTS.map((p) => (
          <a
            key={p.id}
            href={`#${p.id}`}
            className="text-ink-soft hover:text-teal hover:border-teal whitespace-nowrap border-b-2 border-transparent px-4 py-4 text-sm font-medium transition-colors"
          >
            {p.name}
          </a>
        ))}
      </div>
    </nav>
  )
}
