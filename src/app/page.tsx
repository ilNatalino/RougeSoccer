"use client";

import {
  BookOpen,
  ChevronRight,
  ClipboardList,
  Flag,
  Play,
  PlusCircle,
  RotateCcw,
  Shield,
  SkipForward,
  Target,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  CARD_BY_ID,
  COACHES,
  COACH_BY_ID,
  COMBINATION_RULES,
  STARTER_DECKS,
} from "../game/data";
import { CardIllustration } from "./card-illustrations";
import {
  chooseReward,
  endPhase,
  getCard,
  getCurrentIntention,
  getCurrentOpponent,
  getEffectiveDangerForState,
  getGoalChanceForCard,
  getOpponentGoalChanceForState,
  getSquad,
  playCard,
  revealSquad,
  shoot,
  skipReward,
  startRun,
} from "../game/engine";
import {
  BUILD_OCCASION_SEQUENCE_BONUS,
  describeTacticalEffect,
  getCardCoverageBonus,
  getCardDangerBonus,
  getCardTacticalImpact,
  getCalciatorePassives,
  getIntentionExposureBonus,
  getNewPhaseCombinationBonus,
  isTacticalEffectActive,
} from "../game/rules";
import type {
  Calciatore,
  CalciatoreCategory,
  CardDefinition,
  CardInstance,
  CardType,
  CoachDefinition,
  CoachId,
  GoalChanceBreakdown,
  RunState,
} from "../game/types";

const CARD_TYPE_LABEL: Record<CardType, string> = {
  costruzione: "Costruzione",
  occasione: "Occasione",
  conclusione: "Conclusione",
  difesa: "Difesa",
  supporto: "Supporto",
};

const CALCIATORE_CATEGORY_LABEL: Record<CalciatoreCategory, string> = {
  icona: "Icona",
  comune: "Comune",
};

type VisibleBoost = {
  id: string;
  text: string;
  tone: "attack" | "defense" | "chance";
};

type CardImpactSummary = {
  dangerBase: number;
  dangerSquad: number;
  dangerTactical: number;
  dangerTotal: number;
  coverageBase: number;
  coverageSquad: number;
  coverageTactical: number;
  coverageTotal: number;
};

type MenuScreen = "start" | "coach";

export default function Home() {
  const [run, setRun] = useState<RunState | null>(null);
  const [menuScreen, setMenuScreen] = useState<MenuScreen>("start");
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const restart = () => {
    setRun(null);
    setMenuScreen("start");
  };
  const startCoachRun = (coachId: CoachId) => setRun(startRun(coachId));
  const apply = (action: (state: RunState) => RunState) => {
    setRun((current) => (current ? action(current) : current));
  };

  return (
    <main className="game-shell">
      <Header
        run={run}
        onRestart={restart}
        onOpenGuide={() => setIsGuideOpen(true)}
      />
      {!run && menuScreen === "start" && (
        <StartScreen
          onContinue={() => setMenuScreen("coach")}
          onOpenGuide={() => setIsGuideOpen(true)}
        />
      )}
      {!run && menuScreen === "coach" && (
        <CoachSelectionScreen onStart={startCoachRun} />
      )}
      {run?.status === "squad" && (
        <SquadScreen run={run} onContinue={() => apply(revealSquad)} />
      )}
      {run?.status === "match" && (
        <MatchScreen
          run={run}
          onPlay={(uid) => apply((state) => playCard(state, uid))}
          onShoot={(uid) => apply((state) => shoot(state, uid))}
          onEndPhase={() => apply(endPhase)}
        />
      )}
      {run?.status === "reward" && (
        <RewardScreen
          run={run}
          onChoose={(cardId) => apply((state) => chooseReward(state, cardId))}
          onSkip={() => apply(skipReward)}
        />
      )}
      {(run?.status === "victory" || run?.status === "game-over") && (
        <OutcomeScreen run={run} onRestart={restart} />
      )}
      {isGuideOpen && <GameGuide onClose={() => setIsGuideOpen(false)} />}
    </main>
  );
}

