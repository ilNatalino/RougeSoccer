import {
  CALCIATORE_BY_ID,
  CALCIATORI_COMUNI,
  CARD_BY_ID,
  COACH_BY_ID,
  COMBINATION_RULES,
  ICONE,
  INTENTION_BY_ID,
  OPPONENT_BY_ID,
  OPPONENTS,
  REWARD_POOL,
  STARTER_DECKS,
} from "./data";
import {
  chooseManyDistinct,
  createRng,
  createRunSeed,
  rollPercent,
  shuffle,
} from "./rng";
import {
  calculateGoalChance,
  calculateOpponentGoalChance,
  getCardCoverageBonus,
  getCardDangerBonus,
  getCardTacticalImpact,
  getCardsFromInstances,
  getEffectiveDanger,
  getNewPhaseCombinationBonus,
  getShotFailureImbalance,
} from "./rules";
import type {
  Calciatore,
  CardDefinition,
  CardId,
  CardInstance,
  CoachId,
  GoalChanceBreakdown,
  IntentionDefinition,
  IntentionId,
  MatchState,
  Opponent,
  OpponentChanceBreakdown,
  RngState,
  RunState,
} from "./types";
import { HAND_SIZE, MAX_PHASES, PHASE_ENERGY } from "./types";

export function startRun(coachId: CoachId, seed = createRunSeed()): RunState {
  const coach = COACH_BY_ID[coachId];

  if (!coach) {
    throw new Error(`Unknown coach: ${coachId}`);
  }

  let rng = createRng(seed);
  const iconPick = chooseManyDistinct(ICONE, 1, rng);
  rng = iconPick.rng;
  const commonPick = chooseManyDistinct(CALCIATORI_COMUNI, 2, rng);
  rng = commonPick.rng;
  const squad = [...iconPick.items, ...commonPick.items];

  let nextCardUid = 1;
  const ownedDeck = STARTER_DECKS[coachId].entries.flatMap((entry) =>
    Array.from({ length: entry.copies }, () => ({
      uid: `card-${nextCardUid++}`,
      cardId: entry.cardId,
    })),
  );

  const baseState: RunState = {
    status: "squad",
    seed,
    rng,
    coachId,
    squad: squad.map((calciatore) => calciatore.id),
    ownedDeck,
    nextCardUid,
    matchIndex: 0,
    log: [
      `Allenatore: ${coach.name}`,
      `Icona: ${iconPick.items[0]?.name ?? "Nessuna"}`,
      `Seed ${seed}`,
    ],
  };

  return startMatch(baseState, 0, "squad");
}

export function revealSquad(state: RunState): RunState {
  if (state.status !== "squad") {
    return state;
  }

  return {
    ...state,
    status: "match",
    log: appendLog(state.log, "Partita 1 iniziata"),
  };
}

export function playCard(state: RunState, uid: string): RunState {
  if (state.status !== "match" || !state.match) {
    return state;
  }

  const match = state.match;

  if (match.shotTaken) {
    return withLog(state, "Azione conclusa: termina la Fase");
  }

  const handIndex = match.hand.findIndex((card) => card.uid === uid);

  if (handIndex < 0 || match.energy <= 0) {
    return withLog(state, "Energia insufficiente o carta non disponibile");
  }

  const instance = match.hand[handIndex];
  const card = CARD_BY_ID[instance.cardId];

  if (card.type === "conclusione") {
    return withLog(state, "Usa Conclusione per tirare");
  }

  const nextHand = removeAt(match.hand, handIndex);
  const priorDefinitions = getCardsFromInstances(match.playedCards);
  const playedCards = [...match.playedCards, instance];
  const playedDefinitions = getCardsFromInstances(playedCards);
  const tacticalImpact = getCardTacticalImpact(card, {
    playedCards: priorDefinitions,
    currentIntention: getCurrentIntention(state),
  });
  const cardDanger = card.danger ?? 0;
  const squadDanger = getCardDangerBonus(card, state.squad);
  const cardCoverage = card.coverage ?? 0;
  const squadCoverage = getCardCoverageBonus(card, state.squad);
  const combination = getNewPhaseCombinationBonus(
    playedDefinitions,
    match.activeCombinationIds,
  );
  const danger =
    match.danger +
    cardDanger +
    squadDanger +
    tacticalImpact.danger +
    combination.danger;
  const coverage =
    match.coverage +
    cardCoverage +
    squadCoverage +
    tacticalImpact.coverage +
    combination.coverage;
  const impactText = formatCardImpact({
    cardDanger,
    squadDanger,
    tacticalDanger: tacticalImpact.danger,
    cardCoverage,
    squadCoverage,
    tacticalCoverage: tacticalImpact.coverage,
  });
  const combinationText = formatCombinationImpact(
    combination.ids,
    combination.danger,
    combination.coverage,
  );
  const tacticalText = formatTacticalImpact(tacticalImpact.descriptions);

  return {
    ...state,
    match: {
      ...match,
      energy: match.energy - card.cost,
      hand: nextHand,
      playedCards,
      danger,
      coverage,
      activeTacticalEffects: [
        ...match.activeTacticalEffects,
        ...tacticalImpact.activeEffects,
      ],
      tacticalEffectDanger:
        match.tacticalEffectDanger + tacticalImpact.danger,
      tacticalEffectCoverage:
        match.tacticalEffectCoverage + tacticalImpact.coverage,
      activeCombinationIds: [
        ...match.activeCombinationIds,
        ...combination.ids,
      ],
    },
    log: appendLog(
      state.log,
      `${card.name}: ${impactText}${tacticalText}${combinationText}`,
    ),
  };
}

