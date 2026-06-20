import {
  CALCIATORE_BY_ID,
  CARD_BY_ID,
  COMBINATION_RULES,
  INTENTION_BY_ID,
} from "./data";
import type {
  ActiveTacticalEffect,
  Calciatore,
  CalciatoreId,
  CardDefinition,
  CardType,
  CardInstance,
  CombinationId,
  GoalChanceBreakdown,
  IntentionDefinition,
  Opponent,
  OpponentChanceBreakdown,
  PassiveBonus,
  TacticalEffect,
  TacticalEffectCondition,
} from "./types";

const MIN_CHANCE = 10;
const MAX_CHANCE = 85;
export const BUILD_OCCASION_SEQUENCE_BONUS = 5;

const CARD_TYPE_LABEL: Record<CardType, string> = {
  costruzione: "Costruzione",
  occasione: "Occasione",
  conclusione: "Conclusione",
  difesa: "Difesa",
  supporto: "Supporto",
};

type TacticalEffectContext = {
  playedCards: readonly CardDefinition[];
  currentIntention: IntentionDefinition;
};

export type CardTacticalImpact = {
  danger: number;
  coverage: number;
  activeEffects: ActiveTacticalEffect[];
  descriptions: string[];
};

export function clampChance(value: number): number {
  return Math.max(MIN_CHANCE, Math.min(MAX_CHANCE, Math.round(value)));
}

export function getCardsFromInstances(
  instances: readonly CardInstance[],
): CardDefinition[] {
  return instances.map((instance) => CARD_BY_ID[instance.cardId]);
}

export function detectCombinations(
  playedCards: readonly CardDefinition[],
  conclusionCard?: CardDefinition,
): CombinationId[] {
  const cards = conclusionCard ? [...playedCards, conclusionCard] : playedCards;
  const tags = new Set(cards.flatMap((card) => card.tags));
  const hasConclusion =
    Boolean(conclusionCard) || cards.some((card) => card.type === "conclusione");

  return COMBINATION_RULES.filter((rule) => {
    const tagsMatch = rule.requiredTags.every((tag) => tags.has(tag));
    const conclusionMatch = !rule.requiresConclusion || hasConclusion;

    return tagsMatch && conclusionMatch;
  }).map((rule) => rule.id);
}

export function getNewPhaseCombinationBonus(
  playedCards: readonly CardDefinition[],
  activeCombinationIds: readonly CombinationId[],
): {
  ids: CombinationId[];
  danger: number;
  coverage: number;
} {
  const active = new Set(activeCombinationIds);
  const newIds = detectCombinations(playedCards).filter((id) => {
    const rule = COMBINATION_RULES.find((candidate) => candidate.id === id);
    return rule && !rule.requiresConclusion && !active.has(id);
  });

  return newIds.reduce(
    (bonus, id) => {
      const rule = COMBINATION_RULES.find((candidate) => candidate.id === id);
      if (!rule) {
        return bonus;
      }

      return {
        ids: [...bonus.ids, id],
        danger: bonus.danger + (rule.dangerBonus ?? 0),
        coverage: bonus.coverage + (rule.coverageBonus ?? 0),
      };
    },
    { ids: [] as CombinationId[], danger: 0, coverage: 0 },
  );
}

export function hasBuildOccasionSequence(
  playedCards: readonly CardDefinition[],
): boolean {
  let hasConstruction = false;

  for (const card of playedCards) {
    if (card.type === "costruzione") {
      hasConstruction = true;
    }

    if (hasConstruction && card.type === "occasione") {
      return true;
    }
  }

  return false;
}

