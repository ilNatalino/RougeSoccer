import { strict as assert } from "node:assert";
import {
  CALCIATORE_BY_ID,
  CALCIATORI,
  CALCIATORI_COMUNI,
  CARD_BY_ID,
  COACHES,
  ICONE,
  IDENTITY_CARD_IDS,
  INTENTION_BY_ID,
  OPPONENTS,
  REWARD_POOL,
  STARTER_DECKS,
} from "./data";
import {
  endPhase,
  generateRewardOptions,
  getGoalChanceForCard,
  playCard,
  revealSquad,
  shoot,
  startRun,
} from "./engine";
import { createRng, shuffle } from "./rng";
import {
  calculateGoalChance,
  calculateOpponentGoalChance,
  detectCombinations,
  getCardCoverageBonus,
  getCardDangerBonus,
  getCardTacticalImpact,
  getEffectiveCoverage,
  hasBuildOccasionSequence,
} from "./rules";
import type { Opponent, RunState } from "./types";

function checkDeterministicShuffle(): void {
  const first = shuffle([1, 2, 3, 4, 5], createRng("same-seed")).items;
  const second = shuffle([1, 2, 3, 4, 5], createRng("same-seed")).items;

  assert.deepEqual(first, second);
}

function checkCombinations(): void {
  const combinations = detectCombinations([
    CARD_BY_ID["passaggio-corto"],
    CARD_BY_ID["inserimento"],
  ]);

  assert.ok(combinations.includes("centrale-spazio"));
}

function checkGoalChanceClamp(): void {
  const high = calculateGoalChance({
    card: CARD_BY_ID["tiro"],
    squadIds: ["bomber", "specialista"],
    opponent: OPPONENTS[0],
    currentIntention: INTENTION_BY_ID["attacco-paziente"],
    playedCards: [],
    activeCombinationIds: [],
    danger: 99,
    playerScore: 0,
    opponentScore: 1,
  });
  const low = calculateGoalChance({
    card: CARD_BY_ID["tiro"],
    squadIds: [],
    opponent: OPPONENTS[4],
    currentIntention: INTENTION_BY_ID["pressing-avversario"],
    playedCards: [],
    activeCombinationIds: [],
    danger: 0,
    playerScore: 0,
    opponentScore: 0,
  });

  assert.equal(high.percent, 85);
  assert.equal(low.percent, 10);
}

function checkExposureBonus(): void {
  const covered = calculateGoalChance({
    card: CARD_BY_ID["tiro"],
    squadIds: [],
    opponent: OPPONENTS[0],
    currentIntention: INTENTION_BY_ID["attacco-paziente"],
    playedCards: [],
    activeCombinationIds: [],
    danger: 0,
    playerScore: 0,
    opponentScore: 0,
  });
  const exposed = calculateGoalChance({
    card: CARD_BY_ID["tiro"],
    squadIds: [],
    opponent: OPPONENTS[0],
    currentIntention: INTENTION_BY_ID["attacco-centrale"],
    playedCards: [],
    activeCombinationIds: [],
    danger: 0,
    playerScore: 0,
    opponentScore: 0,
  });

  assert.equal(exposed.exposureBonus, 5);
  assert.equal(exposed.percent - covered.percent, 5);
}

function checkSequenceBonus(): void {
  const orderedCards = [
    CARD_BY_ID["passaggio-corto"],
    CARD_BY_ID["inserimento"],
  ];
  const reversedCards = [
    CARD_BY_ID["inserimento"],
    CARD_BY_ID["passaggio-corto"],
  ];
  const withoutSequence = calculateGoalChance({
    card: CARD_BY_ID["tiro"],
    squadIds: [],
    opponent: OPPONENTS[0],
    currentIntention: INTENTION_BY_ID["attacco-paziente"],
    playedCards: reversedCards,
    activeCombinationIds: [],
    danger: 0,
    playerScore: 0,
    opponentScore: 0,
  });
  const withSequence = calculateGoalChance({
    card: CARD_BY_ID["tiro"],
    squadIds: [],
    opponent: OPPONENTS[0],
    currentIntention: INTENTION_BY_ID["attacco-paziente"],
    playedCards: orderedCards,
    activeCombinationIds: [],
    danger: 0,
    playerScore: 0,
    opponentScore: 0,
  });

  assert.equal(hasBuildOccasionSequence(orderedCards), true);
  assert.equal(hasBuildOccasionSequence(reversedCards), false);
  assert.equal(withSequence.sequenceBonus, 5);
  assert.equal(withSequence.percent - withoutSequence.percent, 5);
}