function Header({
  run,
  onRestart,
  onOpenGuide,
}: {
  run: RunState | null;
  onRestart: () => void;
  onOpenGuide: () => void;
}) {
  return (
    <header className="topbar">
      <div className="brand">
        <div>
          <h1>Rouge Soccer</h1>
          {run && <p>Seed {run.seed}</p>}
        </div>
      </div>
      {run && (
        <div className="topbar-actions">
          {run.status === "match" && (
            <button className="tool-button" type="button" onClick={onOpenGuide}>
              <BookOpen aria-hidden="true" size={18} />
              Come si gioca
            </button>
          )}
          <button className="tool-button" type="button" onClick={onRestart}>
            <RotateCcw aria-hidden="true" size={18} />
            Nuova Run
          </button>
        </div>
      )}
    </header>
  );
}

function StartScreen({
  onContinue,
  onOpenGuide,
}: {
  onContinue: () => void;
  onOpenGuide: () => void;
}) {
  return (
    <section className="start-grid">
      <PitchVisual formation="4-3-3" />
      <div className="start-panel start-menu-panel">
        <h2>Rouge Soccer</h2>
        <p className="start-copy">
          Cinque partite secche, una squadra compatta e un mazzo tattico da
          costruire scelta dopo scelta.
        </p>
        <div className="start-stats" aria-label="Formato run">
          <Metric label="Partite" value="5" icon={<Flag size={18} />} />
          <Metric label="Allenatori" value={COACHES.length} icon={<Users size={18} />} />
          <Metric label="Carte iniziali" value="15" icon={<BookOpen size={18} />} />
        </div>
        <div className="start-actions">
          <button className="primary-button start-button" type="button" onClick={onContinue}>
            <Play aria-hidden="true" size={20} />
            Start
          </button>
          <button className="secondary-button" type="button" onClick={onOpenGuide}>
            <BookOpen aria-hidden="true" size={20} />
            Come si gioca
          </button>
        </div>
      </div>
    </section>
  );
}

function GameGuide({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="guide-dialog"
      aria-labelledby="guide-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="guide-sheet">
        <header className="guide-header">
          <div>
            <span className="guide-kicker">Lavagna tattica</span>
            <h2 id="guide-title">Come si gioca</h2>
            <p>Quattro idee per entrare subito in campo.</p>
          </div>
          <button
            autoFocus
            className="guide-close"
            type="button"
            onClick={onClose}
            aria-label="Chiudi Come si gioca"
          >
            <X aria-hidden="true" size={22} />
          </button>
        </header>

        <div className="guide-content">
          <div className="guide-grid">
            <article className="guide-step">
              <span className="guide-step-number">01</span>
              <Trophy aria-hidden="true" size={26} />
              <h3>Vinci la Run</h3>
              <p>
                Supera cinque Partite. Un pareggio o una sconfitta chiudono la
                Run.
              </p>
            </article>
            <article className="guide-step">
              <span className="guide-step-number">02</span>
              <Zap aria-hidden="true" size={26} />
              <h3>Leggi la Fase</h3>
              <p>
                Parti con 3 Energia, 5 carte e un&apos;Intenzione Avversaria sempre
                visibile.
              </p>
            </article>
            <article className="guide-step">
              <span className="guide-step-number">03</span>
              <Target aria-hidden="true" size={26} />
              <h3>Costruisci la risposta</h3>
              <p>
                Aumenta la Pericolosità per attaccare o la Copertura per
                difenderti.
              </p>
            </article>
            <article className="guide-step">
              <span className="guide-step-number">04</span>
              <Flag aria-hidden="true" size={26} />
              <h3>Chiudi la Fase</h3>
              <p>
                Puoi tentare una Conclusione; poi usa Termina Fase per risolvere
                il gioco avversario.
              </p>
            </article>
          </div>

          <section className="guide-example" aria-labelledby="guide-example-title">
            <div className="guide-example-heading">
              <span>Esempio</span>
              <h3 id="guide-example-title">Una tipica azione</h3>
              <p>È una buona sequenza, non un percorso obbligatorio.</p>
            </div>
            <div className="guide-sequence" aria-label="Sequenza di esempio">
              <span className="sequence-card costruzione">Costruzione</span>
              <ChevronRight aria-hidden="true" size={20} />
              <span className="sequence-card occasione">Occasione</span>
              <ChevronRight aria-hidden="true" size={20} />
              <span className="sequence-card conclusione">Conclusione</span>
              <ChevronRight aria-hidden="true" size={20} />
              <span className="sequence-card end">Termina Fase</span>
            </div>
          </section>
        </div>
      </div>
    </dialog>
  );
}