export function getCardTacticalImpact(
  card: CardDefinition,
  context: TacticalEffectContext,
): CardTacticalImpact {
  return (card.tacticalEffects ?? []).reduce<CardTacticalImpact>(
    (impact, effect, index) => {
      if (!isTacticalEffectActive(effect, context)) {
        return impact;
      }

      const label = describeTacticalEffect(effect);

      switch (effect.kind) {
        case "prior_card_type_danger":
          return {
            ...impact,
            danger: impact.danger + effect.value,
            descriptions: [...impact.descriptions, label],
          };
        case "intention_coverage":
        case "coverage_delta":
          return {
            ...impact,
            coverage: impact.coverage + effect.value,
            descriptions: [...impact.descriptions, label],
          };
        case "next_conclusion_chance":
          return {
            ...impact,
            activeEffects: [
              ...impact.activeEffects,
              {
                id: `${card.id}-${effect.kind}-${index}`,
                sourceCardId: card.id,
                label,
                kind: "next_conclusion_chance",
                value: effect.value,
              },
            ],
            descriptions: [...impact.descriptions, label],
          };
        case "prior_card_type_goal_chance":
          return impact;
      }
    },
    { danger: 0, coverage: 0, activeEffects: [], descriptions: [] },
  );
}

export function getCardGoalChanceTacticalBonus(
  card: CardDefinition,
  context: TacticalEffectContext,
): number {
  return (card.tacticalEffects ?? []).reduce((bonus, effect) => {
    if (
      effect.kind !== "prior_card_type_goal_chance" ||
      !isTacticalEffectActive(effect, context)
    ) {
      return bonus;
    }

    return bonus + effect.value;
  }, 0);
}

export function isTacticalEffectActive(
  effect: TacticalEffect,
  context: TacticalEffectContext,
): boolean {
  if (
    "condition" in effect &&
    effect.condition &&
    !isConditionMet(effect.condition, context)
  ) {
    return false;
  }

  switch (effect.kind) {
    case "prior_card_type_danger":
    case "prior_card_type_goal_chance":
      return (
        countPlayedCardType(context.playedCards, effect.cardType) >=
        effect.minCount
      );
    case "intention_coverage":
      return context.currentIntention.type === effect.intentionType;
    case "coverage_delta":
    case "next_conclusion_chance":
      return true;
  }
}

export function describeTacticalEffect(effect: TacticalEffect): string {
  switch (effect.kind) {
    case "next_conclusion_chance":
      return `${formatSigned(effect.value, "%")} prossima Conclusione${
        effect.condition ? " se Intenzione offensiva" : ""
      }`;
    case "prior_card_type_danger":
      return `${formatSigned(effect.value)} Pericolosita con ${
        effect.minCount
      }+ ${CARD_TYPE_LABEL[effect.cardType]} gia giocata`;
    case "prior_card_type_goal_chance":
      return `${formatSigned(effect.value, "%")} Conclusione con ${
        effect.minCount
      }+ ${CARD_TYPE_LABEL[effect.cardType]} gia giocata`;
    case "intention_coverage":
      return `${formatSigned(effect.value)} Copertura contro Intenzione offensiva`;
    case "coverage_delta":
      return `${formatSigned(effect.value)} Copertura`;
  }
}

export function getCardDangerBonus(
  card: CardDefinition,
  squadIds: readonly CalciatoreId[],
): number {
  return getSquad(squadIds).reduce((bonus, calciatore) => {
    return bonus + getCalciatorePassives(calciatore).reduce(
      (passiveBonus, passive) => {
        if (
          passive.kind === "card_type_danger" &&
          passive.cardType === card.type
        ) {
          return passiveBonus + passive.value;
        }

        if (
          passive.kind === "tag_danger" &&
          card.tags.some((tag) => passive.tags.includes(tag))
        ) {
          return passiveBonus + passive.value;
        }

        return passiveBonus;
      },
      0,
    );
  }, 0);
}

export function getCardCoverageBonus(
  card: CardDefinition,
  squadIds: readonly CalciatoreId[],
): number {
  return getSquad(squadIds).reduce((bonus, calciatore) => {
    return bonus + getCalciatorePassives(calciatore).reduce(
      (passiveBonus, passive) => {
        if (
          passive.kind === "card_type_coverage" &&
          passive.cardType === card.type
        ) {
          return passiveBonus + passive.value;
        }

        return passiveBonus;
      },
      0,
    );
  }, 0);
}

