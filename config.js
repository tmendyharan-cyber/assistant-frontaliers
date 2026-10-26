// À renseigner avant la mise en ligne.
// WAITLIST_ENDPOINT : URL d'un service de formulaire (ex. Formspree) qui reçoit l'e-mail en POST.
// Tant qu'elle est vide, le formulaire de liste d'attente n'est pas affiché.
export const WAITLIST_ENDPOINT = "https://formspree.io/f/myeeeedw";

// Mesure d'audience sans cookie. Désactivée tant que provider est vide.
// provider : "plausible" ou "umami".
// - Plausible : domain = "declicfrontalier.fr" (le domaine déclaré dans Plausible),
//   src = "https://plausible.io/js/script.js" (ou l'URL de votre instance).
// - Umami : websiteId = l'identifiant du site dans Umami, src = l'URL du script de votre instance.
// Pensez à mettre à jour la section « Mesure d'audience » de confidentialite.html en l'activant.
export const ANALYTICS = {
  provider: "",
  src: "",
  domain: "",
  websiteId: "",
};

// Formules affichées sur la page de tarifs. Prix de lancement indicatifs : aucun paiement n'est encaissé,
// le bouton inscrit seulement sur la liste d'attente avec la formule choisie (test de la demande).
// Ne listez ici que des fonctionnalités d'information : pas de calcul d'impôt, pas de conseil personnalisé.
export const PLANS = [
  {
    id: "gratuit",
    name: "Gratuit",
    monthly: 0,
    yearly: 0,
    pitch: "Pour savoir quoi préparer.",
    features: [
      "Checklist des formulaires et des pièces",
      "Source officielle pour chaque point",
      "Impression ou PDF",
    ],
  },
  {
    id: "essentiel",
    name: "Essentiel",
    monthly: 3.9,
    yearly: 29,
    highlight: true,
    pitch: "Pour ne rien oublier, chaque année.",
    features: [
      "Tout le gratuit",
      "Checklist sauvegardée d'une année sur l'autre",
      "Rappels des dates (déclaration française, DRIS/TOU)",
      "Alerte quand une notice officielle change",
      "Guide pas à pas des formulaires, avec sources",
    ],
  },
  {
    id: "foyer",
    name: "Foyer",
    monthly: 6.9,
    yearly: 49,
    pitch: "Pour les couples et les situations mixtes.",
    features: [
      "Tout Essentiel",
      "Plusieurs situations dans un même foyer (ex. Genève et Vaud)",
      "Dossier PDF complet avec la liste des justificatifs",
      "Historique sur plusieurs années",
      "Aide sur l'utilisation de l'outil par e-mail (réponse sous 72 h)",
    ],
  },
];
