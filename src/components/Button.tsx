import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "arch" | "navy" | "outline" | "light";
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
  return <button className={cls}>{children}</button>;
}
