
# Site web église RDC — Page d'accueil nouvelle génération

## Objectif
Construire d'abord la **page d'accueil complète** (header + body + footer) avec la palette Instagram fournie, en design premium, léger et mobile-first. Les autres pages (À propos, Don, Contact avec 3 formulaires, Inscription, pages détail média, administration) seront livrées dans des itérations suivantes une fois l'accueil validé.

## Design system
- Palette Instagram fournie intégrée dans `src/styles.css` via tokens `@theme` (couleurs + gradient officiel `.instagram-gradient` en 45°).
- Fonds : blanc (mode clair par défaut) et noir disponible.
- Typographie : polices élégantes (Inter/Space Grotesk via `<link>` dans `__root.tsx`).
- Icônes : `lucide-react` (déjà dispo) pour représenter chaque item de menu.
- Animations : Tailwind + keyframes existants (`fade-in`, `scale-in`) + gradients animés.

## Structure page d'accueil (`src/routes/index.tsx`)

### 1. Header — Méga menu à étapes (choix principal)
- Barre supérieure avec logo église + wordmark.
- Menu où chaque item = **icône significative** + label :
  - Accueil (Home)
  - À propos (Info) — dropdown : Historique, Départements, Programmes
  - Don (HeartHandshake)
  - Contact (Mail) — dropdown : Intercession, Rendez-vous pasteur, Contacter l'église
  - Inscription (UserPlus)
- Dropdowns "méga menu" avec panneau structuré (titres + descriptions courtes).
- Version mobile : drawer plein écran avec les mêmes icônes.
- Variante "floating pill" gardée en tête pour itération future (non implémentée maintenant).

### 2. Body

**a. Hero — Bento Grid animé**
Grille de tuiles asymétriques :
- Tuile principale : titre "Bienvenue à la Maison" avec gradient Instagram sur le texte.
- Tuile versets défilants (rotation auto toutes les 5s).
- Tuile photo communauté (placeholder généré).
- Tuile CTA (bouton "Rejoindre un culte").
- Tuile compteur membres animé (count-up).
- Tuile mini-agenda du prochain événement.

**b. Barre d'actualités défilante — Carrousel story-style (Instagram/TikTok)**
- Barres de progression fines en haut, auto-remplissage.
- Chaque story : titre catégorie (Séminaire, Prière, Culte, Intercession, Réunion, Évangélisation, Anniversaire, Décès, Voyage), avatar rond du département (lettre, "E" pour église entière), contenu court, date/heure.
- Style visuel (forme, gradient, police) inspiré Instagram.

**c. Appel au christianisme — Tiered Cards**
3 cartes alignées, la centrale légèrement plus grande et surélevée, effet focus au survol :
- **Besoin d'aide ?** — message de soutien + bouton → `/contact`.
- **À méditer** (carte centrale mise en avant) — nom du livre à gauche, référence verset à droite, message, pied avec avatar lettre + nom du serviteur.
- **Rendez-vous** — message encourageant + bouton → `/contact#rendez-vous`.

**d. Témoignages — Carrousel Cards Stack**
- Cartes empilées, celle du dessus glisse avec rotation au swipe/clic.
- Chaque carte : photo à gauche, nom à droite, message, date/heure, bouton like avec compteur.
- Bouton "Témoigner" en haut (ouvrira formulaire step-by-step — placeholder pour l'instant).
- N'affiche que les témoignages récents (données mockées côté client).

**e. Médiathèque — Style Netflix sériel**
- Rangées horizontales scrollables par catégorie (Affiches, Photos, Podcasts, Vidéos).
- Hover : zoom carte + overlay titre/description.
- Actions : like, partager, télécharger, "en savoir plus" (page détail future).
- Données mockées; l'ajout via admin viendra plus tard.

**f. FAQ — Accordéon horizontal**
- Sections qui s'ouvrent **de gauche à droite** (largeur qui s'étend, pas hauteur).
- Une seule ouverte à la fois (ferme l'autre auto).
- Icône `+` qui pivote 180° vers `X` (transition fluide).

### 3. Footer
- Logo + baseline église.
- Liens rapides (miroir du menu).
- Liens réseaux sociaux (Facebook, Instagram, YouTube, WhatsApp, TikTok, X) avec icônes.
- Partenaires (placeholders).
- Adresse RDC, contact, mentions.
- Bande basse avec gradient Instagram fin.

## Détails techniques
- Route : réécriture de `src/routes/index.tsx` (placeholder actuel supprimé).
- Composants dans `src/components/home/` : `Header.tsx`, `HeroBento.tsx`, `NewsStories.tsx`, `TieredCards.tsx`, `TestimoniesStack.tsx`, `MediaNetflix.tsx`, `FaqAccordion.tsx`, `Footer.tsx`.
- Données mockées dans `src/data/` (news, testimonies, media, faq) — remplaçables plus tard par Lovable Cloud.
- Tokens dans `src/styles.css` :

```text
@theme {
  --color-ig-blue: #405DE6;
  --color-ig-indigo: #5851DB;
  ... (toutes les couleurs fournies)
}
.instagram-gradient { background: linear-gradient(45deg, #405DE6, ... #FFDC80); }
.instagram-text-gradient { background: same; -webkit-background-clip: text; color: transparent; }
```
- SEO : `head()` dédié à `/` (titre, description, og:title, og:description, og:type website).
- Images : `imagegen` pour 2-3 visuels clés (hero photo communauté, quelques médias) — le reste en placeholders légers pour préserver le forfait data.
- Accessibilité + responsive (grid → flex avec `min-w-0` / `shrink-0` selon règles).

## Hors périmètre de cette itération
- Pages À propos, Don, Contact (3 formulaires), Inscription.
- Backend Lovable Cloud (auth, DB, upload média, admin).
- Formulaire step-by-step Témoigner/Ajouter média (boutons présents mais non fonctionnels).
- Pages détail média.

Confirme-moi ce plan (ou dis-moi ce que tu veux ajuster) et je construis l'accueil.
