import type {
  Calciatore,
  CardDefinition,
  CardId,
  CoachDefinition,
  CoachId,
  CombinationRule,
  IntentionDefinition,
  IntentionId,
  Opponent,
  StarterDeckDefinition,
  TacticalTag,
} from "./types";

export const TACTICAL_TAGS: TacticalTag[] = [
  "Centrale",
  "Ampiezza",
  "Spazio",
  "Cross",
  "Piazzato",
  "Pressing",
];

export const CARDS: CardDefinition[] = [
  {
    id: "passaggio-corto",
    name: "Passaggio corto",
    type: "costruzione",
    cost: 1,
    danger: 1,
    tags: ["Centrale"],
    description: "+1 Pericolosita",
  },
  {
    id: "cambio-gioco",
    name: "Cambio gioco",
    type: "costruzione",
    cost: 1,
    danger: 1,
    tags: ["Ampiezza"],
    description: "+1 Pericolosita",
  },
  {
    id: "inserimento",
    name: "Inserimento",
    type: "occasione",
    cost: 1,
    danger: 2,
    tags: ["Spazio"],
    description: "+2 Pericolosita",
  },
  {
    id: "cross",
    name: "Cross",
    type: "occasione",
    cost: 1,
    danger: 2,
    tags: ["Cross"],
    description: "+2 Pericolosita",
  },
  {
    id: "tiro",
    name: "Tiro",
    type: "conclusione",
    cost: 1,
    baseGoalChance: 25,
    tags: [],
    description: "25% gol base",
  },
  {
    id: "pressing",
    name: "Pressing",
    type: "difesa",
    cost: 1,
    coverage: 2,
    tags: ["Pressing"],
    description: "+2 Copertura",
  },
  {
    id: "ripiegamento",
    name: "Ripiegamento",
    type: "difesa",
    cost: 1,
    coverage: 3,
    tags: [],
    description: "+3 Copertura",
  },
  {
    id: "verticalizzazione",
    name: "Verticalizzazione",
    type: "costruzione",
    cost: 1,
    danger: 2,
    tags: ["Centrale"],
    description: "+2 Pericolosita",
  },
  {
    id: "tiro-piazzato",
    name: "Tiro piazzato",
    type: "conclusione",
    cost: 1,
    baseGoalChance: 20,
    tags: ["Piazzato"],
    description: "20% gol base",
  },
  {
    id: "marcatura",
    name: "Marcatura",
    type: "difesa",
    cost: 1,
    coverage: 4,
    tags: [],
    description: "+4 Copertura",
  },
  {
    id: "azione-fascia",
    name: "Azione sulla fascia",
    type: "occasione",
    cost: 1,
    danger: 1,
    tags: ["Ampiezza"],
    description: "+1 Pericolosita",
  },
  {
    id: "calcio-piazzato",
    name: "Calcio piazzato",
    type: "costruzione",
    cost: 1,
    danger: 1,
    tags: ["Piazzato"],
    description: "+1 Pericolosita",
  },
  {
    id: "giro-palla-paziente",
    name: "Giro palla paziente",
    type: "costruzione",
    cost: 1,
    danger: 1,
    tags: ["Centrale", "Ampiezza"],
    identityCoachId: "maestro-possesso",
    description: "+1 Pericolosita",
  },
  {
    id: "terzo-uomo",
    name: "Terzo uomo",
    type: "occasione",
    cost: 1,
    danger: 2,
    tags: ["Spazio"],
    identityCoachId: "maestro-possesso",
    tacticalEffects: [
      {
        kind: "prior_card_type_danger",
        cardType: "costruzione",
        minCount: 1,
        value: 1,
      },
    ],
    description: "+2 Pericolosita; +1 se hai gia giocato Costruzione",
  },
  {
    id: "imbucata-centrale",
    name: "Imbucata centrale",
    type: "conclusione",
    cost: 1,
    baseGoalChance: 25,
    tags: [],
    identityCoachId: "maestro-possesso",
    tacticalEffects: [
      {
        kind: "prior_card_type_goal_chance",
        cardType: "costruzione",
        minCount: 2,
        value: 10,
      },
    ],
    description: "25% gol base; +10% con 2 Costruzioni gia giocate",
  },
  {
    id: "linea-compatta",
    name: "Linea compatta",
    type: "difesa",
    cost: 1,
    coverage: 4,
    tags: [],
    identityCoachId: "blocco-basso",
    tacticalEffects: [
      {
        kind: "intention_coverage",
        intentionType: "offense",
        value: 1,
      },
    ],
    description: "+4 Copertura; +1 contro Intenzioni offensive",
  },
  {
    id: "lancio-lungo",
    name: "Lancio lungo",
    type: "supporto",
    cost: 1,
    tags: [],
    identityCoachId: "blocco-basso",
    tacticalEffects: [
      {
        kind: "next_conclusion_chance",
        value: 10,
        condition: {
          kind: "intention_type",
          intentionType: "offense",
        },
      },
    ],
    description: "+10% alla prossima Conclusione contro Intenzioni offensive",
  },
  {
    id: "punizione-studiata",
    name: "Punizione studiata",
    type: "conclusione",
    cost: 1,
    baseGoalChance: 30,
    tags: ["Piazzato"],
    identityCoachId: "blocco-basso",
    description: "30% gol base",
  },
  {
    id: "sovrapposizione-continua",
    name: "Sovrapposizione continua",
    type: "costruzione",
    cost: 1,
    danger: 3,
    tags: ["Ampiezza"],
    identityCoachId: "assalto",
    tacticalEffects: [
      {
        kind: "coverage_delta",
        value: -1,
      },
    ],
    description: "+3 Pericolosita, -1 Copertura",
  },
  {
    id: "attacco-in-area",
    name: "Attacco in area",
    type: "occasione",
    cost: 1,
    danger: 3,
    tags: ["Spazio"],
    identityCoachId: "assalto",
    description: "+3 Pericolosita",
  },
  {
    id: "tiro-di-prima",
    name: "Tiro di prima",
    type: "conclusione",
    cost: 1,
    baseGoalChance: 35,
    tags: [],
    identityCoachId: "assalto",
    description: "35% gol base",
  },
];

