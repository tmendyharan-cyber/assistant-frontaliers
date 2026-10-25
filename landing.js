// Page d'accueil : formules, pré-inscription, effets visuels. Aucune donnée n'est envoyée,
// sauf l'e-mail du formulaire de pré-inscription (si WAITLIST_ENDPOINT est renseigné), avec consentement.
import { PLANS, WAITLIST_ENDPOINT } from "./config.js";
import { track } from "./analytics.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let billing = "yearly";
let chosenPlan = "essentiel";

// Canal d'arrivée, pour savoir quelle communication fonctionne. Facultatif pour le visiteur.
// Un lien partagé avec ?src=facebook (ou reddit, linkedin…) pré-sélectionne le canal.
const CHANNELS = [
  { value: "", label: "Choisir (facultatif)" },
  { value: "facebook", label: "Groupe Facebook" },
  { value: "reddit", label: "Reddit" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "google", label: "Recherche Google" },
  { value: "bouche-a-oreille", label: "Un collègue ou un proche" },
  { value: "association", label: "Association de frontaliers" },
  { value: "autre", label: "Autre" },
];
const srcParam = new URLSearchParams(location.search).get("src");
const arrivalChannel = CHANNELS.some((c) => c.value && c.value === srcParam) ? srcParam : "";

function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") node.className = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of children) node.append(c);
  return node;
}

const euro = (n) => n.toLocaleString("fr-FR", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }) + " €";

// --- Formules ---
function renderPlans() {
  const box = document.getElementById("plans");
  box.replaceChildren(
    ...PLANS.map((p) => {
      const price = billing === "yearly" ? p.yearly : p.monthly;
      const unit = p.monthly === 0 ? "pour toujours" : billing === "yearly" ? "/ an" : "/ mois";
      const cta = p.monthly === 0
        ? el("a", { class: "btn", href: "#assistant" }, "Commencer")
        : el("button", { type: "button", class: p.highlight ? "primary" : "", onclick: () => choosePlan(p.id) }, `Réserver ${p.name}`);
      return el(
        "div",
        { class: "plan" + (p.highlight ? " highlight" : "") },
        p.highlight ? el("span", { class: "tag" }, "Le plus choisi") : "",
        el("h3", {}, p.name),
        el("p", { class: "pitch" }, p.pitch),
        el("div", { class: "price" }, euro(price), " ", el("small", {}, unit)),
        el("ul", {}, ...p.features.map((f) => el("li", {}, f))),
        cta
      );
    })
  );
  const paid = PLANS.filter((p) => p.monthly > 0);
  const best = Math.max(...paid.map((p) => 1 - p.yearly / (p.monthly * 12)));
  document.getElementById("save").textContent = best > 0 ? `jusqu'à −${Math.floor(best * 100)} %` : "";
}

for (const b of document.querySelectorAll("[data-billing]")) {
  b.addEventListener("click", () => {
    billing = b.dataset.billing;
    for (const o of document.querySelectorAll("[data-billing]")) o.setAttribute("aria-pressed", String(o === b));
    renderPlans();
    syncForm();
  });
}

function choosePlan(id) {
  chosenPlan = id;
  track("Choix formule", { formule: id, periodicite: billing });
  syncForm();
  const target = document.getElementById("liste");
  target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  const field = document.getElementById("waitlist-email");
  if (field) field.focus({ preventScroll: true });
  else {
    const heading = target.querySelector("h3");
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }
}

// --- Pré-inscription ---
function syncForm() {
  const plan = document.getElementById("waitlist-plan");
  const per = document.getElementById("waitlist-billing");
  if (plan) plan.value = chosenPlan;
  if (per) per.value = billing;
}

function renderWaitlist() {
  const box = document.getElementById("waitlist");
  if (!WAITLIST_ENDPOINT) {
    box.replaceChildren(
      el("p", {}, "La pré-inscription ouvre très prochainement. En attendant, la checklist gratuite est disponible ci-dessus.")
    );
    return;
  }
  const paid = PLANS.filter((p) => p.monthly > 0);
  const status = el("p", { class: "form-status", role: "status", "aria-live": "polite" });
  const form = el(
    "form",
    { method: "post", action: WAITLIST_ENDPOINT },
    el("p", {}, "Laissez votre e-mail : seule cette adresse est conservée, avec votre accord, pour vous prévenir à l'ouverture. Aucun paiement. ", el("a", { href: "confidentialite.html" }, "Politique de confidentialité")),
    el("label", { for: "waitlist-plan" }, "Formule qui vous intéresse"),
    el("select", { id: "waitlist-plan", name: "formule" }, ...paid.map((p) => el("option", { value: p.id }, p.name))),
    el("input", { type: "hidden", id: "waitlist-billing", name: "periodicite", value: billing }),
    el("label", { for: "waitlist-email" }, "Adresse e-mail"),
    el("input", { type: "email", id: "waitlist-email", name: "email", required: "", autocomplete: "email", placeholder: "vous@exemple.fr" }),
    el("label", { for: "waitlist-channel" }, "Comment nous avez-vous connu ?"),
    el("select", { id: "waitlist-channel", name: "canal" }, ...CHANNELS.map((c) => {
      const o = el("option", { value: c.value }, c.label);
      if (c.value === arrivalChannel) o.selected = true;
      return o;
    })),
    el("label", { class: "check" }, el("input", { type: "checkbox", name: "consentement", value: "oui", required: "" }), el("span", {}, "J'accepte que mon adresse soit conservée pour être prévenu de l'ouverture des formules.")),
    el("div", { class: "actions" }, el("button", { class: "primary", type: "submit" }, "Réserver ma place")),
    status
  );
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    try {
      const res = await fetch(WAITLIST_ENDPOINT, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(String(res.status));
      track("Pre-inscription", { formule: form.formule.value, periodicite: form.periodicite.value, canal: form.canal.value });
      form.replaceChildren(el("p", { class: "form-status", role: "status" }, "Merci ! Vous serez prévenu à l'ouverture."));
    } catch {
      status.textContent = "L'envoi n'a pas abouti. Réessayez dans un instant.";
      button.disabled = false;
    }
  });
  form.addEventListener("change", (e) => { if (e.target.name === "formule") chosenPlan = e.target.value; });
  box.replaceChildren(form);
  syncForm();
}

// --- Carte en perspective qui suit le pointeur ---
const tilt = document.getElementById("tilt");
if (tilt && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
  const scene = tilt.parentElement.closest(".hero");
  scene.addEventListener("pointermove", (e) => {
    const r = scene.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    tilt.style.setProperty("--ry", `${(-14 + x * 18).toFixed(2)}deg`);
    tilt.style.setProperty("--rx", `${(8 - y * 14).toFixed(2)}deg`);
  });
  scene.addEventListener("pointerleave", () => { tilt.style.removeProperty("--ry"); tilt.style.removeProperty("--rx"); });
}

// --- Apparition au défilement ---
const items = document.querySelectorAll(".reveal");
if (reduceMotion || !("IntersectionObserver" in window)) {
  for (const i of items) i.classList.add("in");
} else {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }, { rootMargin: "0px 0px -8% 0px" });
  for (const i of items) io.observe(i);
}

renderPlans();
renderWaitlist();