function checkShotImbalance(): void {
  assert.equal(shootInPhase("attacco-centrale", "fail").match?.imbalance, 2);
  assert.equal(shootInPhase("contropiede", "fail").match?.imbalance, 3);
  assert.equal(shootInPhase("attacco-centrale", "success").match?.imbalance, 0);
  assert.equal(shootInPhase("blocco-basso", "fail").match?.imbalance, 0);
  assert.equal(shootInPhase("pressing-avversario", "fail").match?.imbalance, 0);
}

function checkEffectiveCoverageFloor(): void {
  assert.equal(getEffectiveCoverage(1, 3), 0);
}

function checkPostShotCardLockout(): void {
  const state = withPlayableHand("attacco-centrale", "fail", [
    { uid: "build-card", cardId: "passaggio-corto" },
    { uid: "shot-card", cardId: "tiro" },
  ], true);

  assert.equal(playCard(state, "build-card").match?.danger, 0);
  assert.equal(playCard(state, "build-card").match?.hand.length, 2);
  assert.equal(shoot(state, "shot-card").match?.playerScore, 0);
  assert.equal(shoot(state, "shot-card").match?.hand.length, 2);
}

function checkRewardUniqueness(): void {
  const rewards = generateRewardOptions(createRng("rewards"));

  assert.equal(rewards.options.length, 3);
  assert.equal(new Set(rewards.options).size, 3);
  assert.ok(rewards.options.every((cardId) => !IDENTITY_CARD_IDS.includes(cardId)));
}

function checkCoachStarterDecks(): void {
  assert.equal(COACHES.length, 3);

  for (const coach of COACHES) {
    const entries = STARTER_DECKS[coach.id].entries;
    const totalSlots = entries.reduce((total, entry) => total + entry.copies, 0);
    const identitySlots = entries.reduce((total, entry) => {
      const card = CARD_BY_ID[entry.cardId];

      return card.identityCoachId ? total + entry.copies : total;
    }, 0);
    const sharedSlots = totalSlots - identitySlots;

    assert.equal(totalSlots, 15);
    assert.equal(identitySlots, 6);
    assert.equal(sharedSlots, 9);
  }
}

function checkIdentityCardExclusivity(): void {
  assert.equal(IDENTITY_CARD_IDS.length, 9);

  for (const identityCardId of IDENTITY_CARD_IDS) {
    const owningDecks = COACHES.filter((coach) =>
      STARTER_DECKS[coach.id].entries.some(
        (entry) => entry.cardId === identityCardId,
      ),
    );

    assert.equal(owningDecks.length, 1);
    assert.ok(!REWARD_POOL.includes(identityCardId));
  }

  assert.ok(REWARD_POOL.every((cardId) => !CARD_BY_ID[cardId].identityCoachId));
}

function checkRunUsesSelectedCoachDeck(): void {
  const run = startRun("assalto", "coach-run-check");
  const sameSeedOtherCoach = startRun("blocco-basso", "coach-run-check");

  assert.equal(run.coachId, "assalto");
  assert.deepEqual(run.squad, sameSeedOtherCoach.squad);
  assert.equal(run.squad.length, 3);
  assert.deepEqual(
    countCards(run.ownedDeck),
    countStarterEntries(STARTER_DECKS.assalto.entries),
  );
}

function checkIconLedSquad(): void {
  const run = startRun("maestro-possesso", "icon-squad-check");
  const squad = run.squad.map((id) => CALCIATORE_BY_ID[id]);

  assert.equal(CALCIATORI_COMUNI.length, 10);
  assert.equal(ICONE.length, 6);
  assert.equal(CALCIATORI.length, 16);
  assert.equal(new Set(CALCIATORI.map((calciatore) => calciatore.id)).size, 16);
  assert.equal(squad.length, 3);
  assert.equal(
    squad.filter((calciatore) => calciatore.category === "icona").length,
    1,
  );
  assert.equal(
    squad.filter((calciatore) => calciatore.category === "comune").length,
    2,
  );
}

function checkIconPassiveEffects(): void {
  const diezWithoutOccasion = calculateGoalChance({
    card: CARD_BY_ID["tiro"],
    squadIds: ["il-diez"],
    opponent: OPPONENTS[0],
    currentIntention: INTENTION_BY_ID["attacco-paziente"],
    playedCards: [],
    activeCombinationIds: [],
    danger: 0,
    playerScore: 0,
    opponentScore: 0,
  });
  const diezAfterOccasion = calculateGoalChance({
    card: CARD_BY_ID["tiro"],
    squadIds: ["il-diez"],
    opponent: OPPONENTS[0],
    currentIntention: INTENTION_BY_ID["attacco-paziente"],
    playedCards: [CARD_BY_ID["inserimento"]],
    activeCombinationIds: [],
    danger: 0,
    playerScore: 0,
    opponentScore: 0,
  });
  const frecciaWideBonus = getCardTacticalImpact(CARD_BY_ID["cambio-gioco"], {
    playedCards: [],
    currentIntention: INTENTION_BY_ID["attacco-paziente"],
  });
  const muroThreatCoverage = calculateOpponentGoalChance({
    intention: INTENTION_BY_ID["assalto-finale"],
    opponent: OPPONENTS[4],
    coverage: 0,
    imbalance: 0,
    squadIds: ["muro-azzurro"],
  });

  assert.equal(diezWithoutOccasion.passiveBonus, 0);
  assert.equal(diezAfterOccasion.passiveBonus, 10);
  assert.equal(
    getCardDangerBonus(CARD_BY_ID["cambio-gioco"], ["freccia-oro"]),
    2,
  );
  assert.equal(frecciaWideBonus.danger, 0);
  assert.equal(
    getCardCoverageBonus(CARD_BY_ID["pressing"], ["muro-azzurro"]),
    2,
  );
  assert.equal(muroThreatCoverage?.coverageBonus, 1);
}

