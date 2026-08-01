import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/shared/PageShell";
import { StepForm, type FormValues } from "@/components/shared/StepForm";
import { communesKinshasa, maritalStatuses } from "@/data/forms";
import { slugify, loginEmailFromSlug } from "@/lib/slug";

export const Route = createFileRoute("/inscription")({
  head: () => ({
    meta: [
      { title: "Devenir membre — Inscription | Église Nouvelle Vie" },
      { name: "description", content: "Rejoignez la famille en quatre étapes : identité, adresse à Kinshasa, vie de famille et département de service. Votre compte membre en deux minutes." },
      { property: "og:title", content: "Devenir membre — Inscription | Église Nouvelle Vie" },
      { property: "og:description", content: "Créez votre compte membre et rejoignez un département de service." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InscriptionPage,
});

function InscriptionPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("departments").select("id, name").order("name");
      if (error) throw error;
      return data;
    },
  });

  const submit = async () => {
    const first = String(values.first_name ?? "").trim();
    const last = String(values.last_name ?? "").trim();
    const password = String(values.password ?? "");
    if (password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== String(values.password2 ?? "")) {
      toast.error("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setSubmitting(true);
    const firstSlug = slugify(first);
    const lastSlug = slugify(last);
    const loginSlug = `${lastSlug}.${firstSlug}`;
    const email = loginEmailFromSlug(loginSlug);

    const { data: auth, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/profil` },
    });

    if (error) {
      setSubmitting(false);
      toast.error(
        error.message.toLowerCase().includes("already")
          ? "Un compte existe déjà avec ces noms. Essayez de vous connecter."
          : "Inscription impossible : " + error.message,
      );
      return;
    }

    const uid = auth.user?.id;
    if (uid) {
      const { error: pErr } = await supabase.from("profiles").upsert({
        id: uid,
        first_name: first,
        last_name: last,
        first_slug: firstSlug,
        last_slug: lastSlug,
        login_slug: loginSlug,
        login_email: email,
        commune: String(values.commune ?? "") || null,
        avenue: String(values.avenue ?? "") || null,
        parcelle: String(values.parcelle ?? "") || null,
        marital_status: String(values.marital_status ?? "") || null,
        children_count: Number(values.children_count ?? 0) || 0,
        phone: String(values.phone ?? "") || null,
        emergency_contact: String(values.emergency_contact ?? "") || null,
        birth_date: String(values.birth_date ?? "") || null,
        department_id: String(values.department_id ?? "") || null,
      });
      if (pErr) toast.error("Compte créé, mais le profil n'a pas pu être enregistré : " + pErr.message);

      await supabase.from("user_roles").insert({ user_id: uid, role: "fidele" });
    }

    setSubmitting(false);
    setSuccess(true);
    toast.success("Bienvenue dans la maison !");
    setTimeout(() => navigate({ to: "/profil" }), 1600);
  };

  return (
    <PageShell
      eyebrow="Inscription"
      title={
        <>
          Vous n'êtes plus un <span className="instagram-text">visiteur</span>, vous êtes de la{" "}
          <span className="instagram-text">famille</span>.
        </>
      }
      intro="Quatre étapes suffisent. Vos informations restent confidentielles et servent uniquement à l'accompagnement pastoral et à la vie des départements."
    >
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-10">
          <StepForm
            steps={[
              {
                title: "Identité",
                subtitle: "Vos noms serviront aussi d'identifiant de connexion.",
                fields: [
                  { name: "last_name", label: "Nom", required: true, placeholder: "Kabasele" },
                  { name: "first_name", label: "Prénom", required: true, placeholder: "Grâce" },
                  { name: "birth_date", label: "Date de naissance", type: "date" },
                  { name: "phone", label: "Téléphone", type: "tel", required: true, placeholder: "+243 ..." },
                ],
              },
              {
                title: "Adresse",
                subtitle: "Pour les visites pastorales et les cellules de quartier.",
                fields: [
                  { name: "commune", label: "Commune", type: "select", required: true, options: communesKinshasa.map((c) => ({ value: c, label: c })) },
                  { name: "avenue", label: "Avenue", required: true },
                  { name: "parcelle", label: "N° de parcelle" },
                ],
              },
              {
                title: "Famille & service",
                subtitle: "Pour mieux vous accompagner et vous orienter.",
                fields: [
                  { name: "marital_status", label: "État civil", type: "select", required: true, options: maritalStatuses },
                  { name: "children_count", label: "Nombre d'enfants", type: "number", placeholder: "0" },
                  { name: "emergency_contact", label: "Personne à contacter en cas d'urgence", placeholder: "Nom + téléphone" },
                  { name: "department_id", label: "Département souhaité", type: "select", options: departments.map((d) => ({ value: d.id, label: d.name })) },
                ],
              },
              {
                title: "Sécurité",
                subtitle: "Vous vous connecterez avec vos nom, prénom et ce mot de passe.",
                fields: [
                  { name: "password", label: "Mot de passe", type: "password", required: true, hint: "8 caractères minimum." },
                  { name: "password2", label: "Confirmer le mot de passe", type: "password", required: true },
                  { name: "accept", label: "J'accepte que l'église conserve ces informations pour l'accompagnement pastoral.", type: "checkbox" },
                ],
              },
            ]}
            values={values}
            onChange={setValues}
            onSubmit={submit}
            submitting={submitting}
            submitLabel="Créer mon compte"
            success={success}
            successNode={
              <div>
                <p className="mt-6 font-display text-xl font-bold">Bienvenue à la maison !</p>
                <p className="mt-2 text-sm text-muted-foreground">Redirection vers votre espace membre…</p>
              </div>
            }
          />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Déjà membre ?{" "}
          <Link to="/connexion" className="font-semibold instagram-text">
            Se connecter
          </Link>
        </p>
      </section>
    </PageShell>
  );
}