export function shoot(state: RunState, uid: string): RunState {
  if (state.status !== "match" || !state.match) {
    return state;
  }

  const match = state.match;

  if (match.shotTaken) {
    return withLog(state, "Azione conclusa: termina la Fase");
  }

  const handIndex = match.hand.findIndex((card) => card.uid === uid);

  if (handIndex < 0 || match.energy <= 0) {
    return withLog(state, "Energia insufficiente o carta non disponibile");
  }

  const instance = match.hand[handIndex];
  const card = CARD_BY_ID[instance.cardId];

  if (card.type !== "conclusione") {
    return playCard(state, uid);
  }

  const chance = getGoalChanceForCard(state, instance);
  const roll = rollPercent(state.rng, chance.percent);
  const playedCards = [...match.playedCards, instance];
  const nextScore = roll.success ? match.playerScore + 1 : match.playerScore;
  const imbalance = roll.success
    ? 0
    : getShotFailureImbalance(getCurrentIntention(state));
  const activeCombinationIds = [
    ...new Set([
      ...match.activeCombinationIds,
      ...getScoringCombinationIds(state, card),
    ]),
  ];

  return {
    ...state,
    rng: roll.rng,
    match: {
      ...match,
      energy: match.energy - card.cost,
      hand: removeAt(match.hand, handIndex),
      playedCards,
      activeCombinationIds,
      activeTacticalEffects: [],
      shotTaken: true,
      imbalance,
      playerScore: nextScore,
      lastShot: {
        cardId: card.id,
        chance: chance.percent,
        roll: roll.roll,
        goal: roll.success,
      },
    },
    log: appendLog(
      state.log,
      roll.success
        ? `${card.name}: gol (${roll.roll}/${chance.percent})`
        : `${card.name}: tiro fallito (${roll.roll}/${chance.percent})${
            imbalance > 0 ? `, Sbilanciamento +${imbalance}` : ""
          }`,
    ),
  };
}

