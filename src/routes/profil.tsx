import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Pencil, ShieldCheck, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/shared/PageShell";
import { StepForm, type FormValues } from "@/components/shared/StepForm";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/slug";


export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Mon espace membre — Église Nouvelle Vie" },
      { name: "description", content: "Consultez vos informations de membre, votre département de service et l'historique de vos demandes auprès de l'église." },
      { property: "og:title", content: "Mon espace membre — Église Nouvelle Vie" },
      { property: "og:description", content: "Vos informations, votre département et vos demandes en un seul endroit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilPage,
});

function ProfilPage() {
  const { profile, userId, loading, isAdmin, isLeader, signOut } = useAuth();

  const { data: department } = useQuery({
    queryKey: ["department", profile?.department_id],
    enabled: !!profile?.department_id,
    queryFn: async () => {
      const { data, error } = await supabase.from("departments").select("*").eq("id", profile!.department_id!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (!loading && !userId) {
    return (
      <PageShell eyebrow="Espace membre" title={<>Connexion <span className="instagram-text">requise</span>.</>} intro="Identifiez-vous avec vos nom, prénom et mot de passe pour accéder à votre espace.">
        <section className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
          <Link to="/connexion" className="inline-flex rounded-full instagram-animated px-6 py-3 text-sm font-bold text-white shadow-lg">
            Se connecter
          </Link>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Espace membre"
      title={
        <>
          Bonjour <span className="instagram-text">{profile?.first_name ?? "cher membre"}</span>.
        </>
      }
      intro="Voici vos informations telles qu'elles apparaissent au secrétariat de l'église."
    >
      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
          <h2 className="font-display text-xl font-black">Mes informations</h2>
          <dl className="mt-5 grid gap-3 text-sm">
            {[
              ["Nom complet", `${profile?.last_name ?? ""} ${profile?.first_name ?? ""}`.trim()],
              ["Téléphone", profile?.phone ?? "—"],
              ["Commune", profile?.commune ?? "—"],
              ["Avenue / parcelle", [profile?.avenue, profile?.parcelle].filter(Boolean).join(" · ") || "—"],
              ["État civil", profile?.marital_status ?? "—"],
              ["Enfants", String(profile?.children_count ?? 0)],
              ["Contact d'urgence", profile?.emergency_contact ?? "—"],
              ["Membre depuis", formatDate(profile?.created_at) || "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-border/60 pb-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="grid gap-6">
          <div className="rounded-3xl border border-transparent instagram-gradient-soft p-6 shadow-xl sm:p-8">
            <h2 className="font-display text-xl font-black">Mon département</h2>
            {department ? (
              <>
                <p className="mt-3 text-lg font-bold instagram-text">{department.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">{department.mission}</p>
                <p className="mt-4 text-sm"><span className="font-semibold">Horaire habituel :</span> {department.usual_schedule}</p>
              </>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Vous n'êtes rattaché à aucun département pour le moment. Parlez-en au secrétariat.</p>
            )}
          </div>

          {(isAdmin || isLeader) && (
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest instagram-text">
                <ShieldCheck className="h-4 w-4" /> {isAdmin ? "Berger" : "Chef de département"}
              </span>
              <p className="mt-2 text-sm text-muted-foreground">Vous disposez de droits de gestion sur la plateforme.</p>
              <Link to="/admin" className="mt-4 inline-flex rounded-full instagram-animated px-6 py-3 text-sm font-bold text-white shadow-lg">
                Ouvrir le tableau de bord
              </Link>
            </div>
          )}

          <button
            onClick={() => signOut()}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-muted"
          >
            <LogOut className="h-4 w-4" /> Se déconnecter
          </button>
        </div>
      </section>
    </PageShell>
  );
}
