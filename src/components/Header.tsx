"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-line bg-white shadow-sm"
          : "border-b border-transparent bg-white",
      )}
    >
      <div className="h-1 w-full bg-arch" />
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          aria-label={site.name}
          className="flex shrink-0 items-center"
          onClick={() => setOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt={site.name} width={480} height={142} className="h-7 w-auto sm:h-[30px]" />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {site.nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="link-underline text-[15px] font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex">
          <Link
            href="/contact"
            className="inline-flex h-10 items-center justify-center rounded-full bg-navy px-5 text-sm font-semibold text-white transition hover:bg-teal"
          >
            구독 상담
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          className="relative z-50 flex h-10 w-10 items-center justify-center lg:hidden"
        >
          <div className="flex flex-col gap-[5px]">
            <span
              className={cn(
                "block h-0.5 w-6 bg-ink transition-transform",
                open && "translate-y-[7px] rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-6 bg-ink transition-opacity",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-6 bg-ink transition-transform",
                open && "-translate-y-[7px] -rotate-45",
              )}
            />
          </div>
        </button>
      </div>

      {/* Mobile drawer — `invisible` keeps the closed menu out of the tab order */}
      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-x-0 top-[68px] z-40 border-t border-line bg-white transition-all duration-300 lg:hidden",
          open
            ? "visible pointer-events-auto translate-y-0 opacity-100"
            : "invisible pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-5 py-4">
          {site.nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-3 text-base font-medium text-ink hover:bg-cloud"
            >
              <span>{n.label}</span>
              <span className="font-display text-xs uppercase tracking-wider text-ink-soft">
                {n.en}
              </span>
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-arch px-5 font-semibold text-white"
          >
            구독 상담
          </Link>
        </nav>
      </div>
    </header>
  );
}
