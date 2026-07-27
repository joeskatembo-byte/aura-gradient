export type TimelineEntry = {
  year: string;
  title: string;
  text: string;
  tone: string; // gradient tone for the archive backdrop
};

export const timeline: TimelineEntry[] = [
  {
    year: "1998",
    title: "La première cellule de prière",
    text: "Douze croyants se réunissent dans une parcelle de Kalamu. Une lampe tempête, une Bible, et une promesse : bâtir une maison pour les âmes.",
    tone: "from-ig-blue via-ig-indigo to-ig-purple",
  },
  {
    year: "2003",
    title: "Naissance officielle de l'église",
    text: "L'assemblée est reconnue et prend le nom d'Église Nouvelle Vie. Le premier culte public rassemble 240 personnes sous une bâche.",
    tone: "from-ig-indigo via-ig-purple to-ig-magenta",
  },
  {
    year: "2009",
    title: "Le temple de Kinshasa",
    text: "Après six ans de sacrifices, la communauté inaugure son temple de 1 200 places et ouvre son centre de formation biblique.",
    tone: "from-ig-purple via-ig-magenta to-ig-pink",
  },
  {
    year: "2015",
    title: "Expansion provinciale",
    text: "Sept implantations voient le jour à Matadi, Lubumbashi, Goma et Kikwit. Le ministère social nourrit 800 familles chaque mois.",
    tone: "from-ig-pink via-ig-red to-ig-orange",
  },
  {
    year: "2021",
    title: "L'église numérique",
    text: "Lancement de la radio en ligne, des podcasts et des cultes diffusés en direct. La Parole franchit les frontières du pays.",
    tone: "from-ig-red via-ig-orange to-ig-gold",
  },
  {
    year: "2026",
    title: "Une génération envoyée",
    text: "Plus de 9 000 fidèles, 14 départements et une vision claire : former des disciples solides pour la nation congolaise.",
    tone: "from-ig-orange via-ig-gold to-ig-yellow",
  },
];

export const visionSteps = [
  {
    question: "Quelle est notre raison d'être ?",
    label: "Notre raison d'être",
    answer:
      "Révéler le cœur de Dieu à une génération congolaise assoiffée de sens, en faisant de chaque personne accueillie un disciple debout, utile à sa famille et à sa nation.",
    icon: "flame",
  },
  {
    question: "Où allons-nous ?",
    label: "Notre vision",
    answer:
      "Être d'ici 2035 une communauté de 50 000 disciples formés, implantée dans les 26 provinces, connue pour son intégrité, sa compassion et son excellence.",
    icon: "compass",
  },
  {
    question: "Comment y allons-nous ?",
    label: "Notre mission",
    answer:
      "Enseigner la Parole avec clarté, servir les plus fragiles avec dignité, former des leaders intègres et célébrer une adoration vivante, en présentiel comme en ligne.",
    icon: "target",
  },
  {
    question: "Qu'est-ce qui nous tient debout ?",
    label: "Nos valeurs",
    answer:
      "La foi, l'hospitalité, la transparence financière, le respect de la personne et le travail bien fait. Ce que nous faisons pour Dieu mérite l'excellence.",
    icon: "heart",
  },
] as const;

export type Leader = {
  name: string;
  role: string;
  initials: string;
  tone: string;
  short: string;
  bio: string;
  quote: string;
  since: string;
};

