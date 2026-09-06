import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/Crud";

export const Route = createFileRoute("/admin/footer")({
  component: FooterAdmin,
});

function FooterAdmin() {
  return (
    <div className="grid gap-8">
      <CrudSection
        table="footer_links"
        title="Liens du pied de page"
        subtitle="La colonne de navigation affichée en bas de chaque page."
        orderBy="position"
        ascending
        fields={[
          { name: "label", label: "Texte du lien", required: true, placeholder: "À propos" },
          { name: "href", label: "Adresse", required: true, placeholder: "/a-propos" },
          { name: "position", label: "Ordre d'affichage", type: "number", placeholder: "1" },
          { name: "active", label: "Visible sur le site", type: "checkbox", render: (r) => (r["active"] ? "Oui" : "Non") },
        ]}
      />

      <CrudSection
        table="site_settings"
        title="Textes & coordonnées du pied de page"
        subtitle="Nom de l'église, phrase de présentation, coordonnées, réseaux sociaux et mention du bas de page."
        orderBy="created_at"
        ascending
        fields={[
          { name: "church_name", label: "Nom de l'église", required: true, placeholder: "Église Nouvelle Vie" },
          { name: "tagline", label: "Phrase de présentation", type: "textarea", hideInTable: true },
          { name: "footer_nav_title", label: "Titre colonne navigation", hideInTable: true, placeholder: "Navigation" },
          { name: "footer_contact_title", label: "Titre colonne contact", hideInTable: true, placeholder: "Contact" },
          { name: "address", label: "Adresse", placeholder: "Av. de la Foi, Kinshasa, RDC" },
          { name: "phone", label: "Téléphone", placeholder: "+243 000 000 000" },
          { name: "email", label: "Adresse e-mail", placeholder: "contact@nouvellevie.cd" },
          { name: "facebook_url", label: "Lien Facebook", hideInTable: true, placeholder: "https://facebook.com/..." },
          { name: "instagram_url", label: "Lien Instagram", hideInTable: true, placeholder: "https://instagram.com/..." },
          { name: "youtube_url", label: "Lien YouTube", hideInTable: true, placeholder: "https://youtube.com/..." },
          { name: "whatsapp_url", label: "Lien WhatsApp", hideInTable: true, placeholder: "https://wa.me/..." },
          { name: "twitter_url", label: "Lien X (Twitter)", hideInTable: true, placeholder: "https://x.com/..." },
          { name: "footer_credit", label: "Mention du bas de page", hideInTable: true, placeholder: "Fait avec foi en RDC" },
        ]}
      />
    </div>
  );
}
