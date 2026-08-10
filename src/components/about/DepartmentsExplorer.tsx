import { useState } from "react";
import { departments, type Department } from "@/data/about";
import { useReveal } from "@/hooks/useReveal";
import {
import { Typed } from "@/components/shared/Typed";
  Music, Users, HandHeart, Megaphone, Heart, Star, Clock, Phone, AlertTriangle, CalendarDays, Target, Compass,
} from "lucide-react";

const icons = { music: Music, users: Users, hands: HandHeart, megaphone: Megaphone, heart: Heart, star: Star };

export function DepartmentsExplorer() {
  const [activeSlug, setActiveSlug] = useState(departments[0].slug);
  const active = departments.find((d) => d.slug === activeSlug)!;
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
        <div className="no-scrollbar -mx-4 mb-8 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6">
          {departments.map((d) => {
            const Icon = icons[d.icon as keyof typeof icons];
            const isActive = d.slug === activeSlug;
            return (
              <button
                key={d.slug}
                onClick={() => setActiveSlug(d.slug)}
                className={`group flex min-w-[150px] shrink-0 snap-start flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all duration-300 sm:min-w-0 ${
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
  const Icon = icons[dept.icon as keyof typeof icons];

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
                    <span className="block truncate text-xs text-muted-foreground">{h.place}</span>
                  </span>
                  <span className="shrink-0 text-sm font-bold tabular-nums">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Responsable</p>
            <p className="mt-1 font-bold">{dept.lead}</p>
            <a
              href={`tel:${dept.contact.replace(/\s/g, "")}`}
              className="mt-3 inline-flex items-center gap-2 rounded-full instagram-animated px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              <Phone className="h-4 w-4" /> {dept.contact}
            </a>
          </div>

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