export const leaders: Leader[] = [
  {
    name: "Pasteur Emmanuel Kabasele",
    role: "Fondateur & Pasteur principal",
    initials: "EK",
    tone: "from-ig-blue to-ig-purple",
    short: "Théologien, bâtisseur, père spirituel de la maison.",
    bio: "Né à Kananga, Emmanuel Kabasele consacre sa vie au ministère depuis 1996. Diplômé en théologie pastorale et en gestion des organisations, il fonde l'Église Nouvelle Vie en 2003. Il a formé plus de 400 ouvriers et supervise aujourd'hui sept implantations à travers la RDC.",
    quote: "Une église qui ne sert pas sa ville n'a pas encore compris l'Évangile.",
    since: "Depuis 2003",
  },
  {
    name: "Maman Judith Kabasele",
    role: "Co-fondatrice & Ministère des femmes",
    initials: "JK",
    tone: "from-ig-magenta to-ig-orange",
    short: "Mentore de milliers de femmes et de mères de la communauté.",
    bio: "Judith Kabasele dirige le ministère des femmes et le pôle d'accompagnement familial. Assistante sociale de formation, elle a lancé le programme « Mama Sikia » qui soutient les mères célibataires par la formation professionnelle et le micro-crédit solidaire.",
    quote: "Relever une femme, c'est relever toute une génération.",
    since: "Depuis 2003",
  },
  {
    name: "Révérend Patrick Ilunga",
    role: "Président du conseil d'administration",
    initials: "PI",
    tone: "from-ig-indigo to-ig-pink",
    short: "Garant de la gouvernance et de la transparence financière.",
    bio: "Ancien cadre bancaire à Lubumbashi, Patrick Ilunga préside le conseil d'administration depuis 2012. Il a mis en place le système d'audit annuel indépendant et la publication trimestrielle des comptes de l'église.",
    quote: "La confiance se construit avec des chiffres clairs et un cœur droit.",
    since: "Depuis 2012",
  },
  {
    name: "Évangéliste Sarah Mbuyi",
    role: "Directrice de l'évangélisation",
    initials: "SM",
    tone: "from-ig-red to-ig-gold",
    short: "Stratège des campagnes et des sorties de terrain.",
    bio: "Sarah Mbuyi coordonne les campagnes d'évangélisation urbaines et rurales. En cinq ans, elle a organisé plus de 120 sorties et formé 300 évangélistes de rue, avec un accent particulier sur la jeunesse des quartiers populaires.",
    quote: "L'Évangile marche encore mieux à pied, dans la poussière des quartiers.",
    since: "Depuis 2017",
  },
  {
    name: "Diacre Joseph Mwamba",
    role: "Administration & Œuvres sociales",
    initials: "JM",
    tone: "from-ig-purple to-ig-blue",
    short: "Logistique, entraide et action sociale au quotidien.",
    bio: "Joseph Mwamba pilote les opérations : bâtiments, sécurité, distribution alimentaire et bourses scolaires. Son équipe accompagne chaque mois près de 800 familles vulnérables de Kinshasa.",
    quote: "Servir discrètement, c'est encore servir grandement.",
    since: "Depuis 2010",
  },
  {
    name: "Sœur Esther Lokwa",
    role: "Direction louange & médias",
    initials: "EL",
    tone: "from-ig-gold to-ig-magenta",
    short: "Voix, scène, studio et diffusion en direct.",
    bio: "Esther Lokwa dirige la chorale, l'orchestre et le studio média. Elle a produit quatre albums de louange en lingala et français et supervise la diffusion hebdomadaire des cultes en ligne.",
    quote: "L'adoration n'est pas un spectacle, c'est une rencontre.",
    since: "Depuis 2014",
  },
];

export type Department = {
  slug: string;
  name: string;
  tagline: string;
  vision: string;
  mission: string;
  lead: string;
  contact: string;
  hours: { day: string; time: string; place: string }[];
  urgent?: string;
  news: string;
  tone: string;
  icon: string;
};