function CoachSelectionScreen({
  onStart,
}: {
  onStart: (coachId: CoachId) => void;
}) {
  return (
    <section className="coach-screen">
      <div className="coach-hero">
        <PitchVisual />
        <div className="start-panel">
          <h2>Scegli l&apos;Allenatore</h2>
          <p className="start-copy">
            Ogni Allenatore porta un Mazzo di Partenza da 15 carte e tre Carte
            Identitarie esclusive.
          </p>
        </div>
      </div>
      <div className="coach-grid">
        {COACHES.map((coach) => (
          <CoachChoiceCard
            key={coach.id}
            coach={coach}
            onStart={() => onStart(coach.id)}
          />
        ))}
      </div>
    </section>
  );
}

function CoachChoiceCard({
  coach,
  onStart,
}: {
  coach: CoachDefinition;
  onStart: () => void;
}) {
  const deckEntries = STARTER_DECKS[coach.id].entries;

  return (
    <article className={`coach-card coach-${coach.id}`}>
      <div className="coach-card-header">
        <span className="card-type">Allenatore</span>
        <h3>{coach.name}</h3>
      </div>
      <p>{coach.style}</p>
      <div className="identity-list">
        <h4>Carte Identitarie</h4>
        {coach.identityCardIds.map((cardId) => {
          const card = CARD_BY_ID[cardId];

          return (
            <span key={card.id}>
              <strong>{card.name}</strong>
              <small>{CARD_TYPE_LABEL[card.type]}</small>
            </span>
          );
        })}
      </div>
      <div className="deck-list">
        <h4>Composizione</h4>
        <div>
          {deckEntries.map((entry) => (
            <span key={entry.cardId}>
              <strong>{entry.copies}x</strong>
              {CARD_BY_ID[entry.cardId].name}
            </span>
          ))}
        </div>
      </div>
      <button className="primary-button" type="button" onClick={onStart}>
        <Play aria-hidden="true" size={20} />
        Seleziona
      </button>
    </article>
  );
}

function SquadScreen({
  run,
  onContinue,
}: {
  run: RunState;
  onContinue: () => void;
}) {
  const squad = getSquad(run);
  const coach = COACH_BY_ID[run.coachId];

  return (
    <section className="screen-stack">
      <div className="section-heading">
        <p className="eyebrow">{coach.name}</p>
        <h2>Squadra assegnata</h2>
        <p className="heading-note">{coach.style}</p>
      </div>
      <div className="squad-grid">
        {squad.map((calciatore) => (
          <CalciatoreCard key={calciatore.id} calciatore={calciatore} />
        ))}
      </div>
      <div className="action-row">
        <button className="primary-button" type="button" onClick={onContinue}>
          <Play aria-hidden="true" size={20} />
          Inizia Partita
        </button>
      </div>
    </section>
  );
}