export function endPhase(state: RunState): RunState {
  if (state.status !== "match" || !state.match) {
    return state;
  }

  let rng = state.rng;
  const match = state.match;
  const opponent = getCurrentOpponent(state);
  const intention = getCurrentIntention(state);
  const opponentChance = calculateOpponentGoalChance({
    intention,
    opponent,
    coverage: match.coverage,
    imbalance: match.imbalance,
    squadIds: state.squad,
  });
  let opponentScore = match.opponentScore;
  let log = state.log;

  if (opponentChance) {
    const roll = rollPercent(rng, opponentChance.percent);
    rng = roll.rng;
    opponentScore = roll.success ? opponentScore + 1 : opponentScore;
    log = appendLog(
      log,
      roll.success
        ? `${intention.name}: gol avversario (${roll.roll}/${opponentChance.percent})`
        : `${intention.name}: contenuta (${roll.roll}/${opponentChance.percent})`,
    );
  } else {
    log = appendLog(log, `${intention.name} risolta`);
  }

  const discardPile = [
    ...match.discardPile,
    ...match.hand,
    ...match.playedCards,
  ];

  if (match.phaseNumber >= MAX_PHASES) {
    const finishedMatch: MatchState = {
      ...match,
      opponentScore,
      hand: [],
      playedCards: [],
      discardPile,
      energy: 0,
    };

    return completeMatch({
      ...state,
      rng,
      match: finishedMatch,
      log,
    });
  }

  const nextIntention = drawIntention(
    match.intentionDrawPile,
    [...match.intentionDiscardPile, match.currentIntentionId],
    rng,
  );
  rng = nextIntention.rng;

  const emptyPhase: MatchState = {
    ...match,
    phaseNumber: match.phaseNumber + 1,
    opponentScore,
    energy: PHASE_ENERGY,
    danger: 0,
    coverage: 0,
    imbalance: 0,
    shotTaken: false,
    activeTacticalEffects: [],
    tacticalEffectDanger: 0,
    tacticalEffectCoverage: 0,
    hand: [],
    playedCards: [],
    discardPile,
    currentIntentionId: nextIntention.intentionId,
    intentionDrawPile: nextIntention.drawPile,
    intentionDiscardPile: nextIntention.discardPile,
    activeCombinationIds: [],
    lastShot: undefined,
  };
  const nextHand = drawHand(emptyPhase, rng);

  return {
    ...state,
    rng: nextHand.rng,
    match: nextHand.match,
    log: appendLog(log, `Fase ${emptyPhase.phaseNumber}`),
  };
}

export function chooseReward(state: RunState, cardId: CardId): RunState {
  if (state.status !== "reward") {
    return state;
  }

  const reward = CARD_BY_ID[cardId];
  const nextState: RunState = {
    ...state,
    ownedDeck: [
      ...state.ownedDeck,
      { uid: `card-${state.nextCardUid}`, cardId },
    ],
    nextCardUid: state.nextCardUid + 1,
    rewardOptions: undefined,
    log: appendLog(state.log, `Ricompensa: ${reward.name}`),
  };

  return startMatch(nextState, state.matchIndex + 1, "match");
}

export function skipReward(state: RunState): RunState {
  if (state.status !== "reward") {
    return state;
  }

  return startMatch(
    {
      ...state,
      rewardOptions: undefined,
      log: appendLog(state.log, "Ricompensa saltata"),
    },
    state.matchIndex + 1,
    "match",
  );
}

export function generateRewardOptions(
  rng: RngState,
): { rng: RngState; options: CardId[] } {
  const rewardPick = chooseManyDistinct(REWARD_POOL, 3, rng);

  return {
    rng: rewardPick.rng,
    options: rewardPick.items,
  };
}

export function getCurrentOpponent(state: RunState): Opponent {
  const opponentId = state.match?.opponentId ?? OPPONENTS[state.matchIndex].id;
  return OPPONENT_BY_ID[opponentId];
}

export function getCurrentIntention(state: RunState): IntentionDefinition {
  if (!state.match) {
    return INTENTION_BY_ID["attacco-paziente"];
  }

  return INTENTION_BY_ID[state.match.currentIntentionId];
}

export function getSquad(state: RunState): Calciatore[] {
  return state.squad.map((id) => CALCIATORE_BY_ID[id]);
}

export function getCard(instance: CardInstance): CardDefinition {
  return CARD_BY_ID[instance.cardId];
}

export function getGoalChanceForCard(
  state: RunState,
  instance: CardInstance,
): GoalChanceBreakdown {
  if (!state.match) {
    throw new Error("Cannot calculate goal chance without a match");
  }

  const card = CARD_BY_ID[instance.cardId];

  return calculateGoalChance({
    card,
    squadIds: state.squad,
    opponent: getCurrentOpponent(state),
    currentIntention: getCurrentIntention(state),
    playedCards: getCardsFromInstances(state.match.playedCards),
    activeCombinationIds: state.match.activeCombinationIds,
    activeTacticalEffects: state.match.activeTacticalEffects,
    danger: state.match.danger,
    playerScore: state.match.playerScore,
    opponentScore: state.match.opponentScore,
  });
}

