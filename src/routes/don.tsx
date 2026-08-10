import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, HeartHandshake, Landmark, Smartphone, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/shared/PageShell";
import { HorizontalAccordion } from "@/components/shared/HorizontalAccordion";
import { Modal, StepForm, type FormValues } from "@/components/shared/StepForm";
import { donFaq } from "@/data/forms";
import { formatMoney } from "@/lib/slug";

export const Route = createFileRoute("/don")({
  head: () => ({
    meta: [
      { title: "Faire un don — Église Nouvelle Vie" },
      { name: "description", content: "Soutenez la construction du temple, les œuvres sociales et l'évangélisation. Suivez l'avancement de chaque projet et l'usage de chaque centime." },
      { property: "og:title", content: "Faire un don — Église Nouvelle Vie" },
      { property: "og:description", content: "Projets en cours, budgets, transparence financière et don en quelques étapes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DonPage,
});

type Project = {
  id: string;
  title: string;
  description: string;
  budget_total: number;
  budget_raised: number;
  status: string;
  image_url: string | null;
};

function DonPage() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"en_cours" | "termine">("en_cours");

  const { data: projects = [] } = useQuery({
    queryKey: ["finance_projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("finance_projects")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Project[];
    },
  });

  const shown = projects.filter((p) => p.status === tab);

  return (
    <PageShell
      eyebrow="Don & offrandes"
      title={
        <>
          Chaque <span className="instagram-text">centime</span> devient une{" "}
          <span className="instagram-text">bénédiction</span> visible.
        </>
      }
      intro="Nous croyons à la transparence totale. Découvrez les projets en cours, ce qui a déjà été financé, et donnez en toute confiance en moins de deux minutes."
      stats={[
        { k: formatMoney(projects.reduce((s, p) => s + Number(p.budget_raised), 0)), v: "déjà mobilisés" },
        { k: String(projects.filter((p) => p.status === "en_cours").length), v: "projets en cours" },
        { k: String(projects.filter((p) => p.status === "termine").length), v: "projets achevés" },
        { k: "100 %", v: "affecté & audité" },
      ]}
      aside={
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full instagram-animated px-6 py-3 text-sm font-bold text-white shadow-xl transition-transform hover:scale-[1.02]"
          >
            <HeartHandshake className="h-4 w-4" /> Faire un don maintenant
          </button>
          <a
            href="#projets"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-semibold backdrop-blur-xl transition-colors hover:bg-muted"
          >
            Voir les projets
          </a>
        </div>
      }
    >
      {/* Carrousel des projets */}
      <section id="projets" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest instagram-text">Transparence</p>
            <h2 className="font-display text-3xl font-black sm:text-4xl">Où va votre offrande.</h2>
          </div>
          <div className="flex gap-2 rounded-full border border-border bg-card p-1">
            {(
              [
                { k: "en_cours", label: "Projets en cours" },
                { k: "termine", label: "Récemment achevés" },
              ] as const
            ).map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  tab === t.k ? "instagram-animated text-white shadow" : "hover:bg-muted"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <ProjectCarousel projects={shown} onDonate={() => setOpen(true)} />
      </section>

      {/* Moyens de don */}
      <section className="border-y border-border/60 instagram-gradient-soft">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-14 sm:px-6 md:grid-cols-3">
          {[
            { icon: Smartphone, title: "Mobile money", desc: "M-Pesa, Orange Money, Airtel Money — +243 810 000 000 (Église Nouvelle Vie)." },
            { icon: Landmark, title: "Virement bancaire", desc: "Compte USD 00012-3456789-01 · Rawbank Kinshasa, intitulé « ENV Projets »." },
            { icon: Sparkles, title: "Sur place", desc: "Remettez votre offrande au secrétariat, contre reçu numéroté, chaque dimanche." },
          ].map((m) => (
            <div key={m.title} className="card-lift group rounded-3xl border border-border bg-card/70 p-6 backdrop-blur-xl">
              <span className="grid h-11 w-11 place-items-center rounded-2xl instagram-animated text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                <m.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">{m.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ accordéon horizontal */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest instagram-text">Vos questions</p>
          <h2 className="font-display text-3xl font-black sm:text-4xl">Donner en toute clarté.</h2>
        </div>
        <HorizontalAccordion items={donFaq} />
      </section>

      <DonationModal open={open} onClose={() => setOpen(false)} projects={projects} />
    </PageShell>
  );
}

function ProjectCarousel({ projects, onDonate }: { projects: Project[]; onDonate: () => void }) {
  const [index, setIndex] = useState(0);
  if (projects.length === 0) {
    return <p className="rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">Aucun projet dans cette catégorie pour l'instant.</p>;
  }
  const safe = index % projects.length;
  const p = projects[safe];
  const pct = Math.min(100, Math.round((Number(p.budget_raised) / Math.max(1, Number(p.budget_total))) * 100));

  return (
    <div>
      {/* barres de progression story-style */}
      <div className="mb-4 flex gap-1.5">
        {projects.map((x, i) => (
          <button
            key={x.id}
            aria-label={x.title}
            onClick={() => setIndex(i)}
            className={`h-1 flex-1 rounded-full transition-all ${i === safe ? "instagram-animated" : "bg-muted"}`}
          />
        ))}
      </div>

      <div key={p.id} className="card-lift animate-fade-in group grid gap-6 rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8 md:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <h3 className="font-display text-2xl font-black sm:text-3xl">{p.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{p.description}</p>

          <div className="mt-6">
            <div className="flex items-end justify-between text-sm">
              <span className="font-semibold">{formatMoney(Number(p.budget_raised))} collectés</span>
              <span className="text-muted-foreground">objectif {formatMoney(Number(p.budget_total))}</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full instagram-animated transition-all duration-1000" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest instagram-text">{pct}% financé</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={onDonate} className="inline-flex items-center gap-2 rounded-full instagram-animated px-5 py-2.5 text-sm font-bold text-white shadow-lg">
              <HeartHandshake className="h-4 w-4" /> Soutenir ce projet
            </button>
            <div className="flex gap-2">
              <button
                aria-label="Projet précédent"
                onClick={() => setIndex((i) => (i - 1 + projects.length) % projects.length)}
                className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:bg-muted"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                aria-label="Projet suivant"
                onClick={() => setIndex((i) => (i + 1) % projects.length)}
                className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:bg-muted"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative min-h-[200px] overflow-hidden rounded-2xl instagram-animated">
          {p.image_url ? (
            <img src={p.image_url} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="grid h-full w-full place-items-center p-6 text-center text-white">
              <div>
                <p className="font-display text-5xl font-black">{pct}%</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest opacity-90">de l'objectif atteint</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DonationModal({ open, onClose, projects }: { open: boolean; onClose: () => void; projects: Project[] }) {
  const [values, setValues] = useState<FormValues>({ currency: "USD", method: "mobile_money" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    const { data: sess } = await supabase.auth.getSession();
    const { error } = await supabase.from("donations").insert({
      user_id: sess.session?.user.id ?? null,
      donor_name: String(values.donor_name ?? "").trim() || null,
      amount: Number(values.amount ?? 0),
      currency: String(values.currency ?? "USD"),
      method: String(values.method ?? "mobile_money"),
      project_id: String(values.project_id ?? "") || null,
      message: String(values.message ?? "") || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Envoi impossible : " + error.message);
      return;
    }
    setSuccess(true);
    toast.success("Merci ! Votre don a été annoncé au secrétariat.");
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        setTimeout(() => { setSuccess(false); setValues({ currency: "USD", method: "mobile_money" }); }, 300);
      }}
      eyebrow="Don"
      title="Semer dans la maison"
    >
      <StepForm
        steps={[
          {
            title: "Montant",
            subtitle: "Aucun montant n'est trop petit : tout est semé avec respect.",
            fields: [
              { name: "amount", label: "Montant", type: "number", required: true, placeholder: "50" },
              { name: "currency", label: "Devise", type: "select", required: true, options: [
                { value: "USD", label: "Dollar américain (USD)" },
                { value: "CDF", label: "Franc congolais (CDF)" },
              ] },
              { name: "project_id", label: "Affecter à un projet (facultatif)", type: "select", options: projects.map((p) => ({ value: p.id, label: p.title })) },
            ],
          },
          {
            title: "Moyen",
            subtitle: "Comment souhaitez-vous transmettre votre offrande ?",
            fields: [
              { name: "method", label: "Moyen de don", type: "select", required: true, options: [
                { value: "mobile_money", label: "Mobile money" },
                { value: "banque", label: "Virement bancaire" },
                { value: "especes", label: "Espèces sur place" },
              ] },
              { name: "phone", label: "Téléphone (pour le reçu)", type: "tel", placeholder: "+243 ..." },
            ],
          },
          {
            title: "Identité",
            subtitle: "Laissez le nom vide pour rester anonyme devant les hommes.",
            fields: [
              { name: "donor_name", label: "Nom du donateur (facultatif)" },
              { name: "message", label: "Un mot, une intention", type: "textarea", placeholder: "Pour la construction du temple..." },
            ],
          },
        ]}
        values={values}
        onChange={setValues}
        onSubmit={submit}
        submitting={submitting}
        submitLabel="Annoncer mon don"
        success={success}
        successNode={
          <div>
            <p className="mt-6 font-display text-xl font-bold">Que Dieu vous le rende au centuple !</p>
            <p className="mt-2 text-sm text-muted-foreground">Le secrétariat vous contactera pour finaliser et vous remettre un reçu.</p>
          </div>
        }
      />
    </Modal>
  );
}
