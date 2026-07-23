import communityHero from "@/assets/community-hero.jpg";
import mediaChoir from "@/assets/media-choir.jpg";
import mediaSeminar from "@/assets/media-seminar.jpg";
import mediaPodcast from "@/assets/media-podcast.jpg";
import mediaCrusade from "@/assets/media-crusade.jpg";
import mediaBaptism from "@/assets/media-baptism.jpg";

export { communityHero };

export const verses = [
  { ref: "Jean 3:16", text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique." },
  { ref: "Psaume 23:1", text: "L'Éternel est mon berger, je ne manquerai de rien." },
  { ref: "Philippiens 4:13", text: "Je puis tout par celui qui me fortifie." },
  { ref: "Ésaïe 41:10", text: "Ne crains rien, car je suis avec toi." },
];

export const news = [
  { id: 1, title: "Culte de dimanche", dept: "E", content: "Culte solennel à 09h00, thème : « La foi qui déplace les montagnes ».", date: "27 Juil.", time: "09:00" },
  { id: 2, title: "Séminaire jeunesse", dept: "J", content: "Trois jours de formation spirituelle pour la jeunesse. Inscription ouverte.", date: "29 Juil.", time: "17:00" },
  { id: 3, title: "Intercession nationale", dept: "I", content: "Nuit de prière pour la RDC. Rejoignez-nous en présentiel ou en direct.", date: "31 Juil.", time: "20:00" },
  { id: 4, title: "Évangélisation de rue", dept: "V", content: "Sortie évangélique à Kinshasa – quartier Matonge. Tous mobilisés.", date: "02 Août", time: "07:30" },
  { id: 5, title: "Anniversaire — Sœur Grâce", dept: "F", content: "Célébrons ensemble une année de plus dans la grâce du Seigneur.", date: "03 Août", time: "—" },
  { id: 6, title: "Voyage pastoral", dept: "P", content: "Le pasteur sera en mission à Lubumbashi du 5 au 10 août.", date: "05 Août", time: "—" },
];

export const testimonies = [
  { id: 1, name: "Grâce Mukendi", initials: "GM", content: "Le Seigneur m'a délivrée d'une longue maladie. À Lui seul la gloire !", date: "Il y a 2 jours", likes: 128 },
  { id: 2, name: "Emmanuel Tshisekedi", initials: "ET", content: "Après trois ans sans emploi, Dieu m'a ouvert une porte. Merci Jésus.", date: "Il y a 3 jours", likes: 94 },
  { id: 3, name: "Miriam Ilunga", initials: "MI", content: "Mon foyer restauré, mes enfants convertis. La prière change tout.", date: "Il y a 5 jours", likes: 212 },
  { id: 4, name: "Josué Kabila", initials: "JK", content: "Baptisé le mois dernier, ma vie n'est plus la même. Gloire à Dieu.", date: "Il y a 1 semaine", likes: 76 },
];

export const media = {
  Affiches: [
    { id: "a1", title: "Convention 2026", img: mediaSeminar, desc: "3 jours d'enseignement puissant" },
    { id: "a2", title: "Nuit de louange", img: mediaChoir, desc: "Une nuit face à Dieu" },
    { id: "a3", title: "Croisade Kinshasa", img: mediaCrusade, desc: "L'évangile dans la rue" },
    { id: "a4", title: "Camp jeunesse", img: mediaSeminar, desc: "Formés pour régner" },
  ],
  Photos: [
    { id: "p1", title: "Baptême Congo River", img: mediaBaptism, desc: "12 nouvelles âmes" },
    { id: "p2", title: "Chorale du dimanche", img: mediaChoir, desc: "Louange qui élève" },
    { id: "p3", title: "Communauté en prière", img: communityHero, desc: "Un seul cœur, un seul esprit" },
    { id: "p4", title: "Croisade au coucher", img: mediaCrusade, desc: "La croix élevée" },
  ],
  Podcasts: [
    { id: "pd1", title: "La foi en action", img: mediaPodcast, desc: "Épisode 12 · Past. Daniel" },
    { id: "pd2", title: "Vivre par l'Esprit", img: mediaPodcast, desc: "Épisode 11 · Past. Ruth" },
    { id: "pd3", title: "Prière du matin", img: mediaPodcast, desc: "Chaque jour à 5h" },
  ],
  Vidéos: [
    { id: "v1", title: "Culte 20 juillet", img: mediaChoir, desc: "Prédication complète" },
    { id: "v2", title: "Témoignage Grâce", img: communityHero, desc: "Récit d'une délivrance" },
    { id: "v3", title: "Croisade — Résumé", img: mediaCrusade, desc: "Retour en images" },
    { id: "v4", title: "Baptême du fleuve", img: mediaBaptism, desc: "Moments de grâce" },
  ],
};

export const faq = [
  { q: "À quelle heure sont les cultes ?", a: "Les cultes ont lieu chaque dimanche à 09h00 et 17h00, avec une réunion de prière le mercredi à 18h30." },
  { q: "Comment devenir membre ?", a: "Remplissez le formulaire d'inscription en ligne, puis un serviteur vous contactera pour un entretien d'accueil." },
  { q: "Puis-je prendre rendez-vous avec le pasteur ?", a: "Oui, via le formulaire dédié dans la section Contact. Une confirmation vous sera envoyée sous 48h." },
  { q: "Comment soutenir la mission ?", a: "Vous pouvez faire un don ponctuel ou récurrent depuis la page Don, en toute sécurité." },
  { q: "L'église a-t-elle des programmes pour la jeunesse ?", a: "Absolument. Séminaires, camps, veillées et cellules de jeunes rythment l'année." },
];

export const meditation = {
  book: "Matthieu",
  ref: "11:28",
  message: "« Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos. » Une invitation qui traverse les siècles et rejoint votre cœur aujourd'hui.",
  author: "Past. Daniel Mbayo",
  initial: "D",
};