function checkLancioLungoConclusionBonus(): void {
  const offensive = playCard(
    withPlayableHand("attacco-centrale", "lancio-offense", [
      { uid: "lancio", cardId: "lancio-lungo" },
      { uid: "shot-card", cardId: "tiro" },
    ]),
    "lancio",
  );

  assert.equal(offensive.match?.activeTacticalEffects.length, 1);
  assert.equal(
    getGoalChanceForCard(offensive, {
      uid: "shot-card",
      cardId: "tiro",
    }).tacticalEffectBonus,
    10,
  );
  assert.equal(shoot(offensive, "shot-card").match?.activeTacticalEffects.length, 0);

  const defensive = playCard(
    withPlayableHand("blocco-basso", "lancio-defense", [
      { uid: "lancio", cardId: "lancio-lungo" },
      { uid: "shot-card", cardId: "tiro" },
    ]),
    "lancio",
  );

  assert.equal(defensive.match?.activeTacticalEffects.length, 0);
}

function checkSequenceIdentityEffects(): void {
  const noPriorTerzo = playCard(
    withPlayableHand("attacco-paziente", "terzo-none", [
      { uid: "terzo", cardId: "terzo-uomo" },
    ]),
    "terzo",
  );
  const priorConstruction = withPlayedCards(
    withPlayableHand("attacco-paziente", "terzo-prior", [
      { uid: "terzo", cardId: "terzo-uomo" },
    ]),
    [{ uid: "cambio", cardId: "cambio-gioco" }],
  );
  const afterPriorTerzo = playCard(priorConstruction, "terzo");
  const imbucataNoBonus = calculateGoalChance({
    card: CARD_BY_ID["imbucata-centrale"],
    squadIds: [],
    opponent: OPPONENTS[0],
    currentIntention: INTENTION_BY_ID["attacco-paziente"],
    playedCards: [CARD_BY_ID["passaggio-corto"]],
    activeCombinationIds: [],
    danger: 0,
    playerScore: 0,
    opponentScore: 0,
  });
  const imbucataWithBonus = calculateGoalChance({
    card: CARD_BY_ID["imbucata-centrale"],
    squadIds: [],
    opponent: OPPONENTS[0],
    currentIntention: INTENTION_BY_ID["attacco-paziente"],
    playedCards: [CARD_BY_ID["passaggio-corto"], CARD_BY_ID["cambio-gioco"]],
    activeCombinationIds: [],
    danger: 0,
    playerScore: 0,
    opponentScore: 0,
  });

  assert.equal(
    getCardTacticalImpact(CARD_BY_ID["terzo-uomo"], {
      playedCards: [CARD_BY_ID["cambio-gioco"]],
      currentIntention: INTENTION_BY_ID["attacco-paziente"],
    }).danger,
    1,
  );
  assert.equal(noPriorTerzo.match?.danger, 2);
  assert.equal(afterPriorTerzo.match?.danger, 3);
  assert.equal(imbucataNoBonus.tacticalEffectBonus, 0);
  assert.equal(imbucataWithBonus.tacticalEffectBonus, 10);
}

function checkLineaCompattaCoverageBonus(): void {
  const offensive = playCard(
    withCoverage(
      withPlayableHand("attacco-centrale", "linea-offense", [
        { uid: "linea", cardId: "linea-compatta" },
      ]),
      0,
    ),
    "linea",
  );
  const defensive = playCard(
    withCoverage(
      withPlayableHand("blocco-basso", "linea-defense", [
        { uid: "linea", cardId: "linea-compatta" },
      ]),
      0,
    ),
    "linea",
  );

  assert.equal(offensive.match?.coverage, 5);
  assert.equal(defensive.match?.coverage, 4);
}

