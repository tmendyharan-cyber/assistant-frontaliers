// À renseigner avant la mise en ligne.
// WAITLIST_ENDPOINT : URL d'un service de formulaire (ex. Formspree) qui reçoit l'e-mail en POST.
// Tant qu'elle est vide, le formulaire de liste d'attente n'est pas affiché.
export const WAITLIST_ENDPOINT = "";

// Mesure d'audience sans cookie. Désactivée tant que provider est vide.
// provider : "plausible" ou "umami".
// - Plausible : domain = "tmendyharan-cyber.github.io" (le domaine déclaré dans Plausible),
//   src = "https://plausible.io/js/script.js" (ou l'URL de votre instance).
// - Umami : websiteId = l'identifiant du site dans Umami, src = l'URL du script de votre instance.
// Pensez à mettre à jour la section « Mesure d'audience » de confidentialite.html en l'activant.
export const ANALYTICS = {
  provider: "",
  src: "",
  domain: "",
  websiteId: "",
};
