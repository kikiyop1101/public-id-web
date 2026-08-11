import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "arch" | "navy" | "teal" | "outline" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-300 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2";

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-7 text-[15px]",
};

const variants: Record<Variant, string> = {
  arch: "bg-arch text-white shadow-lg shadow-teal/20 hover:-translate-y-0.5 hover:brightness-105",
  navy: "bg-navy text-white hover:bg-teal hover:-translate-y-0.5",
  // 보조 CTA — 네이비 반전 밴드가 있는 페이지에서 navy 대신(PI-DS design.md button-teal)
  teal: "bg-teal-700 text-white hover:bg-teal hover:-translate-y-0.5",
  // paper 표면 위에서 투명 배경은 버튼으로 읽히지 않는다 → 반투명 흰 배경 + 진한 보더
  // (배경/보더 실제 값은 globals.css의 a.border-line 규칙이 담당 — 여기선 호버 색만)
  outline: "border border-line text-ink hover:border-teal hover:text-teal-700",
  light: "bg-white text-navy hover:bg-cloud",
};

export default function Button({
  href,
  children,
  variant = "arch",
  size = "md",
  className,
  external,
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
}) {
  const cls = cn(base, sizes[size], variants[variant], className);

  if (href) {
    if (external || href.startsWith("http")) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls}>
      {children}
    </button>
  );
}
