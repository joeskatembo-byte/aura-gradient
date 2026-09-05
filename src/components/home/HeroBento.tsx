import { useEffect, useState } from "react";
import { ArrowRight, Users, Calendar, Sparkles, Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { verses as mockVerses, communityHero } from "@/data/mock";
import { Typed } from "@/components/shared/Typed";

type Hero = {
  badge: string; title_line1: string; title_line2: string; typed_phrases: string;
  primary_label: string; primary_href: string; secondary_label: string; secondary_href: string;
  community_title: string; community_subtitle: string; community_image_url: string | null;
  members_count: number; members_label: string; event_title: string; event_detail: string;
};

const fallbackHero: Hero = {
  badge: "Église Nouvelle Vie · Kinshasa, RDC",
  title_line1: "Bienvenue à",
  title_line2: "la Maison.",
  typed_phrases: [
    "Une famille de foi. Une seule église, plusieurs nations.",
    "Venez tel que vous êtes — repartez transformé.",
    "Une maison où chacun trouve sa place et sa destinée.",
    "Adorer, grandir, servir : ensemble, au cœur de Kinshasa.",
  ].join("|"),
  primary_label: "Rejoindre un culte",
  primary_href: "#actualites",
  secondary_label: "Voir en direct",
  secondary_href: "#mediatheque",
  community_title: "Une foi. Plusieurs visages.",
  community_subtitle: "Chaque dimanche, une famille qui loue ensemble.",
  community_image_url: null,
  members_count: 2847,
  members_label: "Membres actifs dans la famille",
  event_title: "Nuit d'intercession nationale",
  event_detail: "Vendredi 31 juillet · 20h00",
};

export function HeroBento() {
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(0);

  const { data: dbHero } = useQuery({
    queryKey: ["hero_content"],
    queryFn: async () => {
      const db = supabase as unknown as SupabaseClient;
      const { data, error } = await db
        .from("hero_content")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data as Hero | null) ?? null;
    },
  });

  const hero = dbHero ?? fallbackHero;
  const target = hero.members_count || 0;
  const phrases = hero.typed_phrases.split("|").map((s) => s.trim()).filter(Boolean);

  const { data: dbVerses } = useQuery({
    queryKey: ["bible_verses", "home"],
    queryFn: async () => {
      const db = supabase as unknown as SupabaseClient;
      const { data, error } = await db
        .from("bible_verses")
        .select("*")
        .eq("active", true)
        .order("position", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((r) => ({ ref: String((r as Record<string, unknown>)["reference"]), text: String((r as Record<string, unknown>)["text"]) }));
    },
  });

  const verses = dbVerses && dbVerses.length > 0 ? dbVerses : mockVerses;

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % verses.length), 5000);
    return () => clearInterval(t);
  }, [verses.length]);

  useEffect(() => {
    if (target <= 0) { setCount(0); return; }
    let n = 0;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => {
      n = Math.min(target, n + step);
      setCount(n);
      if (n >= target) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [target]);

  const v = verses[idx % verses.length];

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full instagram-animated blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full instagram-animated blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="grid grid-cols-6 gap-3 sm:gap-4">
          {/* Main title tile */}
          <div className="col-span-6 md:col-span-4 md:row-span-2 card-lift rounded-3xl border border-border bg-card p-6 sm:p-10 relative overflow-hidden">
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3 w-3" /> {hero.badge}
            </span>
            <h1 className="mt-5 font-display text-4xl font-black leading-[1.05] sm:text-6xl md:text-7xl">
              {hero.title_line1}<br />
              <span className="instagram-text">{hero.title_line2}</span>
            </h1>
            <p className="mt-5 min-h-[3.5rem] max-w-lg text-base text-muted-foreground sm:text-lg">
              <Typed items={phrases.length ? phrases : fallbackHero.typed_phrases.split("|")} />
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={hero.primary_href || "#"} className="inline-flex items-center gap-2 rounded-full instagram-animated px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:opacity-95">
                {hero.primary_label} <ArrowRight className="h-4 w-4" />
              </a>
              <a href={hero.secondary_href || "#"} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold transition hover:bg-muted">
                <Play className="h-4 w-4" /> {hero.secondary_label}
              </a>
            </div>
          </div>

          {/* Verse tile */}
          <div className="col-span-6 md:col-span-2 card-lift rounded-3xl border border-border bg-card p-6 relative overflow-hidden min-h-[180px]">
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
          <div className="col-span-6 md:col-span-2 rounded-3xl overflow-hidden relative min-h-[220px] group border border-border shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
            <img
              src={hero.community_image_url || communityHero}
              alt="Communauté en louange"
              className="absolute inset-0 h-full w-full object-cover animate-kenburns group-hover:animate-none group-hover:scale-110 transition-transform duration-700"
              width={1280}
              height={960}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/80" />

            {/* Balayage lumineux au survol */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
            />

            {/* Liseré dégradé animé en bas */}
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 instagram-animated opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Halo pulsant derrière le texte */}
            <div aria-hidden className="absolute bottom-0 left-0 h-24 w-24 rounded-full instagram-animated opacity-20 blur-2xl animate-pulse" />

            <div className="absolute bottom-4 left-4 right-4 text-white transition-transform duration-500 group-hover:-translate-y-1.5">
              <div className="text-xs font-semibold uppercase tracking-wider opacity-80 transition-opacity duration-500 group-hover:opacity-100">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle mr-2 animate-pulse" />
                Notre communauté
              </div>
              <div className="font-display text-xl font-bold">Une foi. Plusieurs visages.</div>
              <div className="mt-1 max-h-0 overflow-hidden text-sm text-white/85 opacity-0 transition-all duration-500 group-hover:max-h-10 group-hover:opacity-100">
                Chaque dimanche, une famille qui loue ensemble.
              </div>
            </div>
          </div>

          {/* Counter */}
          <div className="col-span-3 md:col-span-2 card-lift rounded-3xl border border-border p-6 instagram-gradient-soft">
            <Users className="h-5 w-5 instagram-text" />
            <div className="mt-3 font-display text-3xl font-black sm:text-4xl">{count.toLocaleString("fr-FR")}<span className="instagram-text">+</span></div>
            <div className="mt-1 text-sm text-muted-foreground">Membres actifs dans la famille</div>
          </div>

          {/* Next event */}
          <div className="col-span-3 md:col-span-2 card-lift rounded-3xl border border-border bg-card p-6">
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