function MatchScreen({
  run,
  onPlay,
  onShoot,
  onEndPhase,
}: {
  run: RunState;
  onPlay: (uid: string) => void;
  onShoot: (uid: string) => void;
  onEndPhase: () => void;
}) {
  const match = run.match;

  if (!match) {
    return null;
  }

  const opponent = getCurrentOpponent(run);
  const intention = getCurrentIntention(run);
  const opponentChance = getOpponentGoalChanceForState(run);
  const exposureBonus = getIntentionExposureBonus(intention);
  const effectiveDanger = getEffectiveDangerForState(run);
  const activeCombinations = COMBINATION_RULES.filter((rule) =>
    match.activeCombinationIds.includes(rule.id),
  );

  return (
    <section className="match-layout">
      <section className="match-main">
        <div className="score-strip">
          <Metric label="Partita" value={`${match.matchNumber}/5`} />
          <Metric label="Fase" value={`${match.phaseNumber}/10`} />
          <Metric icon={<Zap size={18} />} label="Energia" value={match.energy} />
        </div>

        <div className="tactical-board">
          <div className="board-score">
            <span>Tu</span>
            <strong>{match.playerScore}</strong>
            <i />
            <strong>{match.opponentScore}</strong>
            <span>Avversario</span>
          </div>
          <div className="board-lines" aria-hidden="true">
            <span className="dot dot-a" />
            <span className="dot dot-b" />
            <span className="dot dot-c" />
            <span className="dot dot-d" />
            <span className="dot dot-e" />
          </div>
        </div>

        <div className="phase-grid">
          <Metric
            icon={<Target size={18} />}
            label="Pericolosita"
            value={
              effectiveDanger === match.danger
                ? match.danger
                : `${effectiveDanger}/${match.danger}`
            }
          />
          <Metric icon={<Shield size={18} />} label="Copertura" value={match.coverage} />
          {match.imbalance > 0 && (
            <Metric label="Sbilanciamento" value={`-${match.imbalance}`} />
          )}
          <Metric
            label="Mazzo"
            value={`${match.drawPile.length}/${run.ownedDeck.length}`}
          />
          <Metric label="Scarti" value={match.discardPile.length} />
        </div>

        {activeCombinations.length > 0 && (
          <div className="combo-rail">
            {activeCombinations.map((rule) => (
              <span key={rule.id}>{rule.name}</span>
            ))}
          </div>
        )}

        {match.activeTacticalEffects.length > 0 && (
          <div className="active-effect-rail">
            {match.activeTacticalEffects.map((effect) => (
              <span key={effect.id}>{effect.label}</span>
            ))}
          </div>
        )}

        <section className="hand-zone" aria-label="Mano">
          {match.hand.map((instance) => (
            <HandCard
              key={instance.uid}
              instance={instance}
              run={run}
              onPlay={onPlay}
              onShoot={onShoot}
            />
          ))}
        </section>
      </section>

      <aside className="side-stack">
        <CoachRunPanel run={run} />

        <section className="info-panel">
          <div className="panel-title">
            <Flag aria-hidden="true" size={18} />
            <h2>Intenzione Avversaria</h2>
          </div>
          <p className="opponent-name">{opponent.name}</p>
          <div className={`intention ${intention.type}`}>
            <strong>{intention.name}</strong>
            <span>{intention.description}</span>
          </div>
          {intention.type === "offense" && exposureBonus > 0 && (
            <div className="risk-row exposure">
              <span>Esposizione Avversaria</span>
              <strong>+{exposureBonus}%</strong>
            </div>
          )}
          {opponentChance ? (
            <div className="chance-block">
              <span>Gol avversario</span>
              <strong>{opponentChance.percent}%</strong>
              <small>
                Minaccia {opponentChance.threat}, residua{" "}
                {opponentChance.residualThreat}
              </small>
              {opponentChance.imbalance > 0 && (
                <small>Sbilanciamento -{opponentChance.imbalance} Copertura</small>
              )}
              {opponentChance.effectiveCoverage !== opponentChance.coverage && (
                <small>
                  Copertura effettiva {opponentChance.effectiveCoverage}/
                  {opponentChance.coverage}
                </small>
              )}
              {opponentChance.coverageBonus > 0 && (
                <small>
                  Squadra +{opponentChance.coverageBonus} Copertura
                </small>
              )}
              {opponentChance.tacticalCoverageBonus !== 0 && (
                <small>
                  Effetti Tattici{" "}
                  {formatSigned(opponentChance.tacticalCoverageBonus)} Copertura
                </small>
              )}
              {opponentChance.passivePenalty !== 0 && (
                <small>
                  Squadra {formatSigned(opponentChance.passivePenalty, "%")} gol
                  avversario
                </small>
              )}
            </div>
          ) : (
            <div className="chance-block muted">
              <span>Penalita attiva</span>
              <strong>{intention.description}</strong>
            </div>
          )}
          <button className="end-button" type="button" onClick={onEndPhase}>
            <Flag aria-hidden="true" size={18} />
            Termina Fase
          </button>
        </section>

        <section className="info-panel">
          <div className="panel-title">
            <Target aria-hidden="true" size={18} />
            <h2>Calcolo Conclusione</h2>
          </div>
          <ShotForecast run={run} />
        </section>

        <SynergyReference />

        <section className="info-panel">
          <div className="panel-title">
            <Users aria-hidden="true" size={18} />
            <h2>Squadra</h2>
          </div>
          <div className="mini-squad">
            {getSquad(run).map((calciatore) => (
              <span
                key={calciatore.id}
                className={`mini-player tier-${calciatore.category}`}
              >
                <strong>{calciatore.name}</strong>
                <small>
                  {CALCIATORE_CATEGORY_LABEL[calciatore.category]} |{" "}
                  {calciatore.bonusText}
                </small>
              </span>
            ))}
          </div>
        </section>

        <section className="info-panel">
          <h2>Registro</h2>
          <ol className="log-list">
            {run.log.map((entry, index) => (
              <li key={`${entry}-${index}`}>{entry}</li>
            ))}
          </ol>
        </section>
      </aside>
    </section>
  );
}

