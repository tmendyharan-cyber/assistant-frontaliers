import { QUESTIONS, RULES, DOCUMENTS, DISCLAIMER } from "./rules.js";
import { WAITLIST_ENDPOINT } from "./config.js";

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
  app.replaceChildren(
    el(
      "div",
      { class: "card" },
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
      el("p", {}, r.detail),
      el("a", { href: r.source.url, target: "_blank", rel: "noopener noreferrer" }, r.source.label, el("span", { class: "sr-only" }, " (nouvel onglet)"))
    );
    nodes.push(card);
  }

  const docs = el("div", { class: "card" }, el("h3", {}, "Pièces à réunir"));
  const ul = el("ul");
  for (const d of DOCUMENTS) ul.append(el("li", {}, d));
  docs.append(ul);
  nodes.push(docs);

  if (WAITLIST_ENDPOINT) {
    const form = el(
      "form",
      { class: "card", method: "post", action: WAITLIST_ENDPOINT },
      el("h3", {}, "Être prévenu pour la campagne 2027"),
      el("p", {}, "Laissez votre e-mail : seule cette adresse est conservée, avec votre accord, pour vous prévenir à l'ouverture de la version complète. ", el("a", { href: "confidentialite.html" }, "Politique de confidentialité")),
      el("label", { for: "waitlist-email" }, "Adresse e-mail"),
      el("input", { type: "email", id: "waitlist-email", name: "email", required: "", autocomplete: "email", placeholder: "vous@exemple.fr" }),
      el("label", {}, el("input", { type: "checkbox", name: "consentement", value: "oui", required: "" }), " J'accepte que mon adresse soit conservée pour être prévenu de l'ouverture de la version complète."),
      el("button", { class: "primary", type: "submit" }, "M'inscrire")
    );
    nodes.push(form);
  }

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