export function getCalciatorePassives(
  calciatore: Calciatore,
): PassiveBonus[] {
  return Array.isArray(calciatore.passive)
    ? calciatore.passive
    : [calciatore.passive];
}

export function calculateGoalChance(params: {
  card: CardDefinition;
  squadIds: readonly CalciatoreId[];
  opponent: Opponent;
  currentIntention: IntentionDefinition;
  playedCards: readonly CardDefinition[];
  activeCombinationIds: readonly CombinationId[];
  activeTacticalEffects?: readonly ActiveTacticalEffect[];
  danger: number;
  playerScore: number;
  opponentScore: number;
}): GoalChanceBreakdown {
  const activeIds = new Set([
    ...params.activeCombinationIds,
    ...detectCombinations(params.playedCards, params.card),
  ]);
  const combinationBonus = COMBINATION_RULES.reduce((bonus, rule) => {
    if (!activeIds.has(rule.id)) {
      return bonus;
    }

    return bonus + (rule.goalChanceBonus ?? 0);
  }, 0);
  const sequenceBonus = hasBuildOccasionSequence(params.playedCards)
    ? BUILD_OCCASION_SEQUENCE_BONUS
    : 0;
  const effectiveDanger = Math.max(
    0,
    params.danger - getIntentionDangerPenalty(params.currentIntention),
  );
  const dangerBonus = effectiveDanger * 5;
  const passiveBonus = getConclusionPassiveBonus(
    params.card,
    params.squadIds,
    params.playerScore,
    params.opponentScore,
    params.playedCards,
  );
  const activeTacticalEffectBonus = (
    params.activeTacticalEffects ?? []
  ).reduce((bonus, effect) => bonus + effect.value, 0);
  const cardTacticalEffectBonus = getCardGoalChanceTacticalBonus(params.card, {
    playedCards: params.playedCards,
    currentIntention: params.currentIntention,
  });
  const tacticalEffectBonus =
    activeTacticalEffectBonus + cardTacticalEffectBonus;
  const exposureBonus = getIntentionExposureBonus(params.currentIntention);
  const opponentDefensePenalty = params.opponent.defense * 5;
  const intentionPenalty = getIntentionGoalPenalty(params.currentIntention);
  const base = params.card.baseGoalChance ?? 0;

  return {
    percent: clampChance(
      base +
        dangerBonus +
        sequenceBonus +
        combinationBonus +
        tacticalEffectBonus +
        passiveBonus +
        exposureBonus -
        opponentDefensePenalty -
        intentionPenalty,
    ),
    base,
    effectiveDanger,
    dangerBonus,
    sequenceBonus,
    combinationBonus,
    tacticalEffectBonus,
    passiveBonus,
    exposureBonus,
    opponentDefensePenalty,
    intentionPenalty,
  };
}

export function calculateOpponentGoalChance(params: {
  intention: IntentionDefinition;
  opponent: Opponent;
  coverage: number;
  imbalance: number;
  squadIds: readonly CalciatoreId[];
  tacticalCoverageBonus?: number;
}): OpponentChanceBreakdown | null {
  if (params.intention.type !== "offense") {
    return null;
  }

  const threat = (params.intention.baseThreat ?? 0) + params.opponent.attack;
  const coverageBonus = getHighThreatCoverageBonus(threat, params.squadIds);
  const coverage = params.coverage + coverageBonus;
  const effectiveCoverage = getEffectiveCoverage(coverage, params.imbalance);
  const residualThreat = Math.max(0, threat - effectiveCoverage);
  const passivePenalty = getOpponentChancePassivePenalty(params.squadIds);

  return {
    percent: clampChance(10 + residualThreat * 10 + passivePenalty),
    threat,
    residualThreat,
    coverage,
    effectiveCoverage,
    imbalance: params.imbalance,
    coverageBonus,
    tacticalCoverageBonus: params.tacticalCoverageBonus ?? 0,
    passivePenalty,
  };
}

