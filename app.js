import { QUESTIONS, RULES, DOCUMENTS, DISCLAIMER } from "./rules.js";
import { WAITLIST_ENDPOINT } from "./config.js";
import { track } from "./analytics.js";

const app = document.getElementById("app");
document.getElementById("disc").textContent = DISCLAIMER;

// Les réponses ne quittent jamais le navigateur : aucune requête réseau, aucun stockage.
const answers = {};
let index = 0;
let firstRender = true;

const visibleQuestions = () => QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));

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

// Après chaque changement d'écran, place le focus sur le titre pour les lecteurs d'écran et le clavier.
function focusHeading(node) {
  if (firstRender) { firstRender = false; return; }
  node.focus();
}

function renderQuestion() {
  const qs = visibleQuestions();
  if (index >= qs.length) return renderResult();
  const q = qs[index];
  const options =
    q.type === "yesno"
      ? [{ value: "oui", label: "Oui" }, { value: "non", label: "Non" }]
      : q.options;

  const opts = el("div", { class: "opts", role: "group", "aria-labelledby": "q-label" });
  for (const o of options) {
    opts.append(
      el(
        "button",
        {
          type: "button",
          "aria-pressed": answers[q.id] === o.value ? "true" : "false",
          onclick: () => {
            answers[q.id] = o.value;
            index += 1;
            renderQuestion();
          },
        },
        o.label
      )
    );
  }

  const heading = el("h2", { class: "q", id: "q-label", tabindex: "-1" }, q.label);
  const progress = el("div", { class: "progress", "aria-hidden": "true" }, el("span", { style: `width:${Math.round((index / qs.length) * 100)}%` }));
  app.replaceChildren(
    el(
      "div",
      { class: "card fade-in" },
      progress,
      el("div", { class: "step" }, `Question ${index + 1} sur ${qs.length}`),
      heading,
      opts,
      index > 0
        ? el("div", { class: "actions" }, el("button", { type: "button", onclick: () => { index -= 1; renderQuestion(); } }, "Retour"))
        : ""
    )
  );
  focusHeading(heading);
}

// Inscription aux rappels après la checklist. Seuls l'e-mail et le consentement sont envoyés :
// les réponses au questionnaire ne quittent pas le navigateur.
function reminderCard() {
  const card = el("div", { class: "card upsell", id: "rappel" });
  card.append(el("h3", {}, "Recevoir un rappel avant la déclaration 2027"));
  if (!WAITLIST_ENDPOINT) {
    card.append(el("p", {}, "Les formules en préparation sauvegardent votre checklist et vous rappellent les dates."), el("a", { class: "btn btn-primary", href: "#tarifs" }, "Voir les formules"));
    return card;
  }
  const src = new URLSearchParams(location.search).get("src") || "";
  const status = el("p", { class: "form-status", role: "status", "aria-live": "polite" });
  const form = el(
    "form",
    { method: "post", action: WAITLIST_ENDPOINT },
    el("p", {}, "Un e-mail gratuit quand les documents officiels de la campagne 2027 sortent, et à l'ouverture des formules. Seule votre adresse est conservée, pas vos réponses. ", el("a", { href: "confidentialite.html" }, "Confidentialité")),
    el("input", { type: "hidden", name: "formule", value: "rappels-gratuits" }),
    el("input", { type: "hidden", name: "origine", value: "checklist" }),
    el("input", { type: "hidden", name: "canal", value: src }),
    el("label", { for: "rappel-email" }, "Adresse e-mail"),
    el("input", { type: "email", id: "rappel-email", name: "email", required: "", autocomplete: "email", placeholder: "vous@exemple.fr" }),
    el("label", { class: "check" }, el("input", { type: "checkbox", name: "consentement", value: "oui", required: "" }), el("span", {}, "J'accepte que mon adresse soit conservée pour recevoir ces rappels.")),
    el("div", { class: "actions" }, el("button", { class: "primary", type: "submit" }, "Recevoir le rappel"), el("a", { class: "btn", href: "#tarifs" }, "Voir les formules")),
    status
  );
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    try {
      const res = await fetch(WAITLIST_ENDPOINT, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(String(res.status));
      track("Inscription rappel", { canal: src });
      form.replaceChildren(el("p", { class: "form-status", role: "status" }, "C'est noté : vous recevrez un rappel."));
    } catch {
      status.textContent = "L'envoi n'a pas abouti. Réessayez dans un instant.";
      button.disabled = false;
    }
  });
  card.append(form);
  return card;
}

export function applicableRules(a) {
  return RULES.filter((r) => r.when(a));
}

function renderResult() {
  const rules = applicableRules(answers);
  const heading = el("h2", { tabindex: "-1" }, "Votre checklist");
  const nodes = [heading];

  for (const r of rules) {
    const card = el("div", { class: "card rule" });
    if (r.status === "a_verifier") card.append(el("span", { class: "badge" }, "À confirmer avec la notice officielle"));
    card.append(
      el("h3", {}, r.title),
      el("p", {}, r.detail)
    );
    // Une règle peut citer plusieurs sources : la principale, puis les complémentaires (moreSources).
    const links = [r.source, ...(r.moreSources || [])].map((src) =>
      el("a", { href: src.url, target: "_blank", rel: "noopener noreferrer" }, src.label, el("span", { class: "sr-only" }, " (nouvel onglet)"))
    );
    card.append(...links.flatMap((a, i) => (i ? [el("br"), a] : [a])));
    if (r.guide) card.append(el("p", { class: "guide-link" }, el("a", { href: r.guide }, "Lire le guide détaillé →")));
    nodes.push(card);
  }

  const docs = el("div", { class: "card" }, el("h3", {}, "Pièces à réunir"));
  const ul = el("ul");
  for (const d of DOCUMENTS) ul.append(el("li", {}, d));
  docs.append(ul);
  nodes.push(docs);

  nodes.push(reminderCard());

  nodes.push(
    el(
      "div",
      { class: "actions" },
      el("button", { type: "button", class: "primary", onclick: () => window.print() }, "Imprimer / enregistrer en PDF"),
      el("button", { type: "button", onclick: () => { for (const k of Object.keys(answers)) delete answers[k]; index = 0; renderQuestion(); } }, "Recommencer")
    )
  );
  app.replaceChildren(...nodes);
  focusHeading(heading);
}

renderQuestion();
