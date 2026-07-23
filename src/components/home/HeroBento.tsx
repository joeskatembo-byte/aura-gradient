import { useEffect, useState } from "react";
import { ArrowRight, Users, Calendar, Sparkles, Play } from "lucide-react";
import { verses, communityHero } from "@/data/mock";

export function HeroBento() {
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(0);
  const target = 2847;

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % verses.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let n = 0;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => {
      n = Math.min(target, n + step);
      setCount(n);
      if (n >= target) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, []);

  const v = verses[idx];

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full instagram-animated blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full instagram-animated blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="grid grid-cols-6 gap-3 sm:gap-4">
          {/* Main title tile */}
          <div className="col-span-6 md:col-span-4 md:row-span-2 rounded-3xl border border-border bg-card p-6 sm:p-10 relative overflow-hidden">
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3 w-3" /> Église Nouvelle Vie · Kinshasa, RDC
            </span>
            <h1 className="mt-5 font-display text-4xl font-black leading-[1.05] sm:text-6xl md:text-7xl">
              Bienvenue à<br />
              <span className="instagram-text">la Maison.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
              Une famille de foi. Une seule église, plusieurs nations. Venez tel que vous êtes — repartez transformé.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#actualites" className="inline-flex items-center gap-2 rounded-full instagram-animated px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:opacity-95">
                Rejoindre un culte <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#mediatheque" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold transition hover:bg-muted">
                <Play className="h-4 w-4" /> Voir en direct
              </a>
            </div>
          </div>

          {/* Verse tile */}
          <div className="col-span-6 md:col-span-2 rounded-3xl border border-border bg-card p-6 relative overflow-hidden min-h-[180px]">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Verset du jour</div>
            <div key={idx} className="mt-3 animate-fade-in">
              <p className="font-display text-lg font-semibold leading-snug">« {v.text} »</p>
              <p className="mt-2 text-sm instagram-text font-bold">— {v.ref}</p>
            </div>
            <div className="absolute bottom-4 right-4 flex gap-1">
              {verses.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 instagram-animated" : "w-1.5 bg-muted-foreground/30"}`} />
              ))}
            </div>
          </div>

          {/* Community photo */}
          <div className="col-span-6 md:col-span-2 rounded-3xl overflow-hidden relative min-h-[220px] group">
            <img src={communityHero} alt="Communauté en louange" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" width={1280} height={960} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Notre communauté</div>
              <div className="font-display text-xl font-bold">Une foi. Plusieurs visages.</div>
            </div>
          </div>

          {/* Counter */}
          <div className="col-span-3 md:col-span-2 rounded-3xl border border-border p-6 instagram-gradient-soft">
            <Users className="h-5 w-5 instagram-text" />
            <div className="mt-3 font-display text-3xl font-black sm:text-4xl">{count.toLocaleString("fr-FR")}<span className="instagram-text">+</span></div>
            <div className="mt-1 text-sm text-muted-foreground">Membres actifs dans la famille</div>
          </div>

          {/* Next event */}
          <div className="col-span-3 md:col-span-2 rounded-3xl border border-border bg-card p-6">
            <Calendar className="h-5 w-5 text-primary" />
            <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prochain grand rendez-vous</div>
            <div className="mt-1 font-display text-lg font-bold">Nuit d'intercession nationale</div>
            <div className="mt-1 text-sm text-muted-foreground">Vendredi 31 juillet · 20h00</div>
          </div>
        </div>
      </div>
    </section>
  );
}