export function getIntentionExposureBonus(
  intention: IntentionDefinition,
): number {
  return intention.type === "offense" ? intention.exposureBonus ?? 0 : 0;
}

export function getShotFailureImbalance(
  intention: IntentionDefinition,
): number {
  if (intention.type !== "offense") {
    return 0;
  }

  return intention.id === "contropiede" ? 3 : 2;
}

export function getEffectiveCoverage(coverage: number, imbalance: number): number {
  return coverage < 0 ? coverage - imbalance : Math.max(0, coverage - imbalance);
}

export function getEffectiveDanger(
  danger: number,
  intention: IntentionDefinition,
): number {
  return Math.max(0, danger - getIntentionDangerPenalty(intention));
}

export function getIntentionDangerPenalty(
  intention: IntentionDefinition,
): number {
  return intention.type === "defense" ? intention.dangerPenalty ?? 0 : 0;
}

export function getIntentionGoalPenalty(
  intention: IntentionDefinition,
): number {
  return intention.type === "defense" ? intention.goalChancePenalty ?? 0 : 0;
}

export function getCombinationName(id: CombinationId): string {
  return COMBINATION_RULES.find((rule) => rule.id === id)?.name ?? id;
}

function getConclusionPassiveBonus(
  card: CardDefinition,
  squadIds: readonly CalciatoreId[],
  playerScore: number,
  opponentScore: number,
  playedCards: readonly CardDefinition[],
): number {
  return getSquad(squadIds).reduce((bonus, calciatore) => {
    return bonus + getCalciatorePassives(calciatore).reduce(
      (passiveBonus, passive) => {
        if (passive.kind === "conclusion_chance") {
          return passiveBonus + passive.value;
        }

        if (
          passive.kind === "behind_conclusion_chance" &&
          playerScore < opponentScore
        ) {
          return passiveBonus + passive.value;
        }

        if (
          passive.kind === "tag_conclusion_chance" &&
          card.tags.includes(passive.tag)
        ) {
          return passiveBonus + passive.value;
        }

        if (
          passive.kind === "prior_card_type_conclusion_chance" &&
          countPlayedCardType(playedCards, passive.cardType) >= passive.minCount
        ) {
          return passiveBonus + passive.value;
        }

        return passiveBonus;
      },
      0,
    );
  }, 0);
}

function getHighThreatCoverageBonus(
  threat: number,
  squadIds: readonly CalciatoreId[],
): number {
  return getSquad(squadIds).reduce((bonus, calciatore) => {
    return bonus + getCalciatorePassives(calciatore).reduce(
      (passiveBonus, passive) => {
        if (
          passive.kind === "high_threat_coverage" &&
          threat >= passive.threshold
        ) {
          return passiveBonus + passive.value;
        }

        return passiveBonus;
      },
      0,
    );
  }, 0);
}

function getOpponentChancePassivePenalty(
  squadIds: readonly CalciatoreId[],
): number {
  return getSquad(squadIds).reduce((bonus, calciatore) => {
    return bonus + getCalciatorePassives(calciatore).reduce(
      (passiveBonus, passive) =>
        passive.kind === "opponent_goal_chance"
          ? passiveBonus + passive.value
          : passiveBonus,
      0,
    );
  }, 0);
}

function getSquad(squadIds: readonly CalciatoreId[]): Calciatore[] {
  return squadIds.map((id) => CALCIATORE_BY_ID[id]);
}

export function getIntentionById(id: string): IntentionDefinition {
  return INTENTION_BY_ID[id];
}

function isConditionMet(
  condition: TacticalEffectCondition,
  context: TacticalEffectContext,
): boolean {
  return context.currentIntention.type === condition.intentionType;
}

function countPlayedCardType(
  playedCards: readonly CardDefinition[],
  cardType: CardType,
): number {
  return playedCards.filter((card) => card.type === cardType).length;
}

function formatSigned(value: number, suffix = ""): string {
  return `${value > 0 ? "+" : ""}${value}${suffix}`;
}
