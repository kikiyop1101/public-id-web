import type { ReactNode } from "react";
import Container from "@/components/Container";

export default function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-cloud/50">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-8%] h-[360px] w-[360px] rounded-full bg-arch opacity-[0.10] blur-[90px]"
      />
      <Container className="py-16 sm:py-20 lg:py-24">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-extrabold leading-[1.15] tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
