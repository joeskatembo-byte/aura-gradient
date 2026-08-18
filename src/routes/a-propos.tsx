import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { BookOpen, Users, CalendarDays } from "lucide-react";

export const Route = createFileRoute("/a-propos")({
  component: AboutLayout,
});

const tabs = [
  { to: "/a-propos", label: "Histoire", icon: BookOpen, exact: true },
  { to: "/a-propos/departements", label: "Départements", icon: Users, exact: false },
  { to: "/a-propos/programmes", label: "Programmes", icon: CalendarDays, exact: false },
] as const;

function AboutLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero — vecteurs uniquement, zéro image lourde */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full instagram-animated opacity-25 blur-3xl" />
          <div className="absolute -right-20 top-10 h-72 w-72 rounded-full instagram-animated opacity-20 blur-3xl" />
          <svg className="absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden>
            <defs>
              <pattern id="about-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#about-grid)" />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="animate-fade-in text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
            À propos
          </p>
          <h1 className="animate-fade-in mt-4 max-w-4xl text-4xl font-black leading-[1.05] sm:text-5xl md:text-7xl">
            Une maison bâtie sur la <span className="instagram-text">foi</span>, portée par des{" "}
            <span className="instagram-text">hommes et des femmes</span>.
          </h1>
          <p className="animate-fade-in mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Depuis 1998 à Kinshasa, l'Église Nouvelle Vie sert Dieu et sa communauté avec rigueur,
            hospitalité et excellence. Découvrez notre histoire, nos équipes et nos programmes.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { k: "9 200+", v: "fidèles" },
              { k: "14", v: "départements" },
              { k: "7", v: "implantations" },
              { k: "28", v: "ans de service" },
            ].map((s) => (
              <div key={s.v} className="rounded-2xl border border-border bg-card/60 px-4 py-3 backdrop-blur-xl">
                <p className="font-display text-xl font-black instagram-text">{s.k}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sous-navigation */}
        <div className="sticky top-16 z-40 border-t border-border/60 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2 px-4 py-3 sm:justify-start sm:px-6">
            {tabs.map((t) => {
              const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all sm:gap-2 sm:px-4 sm:text-sm ${
                    active
                      ? "instagram-animated text-white shadow-lg"
                      : "border border-border bg-card/50 hover:bg-muted"
                  }`}
                >

                  <t.icon className="h-4 w-4" />
                  {t.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
