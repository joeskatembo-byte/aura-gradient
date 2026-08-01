import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { CalendarHeart, HandHeart, Mail, MapPin, Phone, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/shared/PageShell";
import { Modal, StepForm, type FormValues, type FormStep } from "@/components/shared/StepForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact, intercession & rendez-vous — Église Nouvelle Vie" },
      { name: "description", content: "Demandez une intercession, prenez rendez-vous avec le pasteur ou écrivez au secrétariat de l'église à Kinshasa. Réponse sous 48 h, anonymat possible." },
      { property: "og:title", content: "Contact, intercession & rendez-vous — Église Nouvelle Vie" },
      { property: "og:description", content: "Trois portes pour être écouté : intercession, rendez-vous pastoral, message au secrétariat." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

type Kind = "intercession" | "rendez-vous" | "message";

const identityStep: FormStep = {
  title: "Vous",
  subtitle: "Vous pouvez rester anonyme : seul le pasteur verra votre demande.",
  fields: [
    { name: "anonymous", label: "Je préfère rester anonyme", type: "checkbox" },
    { name: "full_name", label: "Nom complet", required: true, hidden: (v) => Boolean(v.anonymous) },
    { name: "phone", label: "Téléphone", type: "tel", placeholder: "+243 ...", hidden: (v) => Boolean(v.anonymous) },
  ],
};

const configs: Record<Kind, { eyebrow: string; title: string; steps: FormStep[]; success: string }> = {
  intercession: {
    eyebrow: "Intercession",
    title: "Confier un sujet de prière",
    success: "Votre sujet est entre les mains des intercesseurs. Ils prieront dès la prochaine veillée.",
    steps: [
      identityStep,
      {
        title: "Le sujet",
        subtitle: "Une phrase claire suffit : Dieu connaît déjà le reste.",
        fields: [
          { name: "subject", label: "Objet de la prière", required: true, placeholder: "Santé, travail, famille..." },
          { name: "details", label: "Détails", type: "textarea", required: true, placeholder: "Racontez librement..." },
        ],
      },
    ],
  },
  "rendez-vous": {
    eyebrow: "Rendez-vous",
    title: "Rencontrer le pasteur",
    success: "Votre demande est enregistrée. Le secrétariat vous rappelle pour fixer l'heure exacte.",
    steps: [
      identityStep,
      {
        title: "Le motif",
        fields: [
          { name: "subject", label: "Motif de la rencontre", required: true, placeholder: "Conseil conjugal, bénédiction..." },
          { name: "details", label: "Précisions", type: "textarea" },
        ],
      },
      {
        title: "La date",
        subtitle: "Les entretiens ont lieu du mardi au vendredi, de 09h à 16h.",
        fields: [{ name: "preferred_date", label: "Date souhaitée", type: "date", required: true }],
      },
    ],
  },
  message: {
    eyebrow: "Secrétariat",
    title: "Écrire à l'église",
    success: "Message reçu. Le secrétariat vous répond sous 48 heures ouvrables.",
    steps: [
      identityStep,
      {
        title: "Votre message",
        fields: [
          { name: "subject", label: "Objet", required: true },
          { name: "message", label: "Message", type: "textarea", required: true },
        ],
      },
    ],
  },
};

function ContactPage() {
  const [kind, setKind] = useState<Kind | null>(null);
  const [values, setValues] = useState<FormValues>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const close = () => {
    setKind(null);
    setTimeout(() => { setValues({}); setSuccess(false); }, 300);
  };

  const submit = async () => {
    if (!kind) return;
    setSubmitting(true);
    const anonymous = Boolean(values.anonymous);
    const base = {
      anonymous,
      full_name: anonymous ? null : String(values.full_name ?? "") || null,
      phone: anonymous ? null : String(values.phone ?? "") || null,
      subject: String(values.subject ?? ""),
    };

    const { error } =
      kind === "intercession"
        ? await supabase.from("prayer_requests").insert({ ...base, details: String(values.details ?? "") })
        : kind === "rendez-vous"
          ? await supabase.from("appointments").insert({
              ...base,
              details: String(values.details ?? "") || null,
              preferred_date: String(values.preferred_date ?? "") || null,
            })
          : await supabase.from("contact_messages").insert({ ...base, message: String(values.message ?? "") });

    setSubmitting(false);
    if (error) {
      toast.error("Envoi impossible : " + error.message);
      return;
    }
    setSuccess(true);
    toast.success("Votre demande a bien été transmise.");
  };

  const cards = [
    {
      kind: "intercession" as Kind,
      icon: HandHeart,
      title: "Intercession",
      desc: "Un fardeau trop lourd ? Confiez-le. Nos intercesseurs portent chaque sujet devant Dieu, dans la discrétion la plus totale.",
      cta: "Demander la prière",
      featured: false,
    },
    {
      kind: "rendez-vous" as Kind,
      icon: CalendarHeart,
      title: "Rendez-vous pasteur",
      desc: "Un entretien personnel, face à face, pour être conseillé, béni ou simplement écouté sans jugement.",
      cta: "Prendre rendez-vous",
      featured: true,
    },
    {
      kind: "message" as Kind,
      icon: Mail,
      title: "Contacter l'église",
      desc: "Question administrative, partenariat, visite de groupe ou demande de document : le secrétariat vous répond.",
      cta: "Écrire un message",
      featured: false,
    },
  ];

  return (
    <PageShell
      eyebrow="Contact"
      title={
        <>
          Trois portes, une seule <span className="instagram-text">écoute</span>.
        </>
      }
      intro="Que vous cherchiez la prière, un conseil pastoral ou une information pratique, quelqu'un est de l'autre côté."
      stats={[
        { k: "48 h", v: "délai de réponse" },
        { k: "100 %", v: "confidentiel" },
        { k: "7j/7", v: "intercession" },
      ]}
    >
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid items-center gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <button
              key={c.kind}
              onClick={() => setKind(c.kind)}
              className={`group relative overflow-hidden rounded-3xl border p-7 text-left transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                c.featured
                  ? "border-transparent instagram-gradient-soft shadow-xl md:scale-105 md:p-9"
                  : "border-border bg-card"
              }`}
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl instagram-animated text-white transition-transform duration-500 group-hover:scale-110">
                <c.icon className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-black">{c.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              <span className="mt-6 inline-flex items-center gap-2 rounded-full instagram-animated px-5 py-2.5 text-sm font-bold text-white shadow-lg">
                {c.cta}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-14 grid gap-4 rounded-3xl border border-border bg-card p-6 sm:p-8 md:grid-cols-3">
          {[
            { icon: MapPin, t: "Adresse", d: "12, avenue de la Paix, Q. Righini, Lemba — Kinshasa, RDC" },
            { icon: Phone, t: "Téléphone", d: "+243 810 000 000 · +243 998 000 000 (WhatsApp)" },
            { icon: Clock, t: "Secrétariat", d: "Mardi → samedi, 09h00 – 17h00. Dimanche : après les cultes." },
          ].map((i) => (
            <div key={i.t} className="flex gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl instagram-gradient-soft">
                <i.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold">{i.t}</p>
                <p className="text-sm text-muted-foreground">{i.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Modal open={kind !== null} onClose={close} eyebrow={kind ? configs[kind].eyebrow : ""} title={kind ? configs[kind].title : ""}>
        {kind && (
          <StepForm
            steps={configs[kind].steps}
            values={values}
            onChange={setValues}
            onSubmit={submit}
            submitting={submitting}
            submitLabel="Envoyer"
            success={success}
            successNode={
              <div>
                <p className="mt-6 font-display text-xl font-bold">Reçu, merci !</p>
                <p className="mt-2 text-sm text-muted-foreground">{configs[kind].success}</p>
              </div>
            }
          />
        )}
      </Modal>
    </PageShell>
  );
}
