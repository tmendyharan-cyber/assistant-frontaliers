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
    title: "Déclaration de revenus française (2042) avec l'annexe 2047",
    detail:
      "Vous êtes domicilié en France : vos revenus de source étrangère, dont ceux perçus en Suisse, se déclarent en France. L'annexe 2047 (revenus de source étrangère ou encaissés à l'étranger) est obligatoire. Si vous déclarez en ligne, sélectionnez les annexes en début de déclaration (« Déclarations annexes ») pour bénéficier des reports automatiques. La façon de déclarer le salaire dépend du canton (voir les points suivants).",
    source: { label: "impots.gouv.fr — notice 2047, revenus 2025", url: "https://www.impots.gouv.fr/sites/default/files/formulaires/2047/2026/2047_5490.pdf" },
    moreSources: [
      { label: "impots.gouv.fr — annexe 2047-SUISSE, revenus 2025", url: "https://www.impots.gouv.fr/sites/default/files/formulaires/2047/2026/2047_5489.pdf" },
    ],
    status: "verifie",
  },
  {
    id: "canton-source",
    when: (a) => a.canton === "GE",
    title: "Salaire genevois : annexe 2047-SUISSE, puis 2047 et 2042 (cases 1AF et 8TK)",
    detail:
      "Genève relève du « cas 2 » de l'annexe 2047-SUISSE : le salaire est déclaré et imposé en France, sous déduction d'un crédit d'impôt égal à l'impôt français, si votre salaire a bien été soumis au barème normal de l'impôt à la source suisse (sinon, l'annexe renvoie au cas 3). Remplissez un feuillet 2047-SUISSE par canton et par frontalier, à partir de votre certificat de salaire, en retirant les charges listées par l'annexe (cotisations AVS-AI-APG-AC-AANP, 2e pilier obligatoire, LAMal de base, rachat LPP dans certaines limites). Pour les revenus 2025, la conversion en euros se fait au taux de 1,07 indiqué sur l'annexe. Reports : automatiques en ligne ; sur papier, lignes 1AF à 1DF et 8TK de la 2042, cadres 1 et 6 de la 2047. L'attestation 2041-AS concerne le cas 1 (8 cantons de l'accord), pas Genève. La cotisation spéciale « frontaliers » CNTFS/Urssaf, si vous la payez, se porte en ligne 6DD de la 2042 C. La case 8SH de la 2042 C (exonération de CSG-CRDS sur les revenus du patrimoine) concerne les personnes affiliées à l'assurance maladie suisse et non à un régime obligatoire de sécurité sociale français.",
    source: { label: "impots.gouv.fr — annexe 2047-SUISSE, revenus 2025", url: "https://www.impots.gouv.fr/sites/default/files/formulaires/2047/2026/2047_5489.pdf" },
    moreSources: [
      { label: "impots.gouv.fr — notice 2047, revenus 2025 (lignes 1AF à 1DF et 8TK)", url: "https://www.impots.gouv.fr/sites/default/files/formulaires/2047/2026/2047_5490.pdf" },
      { label: "impots.gouv.fr — déclaration 2042 C, revenus 2025 (cases 6DD et 8SH)", url: "https://www.impots.gouv.fr/sites/default/files/formulaires/2042/2026/2042_5472.pdf" },
    ],
    status: "verifie",
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
    title: "Canton de l'accord de 1983 : attestation 2041-AS et imposition en France",
    detail:
      "Les huit cantons de l'accord frontalier du 11 avril 1983 (Bâle-Campagne, Bâle-Ville, Berne, Jura, Neuchâtel, Soleure, Valais, Vaud) relèvent du « cas 1 » de l'annexe 2047-SUISSE. Si vous êtes travailleur frontalier (retour en France en règle générale chaque jour, soit 45 nuitées maximum en Suisse par an pour un temps plein) et détenteur de l'attestation 2041-AS ou 2041-ASK, votre salaire suisse est imposable en France. Cochez la case « cas 1 » de la 2047-SUISSE : en ligne, les reports sont automatiques. Sur papier : lignes 1AG à 1DG de la 2042 et cadre 1 de la 2047, puis ligne 8TJ/8TY (en francs suisses) pour recevoir automatiquement l'attestation 2041-ASK l'année suivante. Sans attestation 2041-AS, l'annexe indique de l'imprimer sur impots.gouv.fr et de vous rapprocher de votre service des impôts des particuliers. Si vous ne rentrez que le week-end, l'annexe renvoie aux cas 2 ou 3.",
    source: { label: "impots.gouv.fr — annexe 2047-SUISSE, revenus 2025", url: "https://www.impots.gouv.fr/sites/default/files/formulaires/2047/2026/2047_5489.pdf" },
    moreSources: [
      { label: "impots.gouv.fr — notice 2047, revenus 2025 (lignes 1AG à 1DG)", url: "https://www.impots.gouv.fr/sites/default/files/formulaires/2047/2026/2047_5490.pdf" },
    ],
    status: "verifie",
  },
  {
    id: "3916",
    when: (a) => a.compteSuisse === "oui",
    title: "Déclarer vos comptes bancaires suisses (formulaire 3916, case 8UU)",
    detail:
      "Les comptes ouverts, détenus, utilisés ou clos à l'étranger pendant l'année se déclarent avec le formulaire 3916, une déclaration par compte, jointe à la déclaration 2042 (à remplir en ligne si vous déclarez en ligne). Sur la 2042, cochez la case 8UU. Les contrats d'assurance-vie ou de capitalisation souscrits hors de France se déclarent aussi (case 8TT). Un compte non déclaré expose à une amende de 1 500 € par compte, portée à 10 000 € si l'État n'a pas conclu avec la France de convention d'assistance administrative permettant l'accès aux renseignements bancaires. Le cas du 3e pilier suisse n'est pas précisé dans les documents officiels consultés : renseignez-vous auprès de votre service des impôts.",
    source: { label: "impots.gouv.fr — formulaire et notice 3916, mars 2026", url: "https://www.impots.gouv.fr/sites/default/files/formulaires/3916/2026/3916_5454.pdf" },
    moreSources: [
      { label: "impots.gouv.fr — déclaration 2042, revenus 2025 (cases 8UU et 8TT)", url: "https://www.impots.gouv.fr/sites/default/files/formulaires/2042/2026/2042_5535.pdf" },
    ],
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
