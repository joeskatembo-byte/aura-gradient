import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { weekProgram, upcomingWeeks } from "@/data/about";
import { useReveal } from "@/hooks/useReveal";
import { supabase } from "@/integrations/supabase/client";
import { Clock, MapPin, CalendarRange, Sparkles } from "lucide-react";
import { Typed } from "@/components/shared/Typed";

const db = supabase as unknown as SupabaseClient;

type UpcomingEvent = { id: string; date_label: string; title: string; detail: string; tone: string };

function useUpcomingEvents(): { date: string; title: string; detail: string; tone: string }[] {
  const { data } = useQuery({
    queryKey: ["upcoming_events"],
    queryFn: async () => {
      const { data, error } = await db
        .from("upcoming_events")
        .select("id, date_label, title, detail, tone")
        .eq("active", true)
        .order("position");
      if (error) throw error;
      return (data ?? []) as unknown as UpcomingEvent[];
    },
  });
  if (data && data.length > 0) {
    return data.map((e) => ({ date: e.date_label, title: e.title, detail: e.detail, tone: e.tone }));
  }
  return upcomingWeeks;
}

const todayIndex = () => {
  const js = new Date().getDay(); // 0 = dimanche
  return js === 0 ? 6 : js - 1;
};

export function ProgramsSchedule() {
  const [day, setDay] = useState(todayIndex);
  const active = weekProgram[day];

  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full instagram-gradient-soft px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Programmes
          </span>
          <h2 className="mt-4 text-3xl font-black sm:text-4xl md:text-5xl">
            Chaque jour a <span className="instagram-text">son rendez-vous</span>
          </h2>
          <p className="mt-3 min-h-[3rem] text-muted-foreground">
            <Typed items={[
              "Horaires des cultes et des départements, jour par jour, plus les semaines à venir.",
              "Un rendez-vous pour chaque jour de la semaine.",
              "Répétitions, intercession, école du dimanche et veillées.",
            ]} />
          </p>
        </header>

        {/* Day selector */}
        <div className="mb-8 grid grid-cols-4 gap-2 sm:grid-cols-7">
          {weekProgram.map((p, i) => {
            const isActive = i === day;
            const isToday = i === todayIndex();
            return (
              <button
                key={p.day}
                onClick={() => setDay(i)}
                className={`relative min-w-0 rounded-2xl border px-2 py-3 text-center transition-all duration-300 sm:px-3 ${
                  isActive
                    ? "border-transparent instagram-animated text-white shadow-xl"
                    : "border-border/70 bg-card/40 hover:-translate-y-0.5 hover:bg-card"
                }`}
              >
                <span className="block text-xs font-semibold uppercase tracking-widest opacity-80 sm:hidden">
                  {p.short}
                </span>
                <span className="hidden text-sm font-bold sm:block">{p.day}</span>
                <span className="mt-1 block text-[11px] opacity-80">{p.items.length} activités</span>
                {isToday && (
                  <span
                    aria-label="Aujourd'hui"
                    className={`absolute right-2 top-2 h-2 w-2 rounded-full ${isActive ? "bg-white" : "bg-accent"} animate-pulse`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Timeline of the selected day */}
        <div key={active.day} className="animate-fade-in grid gap-3">
          {active.items.map((it, i) => (
            <article
              key={it.time + it.title}
              style={{ animationDelay: `${i * 80}ms` }}
              className="group animate-fade-in grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:gap-6 sm:p-5"
            >
              <span className="grid shrink-0 place-items-center rounded-xl instagram-gradient-soft px-3 py-2">
                <Clock className="mb-1 h-4 w-4 text-primary" />
                <span className="text-sm font-black tabular-nums">{it.time}</span>
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold sm:text-lg">{it.title}</h3>
                  {it.tag && (
                    <span className="rounded-full instagram-animated px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                      {it.tag}
                    </span>
                  )}
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="truncate">{it.dept}</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {it.place}
                  </span>
                </p>
              </div>
            </article>
          ))}
        </div>

        <UpcomingWeeks />
      </div>
    </section>
  );
}

function UpcomingWeeks() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.15);
  const weeks = useUpcomingEvents();

  return (
    <div ref={ref} className="mt-16">
      <h3 className="mb-6 inline-flex items-center gap-2 text-xl font-black sm:text-2xl">
        <CalendarRange className="h-5 w-5 text-primary" /> Les semaines à venir
      </h3>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {upcomingWeeks.map((w, i) => (
          <article
            key={w.title}
            style={{ transitionDelay: `${i * 80}ms` }}
            className={`card-lift relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl transition-all duration-500 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div aria-hidden className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${w.tone}`} />
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{w.date}</p>
            <h4 className="mt-2 text-lg font-bold leading-snug">{w.title}</h4>
            <p className="mt-2 text-sm text-muted-foreground">{w.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