export const departments: Department[] = [
  {
    slug: "louange",
    name: "Louange & Adoration",
    tagline: "Chorale, orchestre et conduite de culte",
    vision: "Faire de chaque culte un lieu où la présence de Dieu se manifeste sans artifice.",
    mission: "Former des adorateurs disciplinés, préparer les répertoires et accompagner musicalement toutes les célébrations.",
    lead: "Sœur Esther Lokwa",
    contact: "+243 810 000 101",
    hours: [
      { day: "Mercredi", time: "17:00 – 19:30", place: "Salle de répétition" },
      { day: "Samedi", time: "15:00 – 18:00", place: "Temple principal" },
      { day: "Dimanche", time: "07:30 – 12:00", place: "Temple principal" },
    ],
    urgent: "Répétition générale exceptionnelle vendredi 20h (concert d'action de grâce).",
    news: "Concert d'action de grâce le 15 août — auditions ouvertes jusqu'au 05 août.",
    tone: "from-ig-blue to-ig-purple",
    icon: "music",
  },
  {
    slug: "jeunesse",
    name: "Jeunesse & Étudiants",
    tagline: "12 à 30 ans, la génération montante",
    vision: "Une jeunesse congolaise qui aime Dieu, réussit ses études et refuse la médiocrité.",
    mission: "Encadrer, enseigner, orienter professionnellement et créer des espaces sains de fraternité.",
    lead: "Frère Christian Bofila",
    contact: "+243 810 000 102",
    hours: [
      { day: "Vendredi", time: "17:30 – 20:00", place: "Salle Bethel" },
      { day: "Samedi", time: "10:00 – 12:00", place: "Espace jeunes" },
    ],
    news: "Camp jeunesse « Debout » du 12 au 15 août à Kisantu — 200 places.",
    tone: "from-ig-purple to-ig-pink",
    icon: "users",
  },
  {
    slug: "intercession",
    name: "Intercession",
    tagline: "Prière, veillées et combat spirituel",
    vision: "Couvrir l'église, les familles et la nation par une prière constante et informée.",
    mission: "Organiser les veillées, les chaînes de jeûne et l'accompagnement personnalisé en prière.",
    lead: "Maman Béatrice Nsimba",
    contact: "+243 810 000 103",
    hours: [
      { day: "Mardi", time: "05:00 – 06:30", place: "Chapelle" },
      { day: "Jeudi", time: "18:00 – 20:00", place: "Chapelle" },
      { day: "Dernier vendredi", time: "21:00 – 04:00", place: "Temple principal" },
    ],
    urgent: "Chaîne de jeûne de 3 jours dès lundi pour la paix à l'Est du pays.",
    news: "Nuit de prière nationale le 31 juillet à 20h, en présentiel et en direct.",
    tone: "from-ig-indigo to-ig-magenta",
    icon: "hands",
  },
  {
    slug: "evangelisation",
    name: "Évangélisation",
    tagline: "Sorties de terrain et campagnes",
    vision: "Que chaque quartier de Kinshasa entende une bonne nouvelle claire et respectueuse.",
    mission: "Former les évangélistes, organiser les sorties hebdomadaires et suivre les nouveaux convertis.",
    lead: "Évangéliste Sarah Mbuyi",
    contact: "+243 810 000 104",
    hours: [
      { day: "Samedi", time: "07:30 – 11:00", place: "Départ parvis du temple" },
      { day: "Dimanche", time: "15:00 – 17:00", place: "Quartiers assignés" },
    ],
    news: "Sortie évangélique à Matonge le 02 août — mobilisation générale.",
    tone: "from-ig-red to-ig-orange",
    icon: "megaphone",
  },
  {
    slug: "social",
    name: "Œuvres sociales",
    tagline: "Entraide, santé et bourses scolaires",
    vision: "Une église qui soulage concrètement la souffrance autour d'elle.",
    mission: "Distribuer l'aide alimentaire, financer les frais scolaires et organiser les cliniques mobiles.",
    lead: "Diacre Joseph Mwamba",
    contact: "+243 810 000 105",
    hours: [
      { day: "Lundi", time: "09:00 – 15:00", place: "Bureau social" },
      { day: "Mercredi", time: "09:00 – 13:00", place: "Entrepôt" },
    ],
    news: "Distribution de kits scolaires le 24 août — inscriptions des familles ouvertes.",
    tone: "from-ig-orange to-ig-gold",
    icon: "heart",
  },
  {
    slug: "enfants",
    name: "École du dimanche",
    tagline: "Enfants de 3 à 11 ans",
    vision: "Poser dans le cœur des enfants des fondations bibliques joyeuses et solides.",
    mission: "Enseigner par le jeu, sécuriser les enfants pendant le culte et accompagner les parents.",
    lead: "Sœur Rachel Ngoy",
    contact: "+243 810 000 106",
    hours: [
      { day: "Dimanche", time: "09:00 – 12:00", place: "Pavillon des enfants" },
      { day: "Samedi", time: "10:00 – 11:30", place: "Salle Étoile" },
    ],
    news: "Fête des enfants le 18 août : spectacle, goûter et remise de prix.",
    tone: "from-ig-gold to-ig-yellow",
    icon: "star",
  },
];

