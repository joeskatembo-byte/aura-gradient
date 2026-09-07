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
        { name: "tagline", label: "Slogan court", placeholder: "Chorale, orchestre et conduite de culte" },
        { name: "lead_name", label: "Responsable", placeholder: "Sœur Esther Lokwa" },
        { name: "icon", label: "Icône", type: "select", options: [
          { value: "music", label: "Musique" },
          { value: "users", label: "Personnes" },
          { value: "hands", label: "Prière" },
          { value: "megaphone", label: "Annonce" },
          { value: "heart", label: "Cœur" },
          { value: "star", label: "Étoile" },
        ] },
        { name: "tone", label: "Couleur de thème", type: "select", hideInTable: true, options: [
          { value: "from-ig-blue to-ig-purple", label: "Bleu → Violet" },
          { value: "from-ig-purple to-ig-pink", label: "Violet → Rose" },
          { value: "from-ig-indigo to-ig-magenta", label: "Indigo → Magenta" },
          { value: "from-ig-red to-ig-orange", label: "Rouge → Orange" },
          { value: "from-ig-orange to-ig-gold", label: "Orange → Or" },
          { value: "from-ig-gold to-ig-yellow", label: "Or → Jaune" },
        ] },
        { name: "vision", label: "Vision", type: "textarea", hideInTable: true },
        { name: "mission", label: "Mission", type: "textarea", hideInTable: true },
        { name: "usual_schedule", label: "Horaires habituels (une ligne par créneau)", type: "textarea", placeholder: "Mercredi · 17:00 – 19:30 · Salle de répétition" },
        { name: "urgent_schedule", label: "Horaire d'urgence", hideInTable: true },
        { name: "news", label: "Actualité du département", type: "textarea", hideInTable: true },
        { name: "contact_phone", label: "Téléphone" },
        { name: "contact_email", label: "E-mail", hideInTable: true },
      ]}
    />
  );
}
