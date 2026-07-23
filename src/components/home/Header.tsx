import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Home, Info, HeartHandshake, Mail, UserPlus, Menu, X,
  ChevronDown, BookOpen, Users, CalendarDays, HandHelping, CalendarCheck, MessageCircle,
} from "lucide-react";

type MegaItem = { icon: React.ComponentType<{ className?: string }>; title: string; desc: string };

const aboutItems: MegaItem[] = [
  { icon: BookOpen, title: "Historique", desc: "Nos racines, notre mission, notre vision." },
  { icon: Users, title: "Départements", desc: "Ministères, chorale, jeunesse, intercession." },
  { icon: CalendarDays, title: "Programmes", desc: "Cultes, séminaires, camps et retraites." },
];

const contactItems: MegaItem[] = [
  { icon: HandHelping, title: "Intercession", desc: "Confiez-nous vos sujets de prière." },
  { icon: CalendarCheck, title: "Rendez-vous pasteur", desc: "Prenez un temps avec un serviteur." },
  { icon: MessageCircle, title: "Contacter l'église", desc: "Une question, une demande ? Écrivez-nous." },
];

export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl instagram-animated text-white font-black">É</span>
          <span className="font-display text-lg font-bold tracking-tight">
            Église <span className="instagram-text">Nouvelle Vie</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavIcon icon={Home} label="Accueil" href="/" />
          <MegaNav
            icon={Info} label="À propos"
            items={aboutItems} open={open === "about"}
            onEnter={() => setOpen("about")} onLeave={() => setOpen(null as any)}
          />
          <NavIcon icon={HeartHandshake} label="Don" href="/don" />
          <MegaNav
            icon={Mail} label="Contact"
            items={contactItems} open={open === "contact"}
            onEnter={() => setOpen("contact")} onLeave={() => setOpen(null as any)}
          />
          <NavIcon icon={UserPlus} label="Inscription" href="/inscription" highlight />
        </nav>

        <button
          aria-label="Ouvrir le menu"
          className="grid h-10 w-10 place-items-center rounded-xl border border-border md:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-background md:hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-4">
            <span className="font-display text-lg font-bold">Menu</span>
            <button aria-label="Fermer" onClick={() => setMobileOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl border border-border">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-2 p-4">
            <MobileLink icon={Home} label="Accueil" href="/" onClick={() => setMobileOpen(false)} />
            <MobileGroup icon={Info} label="À propos" items={aboutItems} />
            <MobileLink icon={HeartHandshake} label="Don" href="/don" onClick={() => setMobileOpen(false)} />
            <MobileGroup icon={Mail} label="Contact" items={contactItems} />
            <MobileLink icon={UserPlus} label="Inscription" href="/inscription" onClick={() => setMobileOpen(false)} highlight />
          </div>
        </div>
      )}
    </header>
  );
}

function NavIcon({ icon: Icon, label, href, highlight }: { icon: any; label: string; href: string; highlight?: boolean }) {
  return (
    <Link
      to={href}
      className={`group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-muted ${
        highlight ? "instagram-animated text-white hover:opacity-90" : ""
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}

function MegaNav({
  icon: Icon, label, items, open, onEnter, onLeave,
}: { icon: any; label: string; items: MegaItem[]; open: boolean; onEnter: () => void; onLeave: () => void }) {
  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-muted">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-2 w-[380px] -translate-x-1/2 animate-fade-in">
          <div className="rounded-2xl border border-border bg-popover p-2 shadow-2xl">
            <div className="mb-2 rounded-xl instagram-gradient-soft px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {label} — accès rapide
            </div>
            <div className="grid gap-1">
              {items.map((it) => (
                <button key={it.title} className="flex items-start gap-3 rounded-xl p-3 text-left transition-all hover:bg-muted">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg instagram-animated text-white">
                    <it.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{it.title}</span>
                    <span className="block text-xs text-muted-foreground">{it.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileLink({ icon: Icon, label, href, onClick, highlight }: any) {
  return (
    <Link to={href} onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-base font-medium ${highlight ? "instagram-animated text-white border-transparent" : "bg-card"}`}>
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  );
}

function MobileGroup({ icon: Icon, label, items }: { icon: any; label: string; items: MegaItem[] }) {
  const [o, setO] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-card">
      <button onClick={() => setO(!o)} className="flex w-full items-center gap-3 px-4 py-3 text-base font-medium">
        <Icon className="h-5 w-5" />
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${o ? "rotate-180" : ""}`} />
      </button>
      {o && (
        <div className="grid gap-1 border-t border-border p-2">
          {items.map((it) => (
            <div key={it.title} className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md instagram-animated text-white">
                <it.icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{it.title}</span>
                <span className="block text-xs text-muted-foreground">{it.desc}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
