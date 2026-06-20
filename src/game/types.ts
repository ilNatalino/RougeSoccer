export const MAX_PHASES = 10;
export const PHASE_ENERGY = 3;
export const HAND_SIZE = 5;
export const RUN_MATCHES = 5;

export type TacticalTag =
  | "Centrale"
  | "Ampiezza"
  | "Spazio"
  | "Cross"
  | "Piazzato"
  | "Pressing";

export type CardType =
  | "costruzione"
  | "occasione"
  | "conclusione"
  | "difesa"
  | "supporto";

export type CardId = string;
export type CoachId =
  | "maestro-possesso"
  | "blocco-basso"
  | "assalto";
export type CalciatoreId = string;
export type CalciatoreCategory = "icona" | "comune";
export type OpponentId = string;
export type IntentionId = string;
export type CombinationId = string;

export type IntentionType = "offense" | "defense";

export type TacticalEffectCondition = {
  kind: "intention_type";
  intentionType: IntentionType;
};

export type TacticalEffect =
  | {
      kind: "next_conclusion_chance";
      value: number;
      condition?: TacticalEffectCondition;
    }
  | {
      kind: "prior_card_type_danger";
      cardType: CardType;
      minCount: number;
      value: number;
    }
  | {
      kind: "prior_card_type_goal_chance";
      cardType: CardType;
      minCount: number;
      value: number;
    }
  | {
      kind: "intention_coverage";
      intentionType: IntentionType;
      value: number;
    }
  | {
      kind: "coverage_delta";
      value: number;
    };

export interface ActiveTacticalEffect {
  id: string;
  sourceCardId: CardId;
  label: string;
  kind: "next_conclusion_chance";
  value: number;
}

export interface CardDefinition {
  id: CardId;
  name: string;
  type: CardType;
  cost: 1;
  description: string;
  tags: TacticalTag[];
  danger?: number;
  coverage?: number;
  baseGoalChance?: number;
  identityCoachId?: CoachId;
  tacticalEffects?: TacticalEffect[];
}

export interface StarterDeckEntry {
  cardId: CardId;
  copies: number;
}

export interface StarterDeckDefinition {
  coachId: CoachId;
  entries: StarterDeckEntry[];
}

export interface CoachDefinition {
  id: CoachId;
  name: string;
  style: string;
  identityCardIds: CardId[];
}

export interface CardInstance {
  uid: string;
  cardId: CardId;
}

export interface CombinationRule {
  id: CombinationId;
  name: string;
  description: string;
  requiredTags: TacticalTag[];
  requiresConclusion?: boolean;
  dangerBonus?: number;
  coverageBonus?: number;
  goalChanceBonus?: number;
}

export type PassiveBonus =
  | {
      kind: "conclusion_chance";
      value: number;
    }
  | {
      kind: "card_type_danger";
      cardType: CardType;
      value: number;
    }
  | {
      kind: "card_type_coverage";
      cardType: CardType;
      value: number;
    }
  | {
      kind: "tag_danger";
      tags: TacticalTag[];
      value: number;
    }
  | {
      kind: "high_threat_coverage";
      threshold: number;
      value: number;
    }
  | {
      kind: "behind_conclusion_chance";
      value: number;
    }
  | {
      kind: "opponent_goal_chance";
      value: number;
    }
  | {
      kind: "tag_conclusion_chance";
      tag: TacticalTag;
      value: number;
    }
  | {
      kind: "prior_card_type_conclusion_chance";
      cardType: CardType;
      minCount: number;
      value: number;
    };

export interface Calciatore {
  id: CalciatoreId;
  name: string;
  category: CalciatoreCategory;
  role: string;
  bonusText: string;
  passive: PassiveBonus | PassiveBonus[];
}

export interface IntentionDefinition {
  id: IntentionId;
  name: string;
  type: IntentionType;
  description: string;
  baseThreat?: number;
  exposureBonus?: number;
  dangerPenalty?: number;
  goalChancePenalty?: number;
}

export interface Opponent {
  id: OpponentId;
  name: string;
  attack: number;
  defense: number;
  theme: string;
  intentionDeck: IntentionId[];
}

export interface RngState {
  seed: string;
  state: number;
}

export type RunStatus = "squad" | "match" | "reward" | "victory" | "game-over";

export interface ShotResult {
  cardId: CardId;
  chance: number;
  roll: number;
  goal: boolean;
}

export interface MatchState {
  matchNumber: number;
  opponentId: OpponentId;
  isBoss: boolean;
  phaseNumber: number;
  playerScore: number;
  opponentScore: number;
  energy: number;
  danger: number;
  coverage: number;
  imbalance: number;
  shotTaken: boolean;
  activeTacticalEffects: ActiveTacticalEffect[];
  tacticalEffectDanger: number;
  tacticalEffectCoverage: number;
  drawPile: CardInstance[];
  hand: CardInstance[];
  discardPile: CardInstance[];
  playedCards: CardInstance[];
  intentionDrawPile: IntentionId[];
  intentionDiscardPile: IntentionId[];
  currentIntentionId: IntentionId;
  activeCombinationIds: CombinationId[];
  lastShot?: ShotResult;
}

export interface RunState {
  status: RunStatus;
  seed: string;
  rng: RngState;
  coachId: CoachId;
  squad: CalciatoreId[];
  ownedDeck: CardInstance[];
  nextCardUid: number;
  matchIndex: number;
  match?: MatchState;
  rewardOptions?: CardId[];
  finalMessage?: string;
  log: string[];
}

export interface GoalChanceBreakdown {
  percent: number;
  base: number;
  effectiveDanger: number;
  dangerBonus: number;
  sequenceBonus: number;
  combinationBonus: number;
  tacticalEffectBonus: number;
  passiveBonus: number;
  exposureBonus: number;
  opponentDefensePenalty: number;
  intentionPenalty: number;
}

export interface OpponentChanceBreakdown {
  percent: number;
  threat: number;
  residualThreat: number;
  coverage: number;
  effectiveCoverage: number;
  imbalance: number;
  coverageBonus: number;
  tacticalCoverageBonus: number;
  passivePenalty: number;
}
