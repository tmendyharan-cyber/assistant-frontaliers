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
// guide (facultatif) : guide détaillé du site, affiché sous les sources.
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
    guide: "articles/formulaire-2047-suisse-frontalier.html",
    status: "verifie",
  },
  {
    id: "canton-autre",
    when: (a) => a.canton === "AUTRE",
    title: "Autre canton : même déclaration française que Genève (cas 2)",
    detail:
      "Si votre canton ne fait pas partie des 8 cantons de l'accord frontalier de 1983, vous relevez, comme Genève, du « cas 2 » de l'annexe 2047-SUISSE (« autres salariés imposés par la Suisse ») : le salaire est déclaré et imposé en France, sous déduction d'un crédit d'impôt égal à l'impôt français, s'il a été soumis au barème normal de l'impôt à la source suisse. Remplissez un feuillet 2047-SUISSE par canton (taux de conversion de 1,07 pour les revenus 2025) ; sur papier, reports en lignes 1AF à 1DF et 8TK de la 2042. Le statut de quasi-résident et les détails donnés par cet outil sur le télétravail viennent du canton de Genève : renseignez-vous auprès de l'administration fiscale de votre canton pour sa procédure.",
    source: { label: "impots.gouv.fr — annexe 2047-SUISSE, revenus 2025 (cas 2)", url: "https://www.impots.gouv.fr/sites/default/files/formulaires/2047/2026/2047_5489.pdf" },
    moreSources: [
      { label: "impots.gouv.fr — notice 2047, revenus 2025 (cantons n'ayant pas signé l'accord frontalier)", url: "https://www.impots.gouv.fr/sites/default/files/formulaires/2047/2026/2047_5490.pdf" },
    ],
    guide: "articles/formulaire-2047-suisse-frontalier.html",
    status: "verifie",
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
    guide: "articles/2041-as-frontalier-vaud-accord-1983.html",
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
    guide: "articles/3916-compte-bancaire-suisse-frontalier.html",
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
    guide: "articles/quasi-resident-geneve-taxation-ordinaire-ulterieure.html",
    status: "verifie",
  },
  {
    id: "teletravail-impot-ge",
    when: (a) => a.teletravail === "oui" && a.canton === "GE",
    title: "Télétravail depuis la France et impôt : le seuil de 40 %",
    detail:
      "Depuis le 1er janvier 2026, un avenant à la convention fiscale franco-suisse s'applique. Jusqu'à 40 % de votre temps de travail annuel en télétravail depuis la France (environ 2 jours par semaine à temps plein), la totalité du salaire reste soumise à l'impôt à la source suisse. La limite se calcule par année civile, pas par semaine. Jusqu'à 10 jours de missions temporaires à l'étranger par an sont comptés dans ces 40 %. Au-delà de 40 %, la part du salaire correspondant aux jours télétravaillés est imposable en France dès le 1er jour, et il devient difficile d'atteindre le seuil de 90 % du statut de quasi-résident. La façon de déclarer en France cette part n'est pas détaillée par les sources consultées : renseignez-vous auprès de votre service des impôts.",
    source: { label: "ge.ch — jusqu'à 40 % d'activité en télétravail", url: "https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/40-activite-teletravail" },
    moreSources: [
      { label: "ge.ch — au-delà de 40 % d'activité en télétravail", url: "https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/au-dela-40-activite-teletravail" },
      { label: "ge.ch — accords applicables au télétravail", url: "https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/accords-applicables-au-teletravail" },
    ],
    guide: "articles/teletravail-frontalier-geneve-40-pourcent.html",
    status: "verifie",
  },
  {
    id: "teletravail-securite-sociale",
    when: (a) => a.teletravail === "oui",
    title: "Télétravail et sécurité sociale : les seuils de 25 % et 50 %",
    detail:
      "Règle de base : si vous télétravaillez au moins 25 % de votre temps de travail en France, vous relevez de la sécurité sociale française. La France et la Suisse ont signé un accord-cadre : avec un télétravail inférieur à 50 % de votre temps de travail total, vous pouvez rester affilié à la sécurité sociale suisse, à condition que tous vos employeurs soient établis en Suisse et que vous n'exerciez pas d'autre activité en France. C'est votre employeur qui fait la demande ; il reçoit une attestation A1, valable 3 ans au maximum.",
    source: { label: "CLEISS — télétravail transfrontalier en Europe", url: "https://www.cleiss.fr/particuliers/teletravail-transfrontalier.html" },
    status: "verifie",
  },
  {
    id: "teletravail-impot-autre",
    when: (a) => a.teletravail === "oui" && a.canton === "AUTRE",
    title: "Télétravail et impôt : la limite de 40 % de l'avenant franco-suisse",
    detail:
      "L'avenant à la convention fiscale franco-suisse, entré en vigueur le 24 juillet 2025, s'applique depuis le 1er janvier 2026 : dans la limite de 40 % du temps de travail par année civile, la rémunération du télétravail est imposable dans l'État où se situe l'employeur. Les modalités pratiques (calcul du taux, missions, au-delà de 40 %) détaillées par cet outil sont celles publiées par le canton de Genève : vérifiez-les auprès de l'administration fiscale de votre canton.",
    source: { label: "Confédération (SIF) — entrée en vigueur de l'avenant franco-suisse", url: "https://www.sif.admin.ch/fr/entree-en-vigueur-de-lavenant-a-la-convention-entre-la-suisse-et-la-france-contre-les-doubles-impositions" },
    guide: "articles/teletravail-frontalier-geneve-40-pourcent.html",
    status: "verifie",
  },
  {
    id: "teletravail-accord-1983",
    when: (a) => a.teletravail === "oui" && ["VD", "VS", "NE", "JU", "BE", "BS", "BL", "SO"].includes(a.canton),
    title: "Télétravail et impôt : situation non vérifiée pour les cantons de l'accord de 1983",
    detail:
      "Votre salaire est imposable en France au titre de l'accord frontalier de 1983 (voir point précédent). L'effet du télétravail sur ce régime n'est pas décrit dans les sources officielles consultées. Consultez votre service des impôts avant de déclarer.",
    source: { label: "ge.ch — accords applicables au télétravail", url: "https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/accords-applicables-au-teletravail" },
    status: "a_verifier",
  },
  {
    id: "foyer",
    when: (a) => a.famille === "oui",
    title: "Foyer : déclaration commune, concubinage et personnes à charge",
    detail:
      "Mariés ou pacsés : vous êtes imposés ensemble sur une déclaration commune, avec l'ensemble des revenus et des charges du couple. L'année du mariage ou du Pacs, une option pour l'imposition séparée existe (irrévocable pour l'année, avec des exceptions détaillées dans la notice). En concubinage, chacun est imposable séparément ; les enfants communs comptent selon la charge que chacun assume. Les personnes à charge augmentent le nombre de parts (une demi-part pour chacune des deux premières, une part à partir de la troisième). Un enfant mineur en résidence alternée est présumé à charge partagée entre ses parents (à indiquer case H). Rassemblez les justificatifs de votre situation familiale.",
    source: { label: "impots.gouv.fr — notice de la déclaration 2042, revenus 2025", url: "https://www.impots.gouv.fr/sites/default/files/formulaires/2042/2026/2042_5477.pdf" },
    status: "verifie",
  },
  {
    id: "foyer-conjoint",
    when: (a) => a.famille === "oui" && a.revenuConjoint === "oui",
    title: "Revenus du conjoint : sur la déclaration commune, avec sa propre 2047-SUISSE s'il travaille en Suisse",
    detail:
      "Si vous êtes mariés ou pacsés, les revenus de votre conjoint figurent sur votre déclaration commune. S'il travaille aussi en Suisse, remplissez un feuillet 2047-SUISSE à son nom (case « Déclarant 2 ») : l'annexe prévoit un feuillet par canton et par frontalier. Son propre canton de travail détermine son cas (cas 1 pour les 8 cantons de l'accord de 1983, cas 2 pour Genève et les autres cantons). À Genève, pour le statut de quasi-résident d'un couple marié, les revenus mondiaux des deux conjoints sont additionnés.",
    source: { label: "impots.gouv.fr — annexe 2047-SUISSE, revenus 2025", url: "https://www.impots.gouv.fr/sites/default/files/formulaires/2047/2026/2047_5489.pdf" },
    moreSources: [
      { label: "impots.gouv.fr — notice de la déclaration 2042, revenus 2025", url: "https://www.impots.gouv.fr/sites/default/files/formulaires/2042/2026/2042_5477.pdf" },
      { label: "ge.ch — déterminer le statut de quasi-résident", url: "https://www.ge.ch/demande-rectification-taxation-ordinaire-ulterieure/determiner-statut-quasi-resident" },
    ],
    status: "verifie",
  },
];

export const DOCUMENTS = [
  "Certificat de salaire suisse (Lohnausweis) de l'année concernée",
  "Relevés annuels de vos comptes suisses (solde et intérêts)",
  "Avis d'imposition français de l'année précédente",
  "Justificatifs de votre situation familiale",
];

export const DISCLAIMER =
  "Cet outil d'information s'appuie sur des notices officielles. Il ne fournit ni conseil fiscal personnalisé ni calcul d'impôt. Vérifiez chaque point sur impots.gouv.fr ou auprès de l'administration fiscale compétente.";
