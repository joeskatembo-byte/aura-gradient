import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/Crud";

export const Route = createFileRoute("/admin/versets")({
  component: VersesAdmin,
});

function VersesAdmin() {
  return (
    <CrudSection
      table="bible_verses"
      title="Versets du jour"
      subtitle="Les versets qui défilent dans la bannière d'accueil."
      orderBy="position"
      ascending
      fields={[
        { name: "reference", label: "Référence biblique", required: true, placeholder: "Jean 3:16" },
        { name: "text", label: "Texte du verset", type: "textarea", required: true },
        { name: "position", label: "Ordre d'affichage", type: "number", placeholder: "1" },
        { name: "active", label: "Visible sur le site", type: "checkbox", render: (r) => (r["active"] ? "Oui" : "Non") },
      ]}
    />
  );
}
