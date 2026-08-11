import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/Crud";

export const Route = createFileRoute("/admin/meditations")({
  component: MeditationsAdmin,
});

function MeditationsAdmin() {
  return (
    <CrudSection
      table="meditations"
      title="À méditer"
      subtitle="La parole du jour affichée sur la page d'accueil : livre, référence, message et auteur."
      orderBy="published_at"
      fields={[
        { name: "book", label: "Livre biblique", required: true, placeholder: "Matthieu" },
        { name: "reference", label: "Référence", required: true, placeholder: "11:28" },
        { name: "message", label: "Message à méditer", type: "textarea", required: true, hideInTable: true },
        { name: "author", label: "Auteur", placeholder: "Past. Daniel Mbayo" },
        { name: "initial", label: "Initiale de l'auteur", placeholder: "D", hideInTable: true },
        { name: "published_at", label: "Date de publication", type: "date" },
        { name: "active", label: "Afficher sur l'accueil", type: "checkbox", render: (row) => (row.active ? "Oui" : "Non") },
      ]}
    />
  );
}
