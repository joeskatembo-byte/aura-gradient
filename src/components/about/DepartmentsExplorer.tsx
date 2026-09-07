import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { departments as fallbackDepartments, type Department } from "@/data/about";
import { useReveal } from "@/hooks/useReveal";
import { supabase } from "@/integrations/supabase/client";
import {
  Music, Users, HandHeart, Megaphone, Heart, Star, Clock, Phone, AlertTriangle, CalendarDays, Target, Compass,
} from "lucide-react";
import { Typed } from "@/components/shared/Typed";

const icons = { music: Music, users: Users, hands: HandHeart, megaphone: Megaphone, heart: Heart, star: Star };

type DepartmentRow = {
  name: string;
  slug: string;
  tagline: string | null;
  vision: string | null;
  mission: string | null;
  lead_name: string | null;
  contact_phone: string | null;
  usual_schedule: string | null;
  urgent_schedule: string | null;
  news: string | null;
  tone: string;
  icon: string;
};

function useDepartments(): Department[] {
  const { data } = useQuery({
    queryKey: ["departments", "public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("name, slug, tagline, vision, mission, lead_name, contact_phone, usual_schedule, urgent_schedule, news, tone, icon")
        .order("name");
      if (error) throw error;
      return (data ?? []) as unknown as DepartmentRow[];
    },
  });

  if (data && data.length > 0) {
    return data.map((d) => ({
      slug: d.slug,
      name: d.name,
      tagline: d.tagline ?? "",
      vision: d.vision ?? "",
      mission: d.mission ?? "",
      lead: d.lead_name ?? "",
      contact: d.contact_phone ?? "",
      hours: (d.usual_schedule ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [day = line, time = "", place = ""] = line.split("·").map((s) => s.trim());
          return { day, time, place };
        }),
      urgent: d.urgent_schedule ?? undefined,
      news: d.news ?? "",
      tone: d.tone,
      icon: d.icon,
    }));
  }
  return fallbackDepartments;
}

export function DepartmentsExplorer() {
  const departments = useDepartments();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const active = departments.find((d) => d.slug === activeSlug) ?? departments[0];
  const { ref, visible } = useReveal<HTMLDivElement>(0.1);

  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-10 max-w-2xl">
          <span className="inline-block rounded-full instagram-gradient-soft px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Départements
          </span>
          <h2 className="mt-4 text-3xl font-black sm:text-4xl md:text-5xl">
            Quatorze équipes, <span className="instagram-text">une seule maison</span>
          </h2>
          <p className="mt-3 min-h-[3rem] text-muted-foreground">
            <Typed items={[
              "Choisissez un département pour voir sa vision, ses horaires, ses responsables et ses actualités.",
              "Quatorze équipes, une seule mission : servir.",
              "Trouvez le service où votre don portera du fruit.",
            ]} />
          </p>
        </header>

        {/* Selector */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {departments.map((d) => {
            const Icon = icons[d.icon as keyof typeof icons] ?? Users;
            const isActive = d.slug === activeSlug;
            return (
              <button
                key={d.slug}
                onClick={() => setActiveSlug(d.slug)}
                className={`group flex min-w-0 flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all duration-300 ${
                  isActive
                    ? "border-transparent bg-card shadow-xl ring-1 ring-primary/30"
                    : "border-border/70 bg-card/40 hover:-translate-y-0.5 hover:bg-card"
                }`}
              >
                <span
                  className={`grid h-10 w-10 place-items-center rounded-xl text-white transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? "instagram-animated" : `bg-gradient-to-br ${d.tone}`
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-bold leading-tight">{d.name}</span>
              </button>
            );
          })}
        </div>

        <div
          ref={ref}
          className={`transition-all duration-500 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          <DepartmentPanel key={active.slug} dept={active} />
        </div>
      </div>
    </section>
  );
}

function DepartmentPanel({ dept }: { dept: Department }) {
  const Icon = icons[dept.icon as keyof typeof icons] ?? Users;

  return (
    <div className="animate-fade-in overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
      <div className={`relative overflow-hidden bg-gradient-to-r ${dept.tone} px-6 py-8 sm:px-10 sm:py-10`}>
        <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
        <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/20 text-white backdrop-blur-md">
            <Icon className="h-7 w-7" />
          </span>
          <div className="min-w-0 text-white">
            <h3 className="truncate text-2xl font-black sm:text-3xl">{dept.name}</h3>
            <p className="truncate text-sm text-white/85">{dept.tagline}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 sm:p-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <InfoBlock icon={Compass} title="Vision" text={dept.vision} />
          <InfoBlock icon={Target} title="Mission" text={dept.mission} />

          {dept.hours.length > 0 && (
            <div className="rounded-2xl border border-border p-5">
              <h4 className="mb-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" /> Horaires habituels
              </h4>
              <ul className="grid gap-2 sm:grid-cols-2">
                {dept.hours.map((h) => (
                  <li
                    key={h.day + h.time}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl instagram-gradient-soft px-4 py-3"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{h.day}</span>
                      {h.place && <span className="block truncate text-xs text-muted-foreground">{h.place}</span>}
                    </span>
                    {h.time && <span className="shrink-0 text-sm font-bold tabular-nums">{h.time}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {(dept.lead || dept.contact) && (
            <div className="rounded-2xl border border-border p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Responsable</p>
              {dept.lead && <p className="mt-1 font-bold">{dept.lead}</p>}
              {dept.contact && (
                <a
                  href={`tel:${dept.contact.replace(/\s/g, "")}`}
                  className="mt-3 inline-flex items-center gap-2 rounded-full instagram-animated px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
                >
                  <Phone className="h-4 w-4" /> {dept.contact}
                </a>
              )}
            </div>
          )}

          {dept.urgent && (
            <div className="rounded-2xl border border-accent/40 bg-accent/10 p-5">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
                <AlertTriangle className="h-4 w-4" /> Horaire urgent
              </p>
              <p className="mt-2 text-sm">{dept.urgent}</p>
            </div>
          )}

          <div className="rounded-2xl border border-border p-5">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <CalendarDays className="h-4 w-4 text-primary" /> Actualité
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{dept.news}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border p-5">
      <h4 className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" /> {title}
      </h4>
      <p className="mt-2 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