export type Program = {
  day: string;
  short: string;
  items: { time: string; title: string; dept: string; place: string; tag?: string }[];
};

export const weekProgram: Program[] = [
  {
    day: "Lundi",
    short: "Lun",
    items: [
      { time: "09:00", title: "Permanence sociale", dept: "Œuvres sociales", place: "Bureau social" },
      { time: "18:00", title: "École biblique — niveau 1", dept: "Formation", place: "Salle Bethel" },
    ],
  },
  {
    day: "Mardi",
    short: "Mar",
    items: [
      { time: "05:00", title: "Prière de l'aube", dept: "Intercession", place: "Chapelle" },
      { time: "18:30", title: "Cellule de quartier", dept: "Cellules", place: "Domiciles" },
    ],
  },
  {
    day: "Mercredi",
    short: "Mer",
    items: [
      { time: "17:00", title: "Répétition chorale", dept: "Louange", place: "Salle de répétition" },
      { time: "18:30", title: "Culte d'enseignement", dept: "Pastorale", place: "Temple principal", tag: "Culte" },
    ],
  },
  {
    day: "Jeudi",
    short: "Jeu",
    items: [
      { time: "18:00", title: "Intercession générale", dept: "Intercession", place: "Chapelle" },
      { time: "19:30", title: "Formation des ouvriers", dept: "Formation", place: "Salle Bethel" },
    ],
  },
  {
    day: "Vendredi",
    short: "Ven",
    items: [
      { time: "17:30", title: "Culte des jeunes", dept: "Jeunesse", place: "Salle Bethel", tag: "Culte" },
      { time: "21:00", title: "Veillée mensuelle", dept: "Intercession", place: "Temple principal", tag: "Mensuel" },
    ],
  },
  {
    day: "Samedi",
    short: "Sam",
    items: [
      { time: "07:30", title: "Sortie d'évangélisation", dept: "Évangélisation", place: "Quartiers" },
      { time: "10:00", title: "Club des enfants", dept: "École du dimanche", place: "Salle Étoile" },
      { time: "15:00", title: "Répétition générale", dept: "Louange", place: "Temple principal" },
    ],
  },
  {
    day: "Dimanche",
    short: "Dim",
    items: [
      { time: "07:00", title: "Premier culte", dept: "Pastorale", place: "Temple principal", tag: "Culte" },
      { time: "09:00", title: "Culte principal", dept: "Pastorale", place: "Temple principal", tag: "Culte" },
      { time: "09:00", title: "École du dimanche", dept: "Enfants", place: "Pavillon des enfants" },
      { time: "15:00", title: "Suivi des nouveaux", dept: "Accueil", place: "Salle d'accueil" },
    ],
  },
];

export const upcomingWeeks = [
  { date: "02 – 08 août", title: "Semaine de la famille", detail: "Séminaire couples mardi et jeudi 18h, culte familial dimanche 09h.", tone: "from-ig-blue to-ig-purple" },
  { date: "09 – 15 août", title: "Camp jeunesse « Debout »", detail: "Départ vendredi 06h pour Kisantu, retour lundi. Culte de clôture dimanche 15h.", tone: "from-ig-purple to-ig-pink" },
  { date: "16 – 22 août", title: "Semaine d'action de grâce", detail: "Concert le samedi 19h, culte de reconnaissance dimanche 09h.", tone: "from-ig-pink to-ig-orange" },
  { date: "23 – 29 août", title: "Rentrée scolaire solidaire", detail: "Distribution de kits samedi 09h, prière pour les élèves dimanche.", tone: "from-ig-orange to-ig-gold" },
];