export const CARD_BY_ID = Object.fromEntries(
  CARDS.map((card) => [card.id, card]),
) as Record<CardId, CardDefinition>;

export const COACHES: CoachDefinition[] = [
  {
    id: "maestro-possesso",
    name: "Maestro del Possesso",
    style:
      "Costruzione paziente, sequenze centrali e Conclusioni preparate con calma.",
    identityCardIds: [
      "giro-palla-paziente",
      "terzo-uomo",
      "imbucata-centrale",
    ],
  },
  {
    id: "blocco-basso",
    name: "Specialista del Blocco Basso",
    style:
      "Copertura alta, lanci diretti e Piazzati per colpire quando l'avversario si espone.",
    identityCardIds: [
      "linea-compatta",
      "lancio-lungo",
      "punizione-studiata",
    ],
  },
  {
    id: "assalto",
    name: "Allenatore d'Assalto",
    style:
      "Pericolosita immediata, tante Conclusioni e rischio difensivo esplicito.",
    identityCardIds: [
      "sovrapposizione-continua",
      "attacco-in-area",
      "tiro-di-prima",
    ],
  },
];

export const COACH_BY_ID = Object.fromEntries(
  COACHES.map((coach) => [coach.id, coach]),
) as Record<CoachId, CoachDefinition>;

