import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/shared/PageShell";
import { slugify, loginEmailFromSlug } from "@/lib/slug";

export const Route = createFileRoute("/connexion")({
  head: () => ({
    meta: [
      { title: "Connexion membre — Église Nouvelle Vie" },
      { name: "description", content: "Connectez-vous avec votre nom, votre prénom et votre mot de passe pour accéder à votre espace membre, vos demandes et votre département." },
      { property: "og:title", content: "Connexion membre — Église Nouvelle Vie" },
      { property: "og:description", content: "Accédez à votre espace membre de l'Église Nouvelle Vie." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConnexionPage,
});

function ConnexionPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ last: "", first: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loginSlug = `${slugify(form.last)}.${slugify(form.first)}`;

    let email = loginEmailFromSlug(loginSlug);
    const { data: resolved } = await supabase.rpc("resolve_login", { _name: loginSlug });
    if (typeof resolved === "string" && resolved.includes("@")) email = resolved;

    const { error } = await supabase.auth.signInWithPassword({ email, password: form.password });
    setLoading(false);
    if (error) {
      toast.error("Nom, prénom ou mot de passe incorrect.");
      return;
    }
    toast.success("Content de vous revoir !");
    navigate({ to: "/profil" });
  };

  const input =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-ring";

  return (
    <PageShell
      eyebrow="Connexion"
      title={
        <>
          Content de vous <span className="instagram-text">revoir</span>.
        </>
      }
      intro="Pas d'adresse e-mail à retenir : vos nom et prénom suffisent, comme au secrétariat."
    >
      <section className="mx-auto max-w-md px-4 py-14 sm:px-6 sm:py-20">
        <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
          <div aria-hidden className="mb-6 h-1.5 rounded-full instagram-animated" />
          <div className="grid gap-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nom</span>
              <input required value={form.last} onChange={(e) => setForm({ ...form, last: e.target.value })} className={input} placeholder="Kabasele" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prénom</span>
              <input required value={form.first} onChange={(e) => setForm({ ...form, first: e.target.value })} className={input} placeholder="Grâce" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mot de passe</span>
              <div className="relative">
                <input required type={showPwd ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={`${input} pr-12`} />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full instagram-animated px-6 py-3 text-sm font-bold text-white shadow-lg disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />} Se connecter
          </button>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Pas encore membre ?{" "}
            <Link to="/inscription" className="font-semibold instagram-text">
              S'inscrire
            </Link>
          </p>
        </form>
      </section>
    </PageShell>
  );
}
