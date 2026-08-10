import { useEffect, useState } from "react";
import { leaders, type Leader } from "@/data/about";
import { useReveal } from "@/hooks/useReveal";
import { Quote, X, BadgeCheck } from "lucide-react";

export function LeadershipCards() {
  const [openLeader, setOpenLeader] = useState<Leader | null>(null);

  useEffect(() => {
    if (!openLeader) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenLeader(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openLeader]);

  return (
    <section id="leadership" className="relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full instagram-animated opacity-20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full instagram-animated opacity-15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-12 max-w-2xl">
          <span className="inline-block rounded-full instagram-gradient-soft px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Leadership
          </span>
          <h2 className="mt-4 text-3xl font-black sm:text-4xl md:text-5xl">
            Des visages, <span className="instagram-text">pas un annuaire</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Cliquez sur une carte pour lire la biographie complète et la citation du serviteur.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {leaders.map((l, i) => (
            <LeaderCard key={l.name} leader={l} index={i} onOpen={() => setOpenLeader(l)} />
          ))}
        </div>
      </div>

      {openLeader && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={openLeader.name}
          className="fixed inset-0 z-[80] grid place-items-center bg-foreground/50 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpenLeader(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card/90 p-6 shadow-2xl backdrop-blur-xl animate-scale-in sm:p-8"
          >
            <div aria-hidden className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${openLeader.tone}`} />
            <button
              onClick={() => setOpenLeader(null)}
              aria-label="Fermer"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-border bg-background/70 transition-colors hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex min-w-0 items-center gap-4">
              <span
                className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${openLeader.tone} font-display text-xl font-black text-white`}
              >
                {openLeader.initials}
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-xl font-black">{openLeader.name}</h3>
                <p className="truncate text-sm text-muted-foreground">{openLeader.role}</p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{openLeader.bio}</p>

            <blockquote className="mt-5 rounded-2xl instagram-gradient-soft p-4">
              <Quote className="mb-2 h-4 w-4 text-primary" />
              <p className="text-sm font-medium italic">« {openLeader.quote} »</p>
            </blockquote>

            <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <BadgeCheck className="h-4 w-4 text-primary" /> {openLeader.since}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function LeaderCard({ leader, index, onOpen }: { leader: Leader; index: number; onOpen: () => void }) {
  const { ref, visible } = useReveal<HTMLButtonElement>(0.2);

  return (
    <button
      ref={ref}
      onClick={onOpen}
      style={{ transitionDelay: `${index * 70}ms` }}
      className={`card-lift group relative overflow-hidden rounded-3xl border border-border/60 bg-card/50 p-6 text-left backdrop-blur-xl transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div aria-hidden className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${leader.tone}`} />
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${leader.tone} opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40`}
      />

      <span
        className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${leader.tone} font-display text-lg font-black text-white transition-transform duration-500 group-hover:scale-110`}
      >
        {leader.initials}
      </span>

      <h3 className="mt-4 text-lg font-bold leading-snug">{leader.name}</h3>
      <p className="mt-1 text-sm font-medium text-primary">{leader.role}</p>
      <p className="mt-3 text-sm text-muted-foreground">{leader.short}</p>

      <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-foreground">
        Lire la biographie →
      </span>
    </button>
  );
}