function checkNegativeCoverageRisk(): void {
  const afterOverlap = playCard(
    withCoverage(
      withPlayableHand("assalto-finale", "negative-coverage", [
        { uid: "overlap", cardId: "sovrapposizione-continua" },
      ]),
      0,
    ),
    "overlap",
  );
  const neutralOpponent: Opponent = {
    id: "neutral-check",
    name: "Neutral check",
    attack: 0,
    defense: 0,
    theme: "Check",
    intentionDeck: [],
  };
  const risk = calculateOpponentGoalChance({
    intention: INTENTION_BY_ID["assalto-finale"],
    opponent: neutralOpponent,
    coverage: -1,
    imbalance: 0,
    squadIds: [],
  });

  assert.equal(afterOverlap.match?.coverage, -1);
  assert.equal(getEffectiveCoverage(1, 2), 0);
  assert.equal(getEffectiveCoverage(-1, 2), -3);
  assert.equal(risk?.residualThreat, 5);
}

function checkTerminalStates(): void {
  const rewardState = endPhase(
    withTerminalScore(
      revealSquad(startRun("maestro-possesso", "reward-check")),
      0,
      1,
      0,
    ),
  );
  const gameOverState = endPhase(
    withTerminalScore(
      revealSquad(startRun("maestro-possesso", "draw-check")),
      0,
      0,
      0,
    ),
  );
  const victoryState = endPhase(
    withTerminalScore(
      revealSquad(startRun("maestro-possesso", "boss-check")),
      4,
      2,
      1,
    ),
  );

  assert.equal(rewardState.status, "reward");
  assert.equal(gameOverState.status, "game-over");
  assert.equal(victoryState.status, "victory");
}

function countCards(cards: RunState["ownedDeck"]): Record<string, number> {
  return cards.reduce<Record<string, number>>((counts, card) => {
    counts[card.cardId] = (counts[card.cardId] ?? 0) + 1;

    return counts;
  }, {});
}

function countStarterEntries(
  entries: (typeof STARTER_DECKS)[keyof typeof STARTER_DECKS]["entries"],
): Record<string, number> {
  return entries.reduce<Record<string, number>>((counts, entry) => {
    counts[entry.cardId] = entry.copies;

    return counts;
  }, {});
}

function withTerminalScore(
  state: RunState,
  matchIndex: number,
  playerScore: number,
  opponentScore: number,
): RunState {
  assert.ok(state.match);
  const opponent = OPPONENTS[matchIndex];

  return {
    ...state,
    status: "match",
    matchIndex,
    match: {
      ...state.match,
      matchNumber: matchIndex + 1,
      opponentId: opponent.id,
      isBoss: matchIndex === OPPONENTS.length - 1,
      phaseNumber: 10,
      playerScore,
      opponentScore,
      currentIntentionId: "blocco-basso",
    },
  };
}

function shootInPhase(intentionId: string, rngSeed: string): RunState {
  return shoot(
    withPlayableHand(intentionId, rngSeed, [
      { uid: "shot-card", cardId: "tiro" },
    ]),
    "shot-card",
  );
}

function withPlayableHand(
  intentionId: string,
  rngSeed: string,
  hand: RunState["ownedDeck"],
  shotTaken = false,
): RunState {
  const state = revealSquad(
    startRun("maestro-possesso", `check-${intentionId}-${rngSeed}`),
  );

  assert.ok(state.match);

  return {
    ...state,
    squad: [],
    status: "match",
    rng: createRng(rngSeed),
    match: {
      ...state.match,
      currentIntentionId: intentionId,
      energy: 3,
      danger: 0,
      coverage: 3,
      imbalance: 0,
      shotTaken,
      hand,
      playedCards: [],
      activeCombinationIds: [],
      playerScore: 0,
      opponentScore: 0,
      lastShot: undefined,
    },
  };
}

function withCoverage(state: RunState, coverage: number): RunState {
  assert.ok(state.match);

  return {
    ...state,
    match: {
      ...state.match,
      coverage,
      tacticalEffectCoverage: 0,
    },
  };
}

function withPlayedCards(
  state: RunState,
  playedCards: RunState["ownedDeck"],
): RunState {
  assert.ok(state.match);

  return {
    ...state,
    match: {
      ...state.match,
      playedCards,
      activeCombinationIds: [],
      tacticalEffectDanger: 0,
      tacticalEffectCoverage: 0,
    },
  };
}

checkDeterministicShuffle();
checkCombinations();
checkGoalChanceClamp();
checkExposureBonus();
checkSequenceBonus();
checkShotImbalance();
checkEffectiveCoverageFloor();
checkPostShotCardLockout();
checkRewardUniqueness();
checkCoachStarterDecks();
checkIdentityCardExclusivity();
checkRunUsesSelectedCoachDeck();
checkIconLedSquad();
checkIconPassiveEffects();
checkLancioLungoConclusionBonus();
checkSequenceIdentityEffects();
checkLineaCompattaCoverageBonus();
checkNegativeCoverageRisk();
checkTerminalStates();

console.log("Game checks passed");
