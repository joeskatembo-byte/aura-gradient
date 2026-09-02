import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { BarChart3, BookOpenText, CalendarDays, Film, History, Inbox, LogOut, Megaphone, Users, Wallet, ShieldAlert } from "lucide-react";

import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — Église Nouvelle Vie" },
      { name: "description", content: "Espace de gestion réservé aux bergers et chefs de département : fidèles, départements, programmes, médiathèque et finances." },
      { property: "og:title", content: "Tableau de bord — Église Nouvelle Vie" },
      { property: "og:description", content: "Gestion des fidèles, départements, programmes, médiathèque et finances de l'église." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const tabs = [
  { to: "/admin", label: "Fidèles", icon: Users, exact: true },
  { to: "/admin/actualites", label: "Actualités", icon: Megaphone, exact: false },
  { to: "/admin/departements", label: "Départements", icon: BarChart3, exact: false },
  { to: "/admin/programmes", label: "Programmes", icon: CalendarDays, exact: false },
  { to: "/admin/mediatheque", label: "Médiathèque", icon: Film, exact: false },
  { to: "/admin/meditations", label: "À méditer", icon: BookOpenText, exact: false },
  { to: "/admin/frise", label: "Frise", icon: History, exact: false },

  { to: "/admin/messages", label: "Messages & requêtes", icon: Inbox, exact: false },
  { to: "/admin/finances", label: "Finances", icon: Wallet, exact: false },
] as const;

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { loading, userId, isAdmin, isLeader, profile, signOut } = useAuth();
  const allowed = isAdmin || isLeader;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="relative overflow-hidden border-b border-border/60">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full instagram-animated opacity-25 blur-3xl" />
          <div className="absolute -right-16 top-6 h-64 w-64 rounded-full instagram-animated opacity-20 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Administration</p>
            {userId && (
              <button
                onClick={() => void signOut()}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-5 py-2.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-muted"
              >
                <LogOut className="h-4 w-4" /> Se déconnecter
              </button>
            )}
          </div>
          <h1 className="mt-3 max-w-3xl text-3xl font-black leading-[1.05] sm:text-5xl">
            Le poste de <span className="instagram-text">pilotage</span> de la maison.
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {profile ? `Connecté en tant que ${profile.first_name} ${profile.last_name}.` : "Espace réservé aux responsables."} Gérez les fidèles, les départements, les programmes, la médiathèque et les finances.
          </p>
        </div>

      </section>

      {allowed && (
        <nav className="sticky top-16 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-1 px-3 py-2 sm:justify-start sm:px-6">
            {tabs.map((t) => {
              const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  title={t.label}
                  className={`inline-flex min-w-0 items-center gap-1.5 rounded-full px-2.5 py-2 text-[13px] font-semibold transition-colors sm:gap-2 sm:px-4 sm:text-sm ${
                    active ? "instagram-animated text-white shadow-lg" : "hover:bg-muted"
                  }`}
                >
                  <t.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{t.label}</span>
                </Link>
              );
            })}
          </div>

        </nav>
      )}

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {loading ? (
          <p className="py-16 text-sm text-muted-foreground">Vérification de vos droits…</p>
        ) : !userId ? (
          <div className="rounded-3xl border border-border bg-card p-8 text-center">
            <ShieldAlert className="mx-auto h-8 w-8 instagram-text" />
            <p className="mt-3 font-display text-xl font-black">Connexion requise</p>
            <Link to="/connexion" className="mt-5 inline-flex rounded-full instagram-animated px-6 py-3 text-sm font-bold text-white shadow-lg">Se connecter</Link>
          </div>
        ) : !allowed ? (
          <div className="rounded-3xl border border-border bg-card p-8 text-center">
            <ShieldAlert className="mx-auto h-8 w-8 instagram-text" />
            <p className="mt-3 font-display text-xl font-black">Accès réservé aux responsables</p>
            <p className="mt-2 text-sm text-muted-foreground">Seuls les bergers et chefs de département accèdent à cet espace.</p>
            <Link to="/profil" className="mt-5 inline-flex rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-muted">Retour à mon espace</Link>
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      <Footer />
    </div>
  );
}
