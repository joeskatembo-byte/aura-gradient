import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/Crud";

export const Route = createFileRoute("/admin/evenements")({
  component: EventsAdmin,
});

const toneOptions = [
  { value: "from-ig-blue to-ig-purple", label: "Bleu → Violet" },
  { value: "from-ig-purple to-ig-pink", label: "Violet → Rose" },
  { value: "from-ig-pink to-ig-orange", label: "Rose → Orange" },
  { value: "from-ig-orange to-ig-gold", label: "Orange → Doré" },
  { value: "from-ig-red to-ig-gold", label: "Rouge → Doré" },
  { value: "from-ig-indigo to-ig-magenta", label: "Indigo → Magenta" },
];

function EventsAdmin() {
  return (
    <CrudSection
      table="upcoming_events"
      title="Événements à venir"
      subtitle="Les semaines mises en avant dans la section Programmes de la page À propos."
      orderBy="position"
      ascending
      fields={[
        { name: "title", label: "Titre", required: true, placeholder: "Semaine de la famille" },
        { name: "date_label", label: "Période", required: true, placeholder: "02 – 08 août" },
        { name: "detail", label: "Détail", type: "textarea", hideInTable: true },
        { name: "tone", label: "Couleur de la carte", type: "select", options: toneOptions, hideInTable: true },
        { name: "position", label: "Ordre d'affichage", type: "number", placeholder: "1" },
        { name: "active", label: "Visible sur le site", type: "checkbox", render: (r) => (r["active"] ? "Oui" : "Non") },
      ]}
    />
  );
}