export function getOpponentGoalChanceForState(
  state: RunState,
): OpponentChanceBreakdown | null {
  if (!state.match) {
    return null;
  }

  return calculateOpponentGoalChance({
    intention: getCurrentIntention(state),
    opponent: getCurrentOpponent(state),
    coverage: state.match.coverage,
    imbalance: state.match.imbalance,
    squadIds: state.squad,
    tacticalCoverageBonus: state.match.tacticalEffectCoverage,
  });
}

export function getEffectiveDangerForState(state: RunState): number {
  if (!state.match) {
    return 0;
  }

  return getEffectiveDanger(state.match.danger, getCurrentIntention(state));
}

function startMatch(
  state: RunState,
  matchIndex: number,
  status: RunState["status"],
): RunState {
  const initialized = initializeMatch(state, matchIndex);
  const opponent = OPPONENTS[matchIndex];

  return {
    ...state,
    status,
    rng: initialized.rng,
    matchIndex,
    match: initialized.match,
    finalMessage: undefined,
    log: appendLog(state.log, `${opponent.name} pronta`),
  };
}

function initializeMatch(
  state: RunState,
  matchIndex: number,
): { rng: RngState; match: MatchState } {
  const opponent = OPPONENTS[matchIndex];
  let rng = state.rng;
  const deckShuffle = shuffle(state.ownedDeck, rng);
  rng = deckShuffle.rng;
  const intentionShuffle = shuffle(opponent.intentionDeck, rng);
  rng = intentionShuffle.rng;
  const intentionDraw = drawIntention(intentionShuffle.items, [], rng);
  rng = intentionDraw.rng;

  const emptyMatch: MatchState = {
    matchNumber: matchIndex + 1,
    opponentId: opponent.id,
    isBoss: matchIndex === OPPONENTS.length - 1,
    phaseNumber: 1,
    playerScore: 0,
    opponentScore: 0,
    energy: PHASE_ENERGY,
    danger: 0,
    coverage: 0,
    imbalance: 0,
    shotTaken: false,
    activeTacticalEffects: [],
    tacticalEffectDanger: 0,
    tacticalEffectCoverage: 0,
    drawPile: deckShuffle.items,
    hand: [],
    discardPile: [],
    playedCards: [],
    intentionDrawPile: intentionDraw.drawPile,
    intentionDiscardPile: intentionDraw.discardPile,
    currentIntentionId: intentionDraw.intentionId,
    activeCombinationIds: [],
  };
  const handDraw = drawHand(emptyMatch, rng);

  return {
    rng: handDraw.rng,
    match: handDraw.match,
  };
}

function drawHand(
  match: MatchState,
  rng: RngState,
): { rng: RngState; match: MatchState } {
  let nextRng = rng;
  let drawPile = [...match.drawPile];
  let discardPile = [...match.discardPile];
  const hand = [...match.hand];

  while (
    hand.length < HAND_SIZE &&
    (drawPile.length > 0 || discardPile.length > 0)
  ) {
    if (drawPile.length === 0) {
      const reshuffle = shuffle(discardPile, nextRng);
      nextRng = reshuffle.rng;
      drawPile = reshuffle.items;
      discardPile = [];
    }

    const nextCard = drawPile.shift();
    if (nextCard) {
      hand.push(nextCard);
    }
  }

  return {
    rng: nextRng,
    match: {
      ...match,
      drawPile,
      discardPile,
      hand,
    },
  };
}

function drawIntention(
  drawPile: IntentionId[],
  discardPile: IntentionId[],
  rng: RngState,
): {
  rng: RngState;
  intentionId: IntentionId;
  drawPile: IntentionId[];
  discardPile: IntentionId[];
} {
  let nextRng = rng;
  let nextDrawPile = [...drawPile];
  let nextDiscardPile = [...discardPile];

  if (nextDrawPile.length === 0 && nextDiscardPile.length > 0) {
    const reshuffle = shuffle(nextDiscardPile, nextRng);
    nextRng = reshuffle.rng;
    nextDrawPile = reshuffle.items;
    nextDiscardPile = [];
  }

  const intentionId = nextDrawPile.shift();

  if (!intentionId) {
    throw new Error("Opponent intention deck is empty");
  }

  return {
    rng: nextRng,
    intentionId,
    drawPile: nextDrawPile,
    discardPile: nextDiscardPile,
  };
}