function CoachRunPanel({ run }: { run: RunState }) {
  const coach = COACH_BY_ID[run.coachId];

  return (
    <section className="info-panel coach-run-panel">
      <div className="panel-title">
        <ClipboardList aria-hidden="true" size={18} />
        <h2>Allenatore</h2>
      </div>
      <p className="opponent-name">{coach.name}</p>
      <p className="panel-note">{coach.style}</p>
      <div className="coach-panel-identities">
        {coach.identityCardIds.map((cardId) => {
          const card = CARD_BY_ID[cardId];

          return <span key={card.id}>{card.name}</span>;
        })}
      </div>
    </section>
  );
}

function HandCard({
  instance,
  run,
  onPlay,
  onShoot,
}: {
  instance: CardInstance;
  run: RunState;
  onPlay: (uid: string) => void;
  onShoot: (uid: string) => void;
}) {
  const card = getCard(instance);
  const match = run.match;
  const isConclusion = card.type === "conclusione";
  const chance = isConclusion ? getGoalChanceForCard(run, instance) : null;
  const disabledReason = getCardDisabledReason(match);
  const disabled = Boolean(disabledReason);
  const impact = getCardImpact(card, run);
  const visibleBoosts = getVisibleBoosts(card, run);
  const previewCombination =
    match && !isConclusion
      ? getNewPhaseCombinationBonus(
          [...match.playedCards.map(getCard), card],
          match.activeCombinationIds,
        )
      : null;
  const previewCombinationRules = COMBINATION_RULES.filter((rule) =>
    previewCombination?.ids.includes(rule.id),
  );

  return (
    <button
      className={`play-card type-${card.type} ${
        card.identityCoachId ? "identity-card" : ""
      }`}
      type="button"
      disabled={disabled}
      onClick={() => (isConclusion ? onShoot(instance.uid) : onPlay(instance.uid))}
    >
      <span className="card-top-row">
        <span className="card-type">{CARD_TYPE_LABEL[card.type]}</span>
        <span className="card-cost">Costo {card.cost}</span>
      </span>
      <h3>{card.name}</h3>
      <CardIllustration card={card} />
      <div className="card-rules">
        <p className="card-description">{card.description}</p>
        <TacticalEffectList card={card} run={run} />
        {!isConclusion && <CardImpact impact={impact} />}
        {previewCombinationRules.length > 0 && (
          <div className="combo-preview">
            {previewCombinationRules.map((rule) => (
              <span key={rule.id}>{rule.name}</span>
            ))}
          </div>
        )}
        {visibleBoosts.length > 0 && <BoostList boosts={visibleBoosts} />}
        {chance && (
          <span className="goal-chip">
            <Target aria-hidden="true" size={16} />
            {chance.percent}%
          </span>
        )}
        {chance && <ChanceBreakdown chance={chance} />}
        {disabledReason && (
          <span className="disabled-reason">{disabledReason}</span>
        )}
      </div>
      <TagList card={card} />
    </button>
  );
}

function ShotForecast({ run }: { run: RunState }) {
  const match = run.match;

  if (!match) {
    return null;
  }

  const shots = match.hand
    .map((instance) => ({
      instance,
      card: getCard(instance),
    }))
    .filter(({ card }) => card.type === "conclusione")
    .map((shot) => ({
      ...shot,
      chance: getGoalChanceForCard(run, shot.instance),
    }))
    .sort((a, b) => b.chance.percent - a.chance.percent);

  const lastShot = match.lastShot;

  if (shots.length === 0) {
    return (
      <div className="shot-forecast">
        <p className="panel-note">Nessuna Conclusione in mano</p>
        {lastShot && <LastShotResult run={run} />}
      </div>
    );
  }

  const bestShot = shots[0];

  return (
    <div className="shot-forecast">
      <div className="shot-summary">
        <span>{bestShot.card.name}</span>
        <strong>{bestShot.chance.percent}%</strong>
      </div>
      <ChanceBreakdown chance={bestShot.chance} compact />
      {lastShot && <LastShotResult run={run} />}
    </div>
  );
}

function LastShotResult({ run }: { run: RunState }) {
  const shot = run.match?.lastShot;

  if (!shot) {
    return null;
  }

  return (
    <div className={`last-shot ${shot.goal ? "goal" : "miss"}`}>
      <span>{CARD_BY_ID[shot.cardId].name}</span>
      <strong>{shot.goal ? "Gol" : "Fuori"}</strong>
      <small>
        Roll {shot.roll}/{shot.chance}
      </small>
    </div>
  );
}

