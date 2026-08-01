import type { ReactNode } from "react";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";

export function PageShell({
  eyebrow,
  title,
  intro,
  stats,
  children,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  stats?: { k: string; v: string }[];
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="relative overflow-hidden border-b border-border/60">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full instagram-animated opacity-25 blur-3xl" />
          <div className="absolute -right-20 top-10 h-72 w-72 rounded-full instagram-animated opacity-20 blur-3xl" />
          <svg className="absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden>
            <defs>
              <pattern id="shell-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#shell-grid)" />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="animate-fade-in text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">{eyebrow}</p>
          <h1 className="animate-fade-in mt-4 max-w-4xl text-4xl font-black leading-[1.05] sm:text-5xl md:text-6xl">{title}</h1>
          {intro && <p className="animate-fade-in mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">{intro}</p>}

          {stats && (
            <div className="mt-8 flex flex-wrap gap-3">
              {stats.map((s) => (
                <div key={s.v} className="rounded-2xl border border-border bg-card/60 px-4 py-3 backdrop-blur-xl">
                  <p className="font-display text-xl font-black instagram-text">{s.k}</p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.v}</p>
                </div>
              ))}
            </div>
          )}

          {aside}
        </div>
      </section>

      <main>{children}</main>
      <Footer />
    </div>
  );
}
