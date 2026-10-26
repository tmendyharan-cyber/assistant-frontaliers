// Formulaire d'inscription aux rappels intégré aux guides. Affiché seulement si WAITLIST_ENDPOINT est renseigné.
// Seuls l'e-mail, le consentement et l'origine (guide, canal) sont envoyés.
import { WAITLIST_ENDPOINT } from "./config.js";
import { track } from "./analytics.js";

const src = new URLSearchParams(location.search).get("src") || "";

for (const form of document.querySelectorAll("form[data-signup]")) {
  if (!WAITLIST_ENDPOINT) continue;
  form.action = WAITLIST_ENDPOINT;
  form.elements.canal.value = src;
  form.closest("[hidden]")?.removeAttribute("hidden");
  const status = form.querySelector(".form-status");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    try {
      const res = await fetch(WAITLIST_ENDPOINT, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(String(res.status));
      track("Inscription rappel", { origine: form.elements.origine.value, canal: src });
      form.replaceChildren(Object.assign(document.createElement("p"), { className: "form-status", textContent: "C'est noté : vous recevrez un rappel." }));
    } catch {
      status.textContent = "L'envoi n'a pas abouti. Réessayez dans un instant.";
      button.disabled = false;
    }
  });
}