function CardImpact({ impact }: { impact: CardImpactSummary }) {
  const rows = [
    {
      label: "Pericolosita",
      total: impact.dangerTotal,
      base: impact.dangerBase,
      squad: impact.dangerSquad,
      tactical: impact.dangerTactical,
      icon: <Target aria-hidden="true" size={14} />,
    },
    {
      label: "Copertura",
      total: impact.coverageTotal,
      base: impact.coverageBase,
      squad: impact.coverageSquad,
      tactical: impact.coverageTactical,
      icon: <Shield aria-hidden="true" size={14} />,
    },
  ].filter((row) => row.total !== 0);

  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="impact-row">
      {rows.map((row) => (
        <span
          key={row.label}
          className={`${row.squad !== 0 || row.tactical !== 0 ? "boosted" : ""} ${
            row.total < 0 ? "negative" : ""
          }`}
        >
          {row.icon}
          <strong>
            {formatSigned(row.total)} {row.label}
          </strong>
          {(row.squad !== 0 || row.tactical !== 0) && (
            <small>
              {[
                row.squad !== 0
                  ? `${formatSigned(row.squad)} squadra`
                  : "",
                row.tactical !== 0
                  ? `${formatSigned(row.tactical)} effetti`
                  : "",
              ]
                .filter(Boolean)
                .join(", ")}
            </small>
          )}
        </span>
      ))}
    </div>
  );
}

function ChanceBreakdown({
  chance,
  compact = false,
}: {
  chance: GoalChanceBreakdown;
  compact?: boolean;
}) {
  const rows = [
    { label: "Base", value: chance.base, base: true },
    {
      label: `Pericolosita ${chance.effectiveDanger}`,
      value: chance.dangerBonus,
    },
    { label: "Bonus di Sequenza", value: chance.sequenceBonus },
    { label: "Combinazioni", value: chance.combinationBonus },
    { label: "Effetti Tattici", value: chance.tacticalEffectBonus },
    { label: "Squadra", value: chance.passiveBonus },
    { label: "Esposizione", value: chance.exposureBonus },
    { label: "Difesa rivale", value: -chance.opponentDefensePenalty },
    { label: "Intenzione", value: -chance.intentionPenalty },
  ].filter((row) => row.base || row.value !== 0);

  return (
    <dl className={`chance-breakdown ${compact ? "compact" : ""}`}>
      {rows.map((row) => (
        <div
          key={row.label}
          className={row.value < 0 ? "negative" : row.value > 0 ? "positive" : ""}
        >
          <dt>{row.label}</dt>
          <dd>{formatChanceValue(row.value, row.base)}</dd>
        </div>
      ))}
    </dl>
  );
}

function getCardDisabledReason(match: RunState["match"]): string | null {
  if (!match) {
    return "Carta non disponibile";
  }

  if (match.shotTaken) {
    return "Azione conclusa";
  }

  if (match.energy <= 0) {
    return "Energia esaurita";
  }

  return null;
}

function BoostList({ boosts }: { boosts: VisibleBoost[] }) {
  return (
    <div className="boost-row">
      {boosts.map((boost) => (
        <span key={boost.id} className={`boost ${boost.tone}`}>
          {boost.text}
        </span>
      ))}
    </div>
  );
}

function TacticalEffectList({
  card,
  run,
}: {
  card: CardDefinition;
  run: RunState;
}) {
  if (!card.tacticalEffects || card.tacticalEffects.length === 0) {
    return null;
  }

  const match = run.match;
  const playedCards = match ? match.playedCards.map(getCard) : [];
  const currentIntention = match ? getCurrentIntention(run) : null;

  return (
    <div className="effect-row">
      {card.tacticalEffects.map((effect, index) => {
        const active = currentIntention
          ? isTacticalEffectActive(effect, {
              playedCards,
              currentIntention,
            })
          : false;

        return (
          <span
            key={`${effect.kind}-${index}`}
            className={`effect-chip ${active ? "active" : ""}`}
          >
            {describeTacticalEffect(effect)}
          </span>
        );
      })}
    </div>
  );
}

