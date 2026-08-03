import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/Crud";

export const Route = createFileRoute("/admin/departements")({
  component: DepartmentsAdmin,
});

function DepartmentsAdmin() {
  return (
    <CrudSection
      table="departments"
      title="Départements"
      subtitle="Vision, mission, horaires habituels et d'urgence, contacts."
      orderBy="name"
      ascending
      fields={[
        { name: "name", label: "Nom du département", required: true },
        { name: "slug", label: "Identifiant (slug)", required: true, placeholder: "chorale" },
        { name: "letter", label: "Lettre", placeholder: "E" },
        { name: "vision", label: "Vision", type: "textarea", hideInTable: true },
        { name: "mission", label: "Mission", type: "textarea", hideInTable: true },
        { name: "usual_schedule", label: "Horaire habituel" },
        { name: "urgent_schedule", label: "Horaire d'urgence", hideInTable: true },
        { name: "contact_phone", label: "Téléphone" },
        { name: "contact_email", label: "E-mail", hideInTable: true },
      ]}
    />
  );
}
