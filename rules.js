// Règles de la checklist. Chaque règle porte une source officielle et un statut de vérification.
// Statut "a_verifier" = à confirmer avec la notice officielle de la campagne en cours avant mise en ligne.
// AUCUN calcul d'impôt ici : l'outil ne fait que renvoyer vers les formulaires et pièces à prévoir.

export const QUESTIONS = [
  {
    id: "canton",
    label: "Dans quel canton travaillez-vous ?",
    type: "choice",
    options: [
      { value: "GE", label: "Genève" },
      { value: "VD", label: "Vaud" },
      { value: "VS", label: "Valais" },
      { value: "NE", label: "Neuchâtel" },
      { value: "JU", label: "Jura" },
      { value: "BE", label: "Berne" },
      { value: "BS", label: "Bâle-Ville" },
      { value: "BL", label: "Bâle-Campagne" },
      { value: "SO", label: "Soleure" },
      { value: "AUTRE", label: "Autre canton" },
    ],
  },
  {
    id: "compteSuisse",
    label: "Avez-vous un ou plusieurs comptes bancaires en Suisse (y compris compte de salaire, 3e pilier, compte épargne) ?",
    type: "yesno",
  },
  {
    id: "teletravail",
    label: "Avez-vous télétravaillé depuis la France ?",
    type: "yesno",
  },
  {
    id: "famille",
    label: "Votre foyer comprend-il un conjoint ou des enfants à charge ?",
    type: "yesno",
  },
  {
    id: "revenuConjoint",
    label: "Votre conjoint a-t-il des revenus (France ou Suisse) ?",
    type: "yesno",
    showIf: (a) => a.famille === "oui",
  },
];

