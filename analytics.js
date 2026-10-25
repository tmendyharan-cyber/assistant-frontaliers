// Charge le script de mesure d'audience sans cookie, seulement s'il est configuré dans config.js.
// Importé par toutes les pages du site. Aucune requête n'est faite tant que ANALYTICS.provider est vide.
import { ANALYTICS } from "./config.js";

const { provider, src, domain, websiteId } = ANALYTICS;

if (src && ((provider === "plausible" && domain) || (provider === "umami" && websiteId))) {
  const s = document.createElement("script");
  s.defer = true;
  s.src = src;
  if (provider === "plausible") s.dataset.domain = domain;
  else s.dataset.websiteId = websiteId;
  document.head.append(s);
}