export const STARTER_DECKS: Record<CoachId, StarterDeckDefinition> = {
  "maestro-possesso": {
    coachId: "maestro-possesso",
    entries: [
      { cardId: "giro-palla-paziente", copies: 2 },
      { cardId: "terzo-uomo", copies: 2 },
      { cardId: "imbucata-centrale", copies: 2 },
      { cardId: "passaggio-corto", copies: 2 },
      { cardId: "cambio-gioco", copies: 2 },
      { cardId: "verticalizzazione", copies: 1 },
      { cardId: "inserimento", copies: 1 },
      { cardId: "pressing", copies: 1 },
      { cardId: "ripiegamento", copies: 1 },
      { cardId: "tiro", copies: 1 },
    ],
  },
  "blocco-basso": {
    coachId: "blocco-basso",
    entries: [
      { cardId: "linea-compatta", copies: 2 },
      { cardId: "lancio-lungo", copies: 2 },
      { cardId: "punizione-studiata", copies: 2 },
      { cardId: "pressing", copies: 2 },
      { cardId: "ripiegamento", copies: 2 },
      { cardId: "marcatura", copies: 1 },
      { cardId: "calcio-piazzato", copies: 1 },
      { cardId: "tiro-piazzato", copies: 1 },
      { cardId: "passaggio-corto", copies: 1 },
      { cardId: "tiro", copies: 1 },
    ],
  },
  assalto: {
    coachId: "assalto",
    entries: [
      { cardId: "sovrapposizione-continua", copies: 2 },
      { cardId: "attacco-in-area", copies: 2 },
      { cardId: "tiro-di-prima", copies: 2 },
      { cardId: "inserimento", copies: 2 },
      { cardId: "cross", copies: 1 },
      { cardId: "azione-fascia", copies: 1 },
      { cardId: "cambio-gioco", copies: 1 },
      { cardId: "passaggio-corto", copies: 1 },
      { cardId: "tiro", copies: 2 },
      { cardId: "pressing", copies: 1 },
    ],
  },
};

export const IDENTITY_CARD_IDS: CardId[] = CARDS.filter(
  (card) => card.identityCoachId,
).map((card) => card.id);

export const REWARD_POOL: CardId[] = CARDS.filter(
  (card) => !card.identityCoachId,
).map((card) => card.id);

export const COMBINATION_RULES: CombinationRule[] = [
  {
    id: "centrale-spazio",
    name: "Centrale + Spazio",
    description: "+2 Pericolosita",
    requiredTags: ["Centrale", "Spazio"],
    dangerBonus: 2,
  },
  {
    id: "ampiezza-cross",
    name: "Ampiezza + Cross",
    description: "+2 Pericolosita",
    requiredTags: ["Ampiezza", "Cross"],
    dangerBonus: 2,
  },
  {
    id: "pressing-spazio",
    name: "Pressing + Spazio",
    description: "+1 Pericolosita, +1 Copertura",
    requiredTags: ["Pressing", "Spazio"],
    dangerBonus: 1,
    coverageBonus: 1,
  },
  {
    id: "piazzato-conclusione",
    name: "Piazzato + Conclusione",
    description: "+10% gol",
    requiredTags: ["Piazzato"],
    requiresConclusion: true,
    goalChanceBonus: 10,
  },
];