// Chaque règle : quand elle s'applique, et ce qu'elle ajoute à la checklist.
export const RULES = [
  {
    id: "declaration-base",
    when: () => true,
    title: "Déclaration de revenus française (2042) avec revenus de source étrangère",
    detail:
      "Vous êtes résident fiscal français : vous déclarez vos revenus en France, y compris ceux perçus en Suisse. La façon de les déclarer dépend du canton (voir les points suivants).",
    source: { label: "impots.gouv.fr — formulaires 2042 et 2047", url: "https://www.impots.gouv.fr" },
    status: "a_verifier",
  },
  {
    id: "canton-source",
    when: (a) => a.canton === "GE",
    title: "Salaire genevois : formulaire 2047 (rubrique Suisse), reporté sur la 2042",
    detail:
      "Le salaire genevois se déclare sur la 2047 (Suisse), puis les montants sont reportés sur la 2042 (cases 1AF et 8TK d'après une source secondaire). Il ouvre droit à un crédit d'impôt égal à l'impôt français, pour éviter la double imposition. Les cotisations suisses déductibles (cotisations sociales, LPP obligatoire, LAMal de base ou CMU) se placent aux bons endroits, et la case 8SH concerne les affiliés à la LAMal. L'attestation 2041-AS n'est pas nécessaire pour un salarié à Genève. Taux de change : celui publié dans la notice de la 2047 de l'année.",
    source: { label: "impot-quasi-resident.ch (source secondaire) — à recouper avec la notice 2047 officielle", url: "https://www.impot-quasi-resident.ch/impots/impots-francais/" },
    status: "a_verifier",
  },
  {
    id: "canton-autre",
    when: (a) => a.canton === "AUTRE",
    title: "Canton non couvert par cette version",
    detail:
      "Cette version couvre Genève et les cantons de l'accord de 1983. Pour un autre canton, consultez directement la notice officielle de la 2047.",
    source: { label: "impots.gouv.fr", url: "https://www.impots.gouv.fr" },
    status: "a_verifier",
  },
  {
    id: "canton-france",
    when: (a) => ["VD", "VS", "NE", "JU", "BE", "BS", "BL", "SO"].includes(a.canton),
    title: "Canton imposé en France : attestation 2041-AS et imposition en France",
    detail:
      "Les huit cantons de l'accord de 1983 (BE, BS, BL, JU, NE, SO, VD, VS) relèvent d'un régime où l'imposition se fait en France. Le régime applicable à VD et aux nouveaux frontaliers doit être confirmé sur la notice officielle.",
    source: { label: "impots.gouv.fr — formulaire 2041-AS", url: "https://www.impots.gouv.fr" },
    status: "a_verifier",
  },
  {
    id: "3916",
    when: (a) => a.compteSuisse === "oui",
    title: "Déclarer vos comptes bancaires suisses (formulaire 3916)",
    detail:
      "Les comptes détenus, utilisés, ouverts ou clos à l'étranger pendant l'année se déclarent en joignant le formulaire à la déclaration 2042. Un compte non déclaré expose à une amende de 1 500 € par compte (10 000 € si le pays n'a pas de convention d'assistance administrative avec la France). Les contrats de 3e pilier auprès d'un assureur suisse sont à déclarer aussi (source secondaire : cases 8UU pour les comptes et 8TT pour les contrats).",
    source: { label: "impots.gouv.fr — notice 3916", url: "https://static.impots.gouv.fr/tdir/static/2026-03-30T16:36:08Z/aide/notices/notices2020/3916/notice3916.pdf" },
    status: "verifie",
  },
  {
    id: "quasi-resident",
    when: (a) => a.canton === "GE",
    title: "Quasi-résident genevois : taxation ordinaire ultérieure (TOU)",
    detail:
      "Condition principale : au moins 90 % de vos revenus bruts mondiaux annuels (conjoint compris) sont imposables en Suisse. D'autres situations ouvrent aussi la TOU sur demande (déductions impossibles dans le pays de résidence, prévoyance étrangère reconnue, garde alternée). La demande doit être renouvelée chaque année. Elle se fait avec le formulaire DRIS/TOU (en ligne ou par courrier), qui doit parvenir à l'administration fiscale genevoise au plus tard le 31 mars de l'année suivant le prélèvement de l'impôt, même s'il manque des justificatifs. Attention : une fois déposée, la demande ne peut plus être annulée, même si la taxation finale est défavorable.",
    source: { label: "ge.ch — taxation ordinaire ultérieure", url: "https://www.ge.ch/demande-rectification-taxation-ordinaire-ulterieure/quand-demander-annoncer-taxation-ordinaire-ulterieure" },
    moreSources: [
      { label: "ge.ch — formulaire DRIS/TOU : délai et irrévocabilité", url: "https://www.ge.ch/demande-rectification-taxation-ordinaire-ulterieure/comment-remplir-formulaire-dris/tou" },
    ],
    status: "verifie",
  },
  {
    id: "teletravail",
    when: (a) => a.teletravail === "oui",
    title: "Télétravail depuis la France : points d'attention",
    detail:
      "Le télétravail depuis la France peut avoir des effets sur la fiscalité et sur les cotisations sociales. Les règles dépendent du pays d'emploi et d'un seuil de jours : consultez la notice officielle avant de déclarer.",
    source: { label: "impots.gouv.fr — frontaliers", url: "https://www.impots.gouv.fr" },
    status: "a_verifier",
  },
  {
    id: "foyer",
    when: (a) => a.famille === "oui",
    title: "Foyer : déclarer conjoint et personnes à charge",
    detail:
      "Rassemblez les justificatifs de situation familiale. Les revenus du conjoint, en France ou en Suisse, doivent être déclarés dans la déclaration commune.",
    source: { label: "impots.gouv.fr — déclaration en couple", url: "https://www.impots.gouv.fr" },
    status: "a_verifier",
  },
];

export const DOCUMENTS = [
  "Certificat de salaire suisse (formulaire 11 ou équivalent) de l'année concernée",
  "Relevés annuels de vos comptes suisses (solde et intérêts)",
  "Avis d'imposition français de l'année précédente",
  "Justificatifs de votre situation familiale",
];

export const DISCLAIMER =
  "Cet outil d'information s'appuie sur des notices officielles. Il ne fournit ni conseil fiscal personnalisé ni calcul d'impôt. Vérifiez chaque point sur impots.gouv.fr ou auprès de l'administration fiscale compétente.";
