import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/Crud";

export const Route = createFileRoute("/admin/faq")({
  component: FaqAdmin,
});

function FaqAdmin() {
  return (
    <CrudSection
      table="faq_items"
      title="Questions fréquentes"
      subtitle="L'accordéon « Tout ce qu'il faut savoir avant de venir » de la page d'accueil."
      orderBy="position"
      ascending
      fields={[
        { name: "question", label: "Question", required: true, placeholder: "À quelle heure sont les cultes ?" },
        { name: "answer", label: "Réponse", type: "textarea", required: true, hideInTable: true },
        { name: "position", label: "Ordre d'affichage", type: "number", placeholder: "1" },
        { name: "active", label: "Visible sur le site", type: "checkbox", render: (r) => (r["active"] ? "Oui" : "Non") },
      ]}
    />
  );
}
