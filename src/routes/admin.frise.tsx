import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/Crud";

export const Route = createFileRoute("/admin/frise")({
  component: TimelineAdmin,
});

function TimelineAdmin() {
  return (
    <CrudSection
      table="timeline_entries"
      title="Frise chronologique vivante"
      subtitle="Les étapes de l'histoire de l'église affichées sur la page « À propos »."
      orderBy="position"
      ascending
      fields={[
        { name: "year", label: "Année", required: true, placeholder: "1998" },
        { name: "title", label: "Titre de l'étape", required: true, placeholder: "La première cellule de prière" },
        { name: "position", label: "Ordre d'affichage", type: "number", placeholder: "0" },
        { name: "text", label: "Récit de l'étape", type: "textarea", required: true, hideInTable: true },
      ]}
    />
  );
}
