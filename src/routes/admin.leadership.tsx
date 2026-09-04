import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/Crud";

export const Route = createFileRoute("/admin/leadership")({
  component: LeadershipAdmin,
});

const toneOptions = [
  { value: "from-ig-blue to-ig-purple", label: "Bleu → Violet" },
  { value: "from-ig-indigo to-ig-pink", label: "Indigo → Rose" },
  { value: "from-ig-purple to-ig-blue", label: "Violet → Bleu" },
  { value: "from-ig-magenta to-ig-orange", label: "Magenta → Orange" },
  { value: "from-ig-red to-ig-gold", label: "Rouge → Doré" },
  { value: "from-ig-gold to-ig-magenta", label: "Doré → Magenta" },
  { value: "from-ig-orange to-ig-gold", label: "Orange → Doré" },
];

function LeadershipAdmin() {
  return (
    <CrudSection
      table="leaders"
      title="Leadership"
      subtitle="Les serviteurs affichés dans la section « Des visages, pas un annuaire » de la page À propos."
      orderBy="position"
      ascending
      fields={[
        { name: "name", label: "Nom complet", required: true, placeholder: "Pasteur Emmanuel Kabasele" },
        { name: "role", label: "Rôle", required: true, placeholder: "Fondateur & Pasteur principal" },
        { name: "initials", label: "Initiales", required: true, placeholder: "EK" },
        { name: "short", label: "Résumé (carte)", type: "textarea", hideInTable: true },
        { name: "bio", label: "Biographie complète", type: "textarea", required: true, hideInTable: true },
        { name: "quote", label: "Citation", type: "textarea", hideInTable: true },
        { name: "tone", label: "Couleur de la carte", type: "select", options: toneOptions, hideInTable: true },
        { name: "since", label: "En fonction", placeholder: "Depuis 2003" },
        { name: "position", label: "Ordre d'affichage", type: "number", placeholder: "1" },
        { name: "active", label: "Visible sur le site", type: "checkbox", render: (r) => (r["active"] ? "Oui" : "Non") },
      ]}
    />
  );
}
