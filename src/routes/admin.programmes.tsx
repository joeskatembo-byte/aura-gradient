import { createFileRoute } from "@tanstack/react-router";
import { CrudSection, useDepartmentOptions } from "@/components/admin/Crud";

export const Route = createFileRoute("/admin/programmes")({
  component: ProgramsAdmin,
});

const days = [
  { value: "0", label: "Dimanche" },
  { value: "1", label: "Lundi" },
  { value: "2", label: "Mardi" },
  { value: "3", label: "Mercredi" },
  { value: "4", label: "Jeudi" },
  { value: "5", label: "Vendredi" },
  { value: "6", label: "Samedi" },
];

function ProgramsAdmin() {
  const departments = useDepartmentOptions();

  return (
    <div className="grid gap-6">
      <CrudSection
        table="programs"
        title="Programmes"
        subtitle="Cultes, réunions hebdomadaires et événements à venir, par département."
        fields={[
          { name: "title", label: "Titre", required: true },
          { name: "scope", label: "Type", type: "select", options: [
            { value: "hebdomadaire", label: "Hebdomadaire" },
            { value: "evenement", label: "Événement" },
          ] },
          { name: "day_of_week", label: "Jour de la semaine", type: "select", options: days },
          { name: "start_time", label: "Heure de début", placeholder: "09:00" },
          { name: "event_date", label: "Date (événement)", type: "date", hideInTable: true },
          { name: "department_id", label: "Département", type: "select", options: departments, hideInTable: true },
          { name: "description", label: "Description", type: "textarea", hideInTable: true },
        ]}
      />

      <CrudSection
        table="announcements"
        title="Actualités"
        subtitle="La barre d'actualités « stories » de la page d'accueil."
        fields={[
          { name: "title", label: "Titre", required: true },
          { name: "category", label: "Catégorie", type: "select", options: [
            { value: "communique", label: "Communiqué" },
            { value: "evenement", label: "Événement" },
            { value: "anniversaire", label: "Anniversaire" },
            { value: "mission", label: "Mission" },
          ] },
          { name: "letter", label: "Lettre", placeholder: "E" },
          { name: "content", label: "Contenu", type: "textarea", required: true },
          { name: "department_id", label: "Département", type: "select", options: departments, hideInTable: true },
        ]}
      />
    </div>
  );
}