function completeMatch(state: RunState): RunState {
  if (!state.match) {
    return state;
  }

  const playerWon = state.match.playerScore > state.match.opponentScore;

  if (!playerWon) {
    return {
      ...state,
      status: "game-over",
      finalMessage: `Sconfitta ${state.match.playerScore}-${state.match.opponentScore}`,
      log: appendLog(state.log, "Run terminata"),
    };
  }

  if (state.match.isBoss) {
    return {
      ...state,
      status: "victory",
      finalMessage: `Boss battuto ${state.match.playerScore}-${state.match.opponentScore}`,
      log: appendLog(state.log, "Run completata"),
    };
  }

  const rewards = generateRewardOptions(state.rng);

  return {
    ...state,
    status: "reward",
    rng: rewards.rng,
    rewardOptions: rewards.options,
    log: appendLog(state.log, "Partita vinta"),
  };
}

function getScoringCombinationIds(
  state: RunState,
  conclusionCard: CardDefinition,
): string[] {
  if (!state.match) {
    return [];
  }

  const active = new Set(state.match.activeCombinationIds);
  return calculateGoalChance({
    card: conclusionCard,
    squadIds: state.squad,
    opponent: getCurrentOpponent(state),
    currentIntention: getCurrentIntention(state),
    playedCards: getCardsFromInstances(state.match.playedCards),
    activeCombinationIds: state.match.activeCombinationIds,
    activeTacticalEffects: state.match.activeTacticalEffects,
    danger: state.match.danger,
    playerScore: state.match.playerScore,
    opponentScore: state.match.opponentScore,
  }).combinationBonus > 0
    ? ["piazzato-conclusione"].filter((id) => !active.has(id))
    : [];
}

function formatCardImpact(params: {
  cardDanger: number;
  squadDanger: number;
  tacticalDanger: number;
  cardCoverage: number;
  squadCoverage: number;
  tacticalCoverage: number;
}): string {
  const parts: string[] = [];
  const danger =
    params.cardDanger + params.squadDanger + params.tacticalDanger;
  const coverage =
    params.cardCoverage + params.squadCoverage + params.tacticalCoverage;

  if (danger !== 0) {
    parts.push(
      `${formatSigned(danger)} Pericolosita${formatSourcePart(
        params.squadDanger,
        params.tacticalDanger,
      )}`,
    );
  }

  if (coverage !== 0) {
    parts.push(
      `${formatSigned(coverage)} Copertura${formatSourcePart(
        params.squadCoverage,
        params.tacticalCoverage,
      )}`,
    );
  }

  return parts.length > 0 ? parts.join(", ") : "giocata";
}

function formatSourcePart(squad: number, tactical: number): string {
  const parts = [
    squad !== 0 ? `${formatSigned(squad)} squadra` : "",
    tactical !== 0 ? `${formatSigned(tactical)} effetto` : "",
  ].filter(Boolean);

  return parts.length > 0 ? ` (${parts.join(", ")})` : "";
}

function formatCombinationImpact(
  ids: readonly string[],
  danger: number,
  coverage: number,
): string {
  if (ids.length === 0) {
    return "";
  }

  const names = ids.map(getCombinationName);
  const effects = [
    danger > 0 ? `+${danger} Pericolosita` : "",
    coverage > 0 ? `+${coverage} Copertura` : "",
  ].filter(Boolean);

  return ` | Combo ${names.join(", ")}${
    effects.length > 0 ? ` (${effects.join(", ")})` : ""
  }`;
}

function formatTacticalImpact(descriptions: readonly string[]): string {
  return descriptions.length > 0
    ? ` | Effetti ${descriptions.join(", ")}`
    : "";
}

function getCombinationName(id: string): string {
  return COMBINATION_RULES.find((rule) => rule.id === id)?.name ?? id;
}

function removeAt<T>(items: readonly T[], index: number): T[] {
  return [...items.slice(0, index), ...items.slice(index + 1)];
}

function withLog(state: RunState, message: string): RunState {
  return {
    ...state,
    log: appendLog(state.log, message),
  };
}

function appendLog(log: readonly string[], message: string): string[] {
  return [message, ...log].slice(0, 8);
}

function formatSigned(value: number): string {
  return `${value > 0 ? "+" : ""}${value}`;
}