function SynergyReference() {
  return (
    <section className="info-panel">
      <div className="panel-title">
        <Zap aria-hidden="true" size={18} />
        <h2>Azioni disponibili</h2>
      </div>
      <div className="synergy-reference">
        <div className="synergy-group">
          <h3>Bonus di Sequenza</h3>
          <ul>
            <li>
              <strong>Costruzione &gt; Occasione</strong>
              <small>+{BUILD_OCCASION_SEQUENCE_BONUS}% Conclusione</small>
            </li>
          </ul>
        </div>
        <div className="synergy-group">
          <h3>Combinazioni</h3>
          <ul>
            {COMBINATION_RULES.map((rule) => (
              <li key={rule.id}>
                <strong>{rule.name}</strong>
                <small>{rule.description}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function RewardScreen({
  run,
  onChoose,
  onSkip,
}: {
  run: RunState;
  onChoose: (cardId: string) => void;
  onSkip: () => void;
}) {
  const options = run.rewardOptions ?? [];
  const match = run.match;

  return (
    <section className="screen-stack">
      <div className="section-heading">
        <p className="eyebrow">
          Vittoria {match ? `${match.playerScore}-${match.opponentScore}` : ""}
        </p>
        <h2>Ricompensa</h2>
      </div>
      <div className="reward-grid">
        {options.map((cardId) => (
          <RewardCard
            key={cardId}
            card={CARD_BY_ID[cardId]}
            run={run}
            onChoose={() => onChoose(cardId)}
          />
        ))}
      </div>
      <div className="action-row">
        <button className="secondary-button" type="button" onClick={onSkip}>
          <SkipForward aria-hidden="true" size={18} />
          Salta
        </button>
      </div>
    </section>
  );
}

function RewardCard({
  card,
  run,
  onChoose,
}: {
  card: CardDefinition;
  run: RunState;
  onChoose: () => void;
}) {
  const impact = getCardImpact(card, run);
  const boosts = getVisibleBoosts(card, run);

  return (
    <button
      className={`reward-card type-${card.type} ${
        card.identityCoachId ? "identity-card" : ""
      }`}
      type="button"
      onClick={onChoose}
    >
      <span className="card-top-row">
        <span className="card-type">{CARD_TYPE_LABEL[card.type]}</span>
        <span className="card-cost">
          <PlusCircle aria-hidden="true" size={15} />
          Costo {card.cost}
        </span>
      </span>
      <h3>{card.name}</h3>
      <CardIllustration card={card} />
      <div className="card-rules">
        <p className="card-description">{card.description}</p>
        <TacticalEffectList card={card} run={run} />
        {card.type !== "conclusione" && <CardImpact impact={impact} />}
        {boosts.length > 0 && <BoostList boosts={boosts} />}
      </div>
      <TagList card={card} />
    </button>
  );
}

function OutcomeScreen({
  run,
  onRestart,
}: {
  run: RunState;
  onRestart: () => void;
}) {
  const isVictory = run.status === "victory";

  return (
    <section className={`outcome ${isVictory ? "victory" : "game-over"}`}>
      <Trophy aria-hidden="true" size={34} />
      <h2>{isVictory ? "Vittoria" : "Game Over"}</h2>
      <p>{run.finalMessage}</p>
      <p className="seed-line">Seed {run.seed}</p>
      <button className="primary-button" type="button" onClick={onRestart}>
        <RotateCcw aria-hidden="true" size={20} />
        Nuova Run
      </button>
    </section>
  );
}

function CalciatoreCard({ calciatore }: { calciatore: Calciatore }) {
  return (
    <article className={`calciatore-card tier-${calciatore.category}`}>
      <div className="calciatore-meta">
        <span>{CALCIATORE_CATEGORY_LABEL[calciatore.category]}</span>
        <small>{calciatore.role}</small>
      </div>
      <h3>{calciatore.name}</h3>
      <p>{calciatore.bonusText}</p>
    </article>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
}) {
  return (
    <div className="metric">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function getCardImpact(
  card: CardDefinition,
  run: RunState,
): CardImpactSummary {
  const match = run.match;
  const tacticalImpact = match
    ? getCardTacticalImpact(card, {
        playedCards: match.playedCards.map(getCard),
        currentIntention: getCurrentIntention(run),
      })
    : { danger: 0, coverage: 0 };
  const dangerBase = card.danger ?? 0;
  const dangerSquad = getCardDangerBonus(card, run.squad);
  const dangerTactical = tacticalImpact.danger;
  const coverageBase = card.coverage ?? 0;
  const coverageSquad = getCardCoverageBonus(card, run.squad);
  const coverageTactical = tacticalImpact.coverage;

  return {
    dangerBase,
    dangerSquad,
    dangerTactical,
    dangerTotal: dangerBase + dangerSquad + dangerTactical,
    coverageBase,
    coverageSquad,
    coverageTactical,
    coverageTotal: coverageBase + coverageSquad + coverageTactical,
  };
}

function getVisibleBoosts(card: CardDefinition, run: RunState): VisibleBoost[] {
  const match = run.match;

  return getSquad(run).flatMap((calciatore) => {
    return getCalciatorePassives(calciatore).flatMap((passive) => {
      switch (passive.kind) {
        case "card_type_danger":
          return card.type !== "conclusione" && passive.cardType === card.type
            ? [
                buildBoost(
                  calciatore,
                  `${formatSigned(passive.value)} Pericolosita`,
                  "attack",
                ),
              ]
            : [];
        case "tag_danger":
          return card.type !== "conclusione" &&
            card.tags.some((tag) => passive.tags.includes(tag))
            ? [
                buildBoost(
                  calciatore,
                  `${formatSigned(passive.value)} Pericolosita`,
                  "attack",
                ),
              ]
            : [];
        case "card_type_coverage":
          return card.type !== "conclusione" && passive.cardType === card.type
            ? [
                buildBoost(
                  calciatore,
                  `${formatSigned(passive.value)} Copertura`,
                  "defense",
                ),
              ]
            : [];
        case "conclusion_chance":
          return card.type === "conclusione"
            ? [
                buildBoost(
                  calciatore,
                  `${formatSigned(passive.value, "%")} Conclusione`,
                  "chance",
                ),
              ]
            : [];
        case "behind_conclusion_chance":
          return card.type === "conclusione" &&
            match &&
            match.playerScore < match.opponentScore
            ? [
                buildBoost(
                  calciatore,
                  `${formatSigned(passive.value, "%")} in svantaggio`,
                  "chance",
                ),
              ]
            : [];
        case "tag_conclusion_chance":
          return card.type === "conclusione" && card.tags.includes(passive.tag)
            ? [
                buildBoost(
                  calciatore,
                  `${formatSigned(passive.value, "%")} ${passive.tag}`,
                  "chance",
                ),
              ]
            : [];
        case "prior_card_type_conclusion_chance":
          return card.type === "conclusione" &&
            match &&
            match.playedCards
              .map(getCard)
              .filter((playedCard) => playedCard.type === passive.cardType)
              .length >= passive.minCount
            ? [
                buildBoost(
                  calciatore,
                  `${formatSigned(passive.value, "%")} dopo ${
                    CARD_TYPE_LABEL[passive.cardType]
                  }`,
                  "chance",
                ),
              ]
            : [];
        case "high_threat_coverage":
        case "opponent_goal_chance":
          return [];
      }
    });
  });
}

function buildBoost(
  calciatore: Calciatore,
  text: string,
  tone: VisibleBoost["tone"],
): VisibleBoost {
  return {
    id: `${calciatore.id}-${text}`,
    text: `${calciatore.name}: ${text}`,
    tone,
  };
}

function formatSigned(value: number, suffix = ""): string {
  return `${value > 0 ? "+" : ""}${value}${suffix}`;
}

function formatChanceValue(value: number, isBase?: boolean): string {
  if (isBase) {
    return `${value}%`;
  }

  return formatSigned(value, "%");
}

function TagList({ card }: { card: CardDefinition }) {
  if (card.tags.length === 0) {
    return null;
  }

  return (
    <span className="tag-row">
      {card.tags.map((tag) => (
        <i key={tag}>{tag}</i>
      ))}
    </span>
  );
}

function PitchVisual({
  formation = "scattered",
}: {
  formation?: "4-3-3" | "scattered";
}) {
  const players =
    formation === "4-3-3"
      ? [
          "goalkeeper",
          "defender-1",
          "defender-2",
          "defender-3",
          "defender-4",
          "midfielder-1",
          "midfielder-2",
          "midfielder-3",
          "forward-1",
          "forward-2",
          "forward-3",
        ]
      : ["p1", "p2", "p3", "p4", "p5"];

  return (
    <div
      className={`pitch-visual ${formation === "4-3-3" ? "formation-433" : ""}`}
      aria-hidden="true"
    >
      <span className="pitch-line halfway" />
      <span className="pitch-box left" />
      <span className="pitch-box right" />
      <span className="pitch-circle" />
      {players.map((player) => (
        <span key={player} className={`player-dot ${player}`} />
      ))}
    </div>
  );
}