export const CALCIATORI_COMUNI: Calciatore[] = [
  {
    id: "bomber",
    name: "Bomber",
    category: "comune",
    role: "Finalizzatore",
    bonusText: "+10% alle Conclusioni",
    passive: { kind: "conclusion_chance", value: 10 },
  },
  {
    id: "regista",
    name: "Regista",
    category: "comune",
    role: "Costruzione",
    bonusText: "+1 Pericolosita alle carte Costruzione",
    passive: { kind: "card_type_danger", cardType: "costruzione", value: 1 },
  },
  {
    id: "rifinitore",
    name: "Rifinitore",
    category: "comune",
    role: "Occasione",
    bonusText: "+1 Pericolosita alle carte Occasione",
    passive: { kind: "card_type_danger", cardType: "occasione", value: 1 },
  },
  {
    id: "mediano",
    name: "Mediano",
    category: "comune",
    role: "Filtro",
    bonusText: "+1 Copertura alle carte difensive",
    passive: { kind: "card_type_coverage", cardType: "difesa", value: 1 },
  },
  {
    id: "terzino-spinta",
    name: "Terzino di spinta",
    category: "comune",
    role: "Ampiezza",
    bonusText: "+1 Pericolosita alle carte Ampiezza",
    passive: { kind: "tag_danger", tags: ["Ampiezza"], value: 1 },
  },
  {
    id: "ala-rapida",
    name: "Ala rapida",
    category: "comune",
    role: "Spazio",
    bonusText: "+1 Pericolosita alle carte Spazio",
    passive: { kind: "tag_danger", tags: ["Spazio"], value: 1 },
  },
  {
    id: "centrale-roccioso",
    name: "Centrale roccioso",
    category: "comune",
    role: "Tenuta",
    bonusText: "+1 Copertura contro Minaccia alta",
    passive: { kind: "high_threat_coverage", threshold: 6, value: 1 },
  },
  {
    id: "capitano",
    name: "Capitano",
    category: "comune",
    role: "Leader",
    bonusText: "+5% alle Conclusioni in svantaggio",
    passive: { kind: "behind_conclusion_chance", value: 5 },
  },
  {
    id: "portiere-leader",
    name: "Portiere leader",
    category: "comune",
    role: "Porta",
    bonusText: "-5% gol avversario",
    passive: { kind: "opponent_goal_chance", value: -5 },
  },
  {
    id: "specialista",
    name: "Specialista",
    category: "comune",
    role: "Piazzati",
    bonusText: "+10% alle Conclusioni Piazzato",
    passive: { kind: "tag_conclusion_chance", tag: "Piazzato", value: 10 },
  },
];

export const ICONE: Calciatore[] = [
  {
    id: "il-diez",
    name: "Il Diez",
    category: "icona",
    role: "Fantasista centrale",
    bonusText:
      "+1 Pericolosita alle carte Centrali; +10% alle Conclusioni dopo una Occasione",
    passive: [
      { kind: "tag_danger", tags: ["Centrale"], value: 1 },
      {
        kind: "prior_card_type_conclusion_chance",
        cardType: "occasione",
        minCount: 1,
        value: 10,
      },
    ],
  },
  {
    id: "fenomeno",
    name: "Fenomeno",
    category: "icona",
    role: "Finalizzatore esplosivo",
    bonusText: "+15% alle Conclusioni; +1 Pericolosita alle carte Spazio",
    passive: [
      { kind: "conclusion_chance", value: 15 },
      { kind: "tag_danger", tags: ["Spazio"], value: 1 },
    ],
  },
  {
    id: "maestro-totale",
    name: "Il Maestro Totale",
    category: "icona",
    role: "Regista completo",
    bonusText:
      "+1 Pericolosita alle Costruzioni; +1 Pericolosita alle carte Centrali",
    passive: [
      { kind: "card_type_danger", cardType: "costruzione", value: 1 },
      { kind: "tag_danger", tags: ["Centrale"], value: 1 },
    ],
  },
  {
    id: "freccia-oro",
    name: "La Freccia d'Oro",
    category: "icona",
    role: "Ala dominante",
    bonusText: "+2 Pericolosita alle carte Ampiezza",
    passive: { kind: "tag_danger", tags: ["Ampiezza"], value: 2 },
  },
  {
    id: "muro-azzurro",
    name: "Il Muro Azzurro",
    category: "icona",
    role: "Difensore dominante",
    bonusText: "+2 Copertura alle carte Difesa; +1 Copertura contro Minaccia alta",
    passive: [
      { kind: "card_type_coverage", cardType: "difesa", value: 2 },
      { kind: "high_threat_coverage", threshold: 6, value: 1 },
    ],
  },
  {
    id: "capitano-eterno",
    name: "Il Capitano Eterno",
    category: "icona",
    role: "Leader da rimonta",
    bonusText: "+10% alle Conclusioni in svantaggio; -5% gol avversario",
    passive: [
      { kind: "behind_conclusion_chance", value: 10 },
      { kind: "opponent_goal_chance", value: -5 },
    ],
  },
];

export const CALCIATORI: Calciatore[] = [...CALCIATORI_COMUNI, ...ICONE];

