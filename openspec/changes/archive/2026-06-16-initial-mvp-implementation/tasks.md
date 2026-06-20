## 1. Project Setup

- [x] 1.1 Add Next.js, React, TypeScript, lint/build scripts, and baseline project configuration.
- [x] 1.2 Create the App Router structure with a single client-side playable page and global styles.
- [x] 1.3 Add the `src/game` module structure for `types`, `data`, `rng`, `rules`, and `engine`.

## 2. Static Game Data

- [x] 2.1 Define typed card data for the 15-card starter deck and 12-card reward pool.
- [x] 2.2 Define the six Tag Tattici and four Combinazione rules.
- [x] 2.3 Define the pool of 10 Calciatori with one Bonus Passivo each.
- [x] 2.4 Define the five fixed opponents with Attacco, Difesa, and eight-card Mazzi Intenzioni.

## 3. Core Rules

- [x] 3.1 Implement seeded RNG helpers for automatic run seed generation, shuffling, drawing, and probability rolls.
- [x] 3.2 Implement goal probability calculation with Pericolosità, Combinazioni, Bonus Passivi, opponent Difesa, defensive penalties, and 10%-85% clamp.
- [x] 3.3 Implement opponent Minaccia, Minaccia residua, opponent goal probability, defensive passives, and 10%-85% clamp.
- [x] 3.4 Implement Combinazione detection with each Combinazione applying at most once per Fase.

## 4. Game Engine

- [x] 4.1 Implement `startRun` to create in-memory run state, starter deck, seed, five random Calciatori, and first match.
- [x] 4.2 Implement match initialization with 10 Fasi, score 0-0, current opponent, player deck, opponent intention deck, and first visible Intenzione Avversaria.
- [x] 4.3 Implement Fase start and draw handling, including five-card hand, discard pile, and reshuffle behavior.
- [x] 4.4 Implement `playCard` with 1 Energia Tattica cost, immediate effects, no undo, and prevention at 0 energy.
- [x] 4.5 Implement optional `shoot` with one Conclusione per Fase, goal/fail resolution, score updates, and post-shot non-Conclusione card play.
- [x] 4.6 Implement `endPhase` to resolve offensive opponent intentions, discard hand and played cards, reset phase-local values, and advance or end the match.
- [x] 4.7 Implement match completion, game-over on loss or draw, reward screen after normal wins, and victory after boss win.
- [x] 4.8 Implement `chooseReward` and `skipReward` to advance to the next match with or without adding a reward card.

## 5. User Interface

- [x] 5.1 Build the New Run and Squad reveal screens with the assigned Calciatori and Bonus Passivi.
- [x] 5.2 Build the Match screen showing score, Fase, Energia Tattica, Intenzione Avversaria, opponent goal probability, hand, Pericolosità, Copertura, and Termina Fase.
- [x] 5.3 Render playable cards with type, tags, effect, and live goal probability on available Conclusione cards.
- [x] 5.4 Build the Reward screen with three distinct card options and a skip action.
- [x] 5.5 Build Victory and Game Over screens showing final run outcome and seed.
- [x] 5.6 Apply responsive styling for desktop and mobile without requiring animations, pitch rendering, or drag-and-drop.

## 6. Verification

- [x] 6.1 Add focused tests or deterministic checks for scoring formulas, RNG/shuffle behavior, reward uniqueness, and match terminal states.
- [x] 6.2 Run type checking and production build successfully.
- [x] 6.3 Run the local Next.js dev server and manually verify a complete run path through victory or game over.