export const CALCIATORE_BY_ID = Object.fromEntries(
  CALCIATORI.map((calciatore) => [calciatore.id, calciatore]),
) as Record<string, Calciatore>;

export const INTENTIONS: IntentionDefinition[] = [
  {
    id: "attacco-paziente",
    name: "Attacco paziente",
    type: "offense",
    baseThreat: 1,
    exposureBonus: 0,
    description: "Minaccia base 1, Esposizione +0%",
  },
  {
    id: "attacco-centrale",
    name: "Attacco centrale",
    type: "offense",
    baseThreat: 2,
    exposureBonus: 5,
    description: "Minaccia base 2, Esposizione +5%",
  },
  {
    id: "contropiede",
    name: "Contropiede",
    type: "offense",
    baseThreat: 3,
    exposureBonus: 5,
    description: "Minaccia base 3, Esposizione +5%",
  },
  {
    id: "assalto-finale",
    name: "Assalto finale",
    type: "offense",
    baseThreat: 4,
    exposureBonus: 15,
    description: "Minaccia base 4, Esposizione +15%",
  },
  {
    id: "blocco-basso",
    name: "Blocco basso",
    type: "defense",
    dangerPenalty: 2,
    description: "-2 Pericolosita effettiva",
  },
  {
    id: "pressing-avversario",
    name: "Pressing avversario",
    type: "defense",
    goalChancePenalty: 10,
    description: "-10% alla Conclusione",
  },
];

export const INTENTION_BY_ID = Object.fromEntries(
  INTENTIONS.map((intention) => [intention.id, intention]),
) as Record<IntentionId, IntentionDefinition>;

function expandIntentions(entries: Array<[IntentionId, number]>): IntentionId[] {
  return entries.flatMap(([id, copies]) =>
    Array.from({ length: copies }, () => id),
  );
}

export const OPPONENTS: Opponent[] = [
  {
    id: "squadra-equilibrata",
    name: "Squadra equilibrata",
    attack: 2,
    defense: 2,
    theme: "Tutorial, valori medi, intenzioni leggibili",
    intentionDeck: expandIntentions([
      ["attacco-paziente", 3],
      ["attacco-centrale", 2],
      ["blocco-basso", 2],
      ["pressing-avversario", 1],
    ]),
  },
  {
    id: "squadra-difensiva",
    name: "Squadra difensiva",
    attack: 1,
    defense: 4,
    theme: "Alta difesa e poche sortite",
    intentionDeck: expandIntentions([
      ["blocco-basso", 4],
      ["pressing-avversario", 2],
      ["attacco-paziente", 1],
      ["attacco-centrale", 1],
    ]),
  },
  {
    id: "squadra-offensiva",
    name: "Squadra offensiva",
    attack: 4,
    defense: 2,
    theme: "Minaccia costante e difesa piu debole",
    intentionDeck: expandIntentions([
      ["attacco-centrale", 3],
      ["contropiede", 2],
      ["assalto-finale", 2],
      ["blocco-basso", 1],
    ]),
  },
  {
    id: "squadra-contropiede",
    name: "Squadra da contropiede",
    attack: 3,
    defense: 3,
    theme: "Punisce fasi troppo sbilanciate",
    intentionDeck: expandIntentions([
      ["contropiede", 4],
      ["blocco-basso", 2],
      ["attacco-paziente", 1],
      ["pressing-avversario", 1],
    ]),
  },
  {
    id: "boss-misto",
    name: "Boss misto",
    attack: 4,
    defense: 4,
    theme: "Difesa solida e Minacce alte",
    intentionDeck: expandIntentions([
      ["blocco-basso", 2],
      ["pressing-avversario", 2],
      ["contropiede", 2],
      ["assalto-finale", 2],
    ]),
  },
];

export const OPPONENT_BY_ID = Object.fromEntries(
  OPPONENTS.map((opponent) => [opponent.id, opponent]),
) as Record<string, Opponent>;
