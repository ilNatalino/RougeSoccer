## ADDED Requirements

### Requirement: Run lifecycle

The system SHALL allow the player to complete a single-player run made of five matches: four normal matches followed by one boss match.

#### Scenario: Starting a new run
- **WHEN** the player starts a new run
- **THEN** the system creates an in-memory run with match index 1, the starter deck, an automatic RNG seed, and five assigned Calciatori

#### Scenario: Winning the boss match
- **WHEN** the player wins the fifth match
- **THEN** the system shows the run victory state

#### Scenario: Losing or drawing a match
- **WHEN** a match ends with the player score less than or equal to the opponent score
- **THEN** the system ends the run and shows the game-over state

### Requirement: Initial squad

The system SHALL assign exactly five Calciatori from a static pool of ten at the start of each run.

#### Scenario: Showing assigned Calciatori
- **WHEN** the run starts
- **THEN** the system shows the five assigned Calciatori and their Bonus Passivi before the first match

#### Scenario: Applying passive bonuses
- **WHEN** a card or scoring calculation matches one or more assigned Calciatori bonuses
- **THEN** the system applies all matching Bonus Passivi cumulatively within the relevant calculation

### Requirement: Tactical match structure

The system SHALL run each match as ten tactical Fasi with 3 Energia Tattica per Fase, a hand size of five cards, and an initial score of 0-0.

#### Scenario: Starting a match
- **WHEN** a match starts
- **THEN** the system initializes phase 1, score 0-0, 3 Energia Tattica, an empty Pericolosità, an empty Copertura, and a visible Intenzione Avversaria

#### Scenario: Ending the tenth Fase
- **WHEN** the tenth Fase is resolved
- **THEN** the system determines match victory, game over, reward, or run victory based on score and match index

### Requirement: Phase flow

The system SHALL make every Fase revolve around one visible Intenzione Avversaria, card play, optional Conclusione, optional defensive play after Conclusione, and explicit Termina Fase resolution.

#### Scenario: Offensive Intenzione resolution
- **WHEN** the player uses Termina Fase while the current Intenzione Avversaria is offensive
- **THEN** the system resolves the opponent scoring chance using Minaccia reduced by current Copertura

#### Scenario: Defensive Intenzione effect
- **WHEN** a Fase begins with a defensive Intenzione Avversaria
- **THEN** the system applies that defensive penalty to the player's current Fase calculations

#### Scenario: Explicit phase ending
- **WHEN** the player has remaining Energia Tattica or playable cards
- **THEN** the system MUST NOT end the Fase automatically

### Requirement: Card deck and hand handling

The system SHALL implement a starter deck of fifteen cards, a five-card hand, discard handling at the end of each Fase, and discard reshuffling when the deck is exhausted.

#### Scenario: Drawing a hand
- **WHEN** a Fase starts
- **THEN** the player draws until they have five cards or until the deck and discard are both empty

#### Scenario: Ending a Fase
- **WHEN** a Fase ends
- **THEN** all cards in hand and all played cards move to discard, and Pericolosità, Copertura, and Combinazioni reset

#### Scenario: Reshuffling discards
- **WHEN** the deck is empty and the player must draw more cards
- **THEN** the system shuffles the discard pile into a new deck and continues drawing

### Requirement: Card play

The system SHALL allow the player to play cards by spending 1 Energia Tattica per card, with immediate effects and no undo.

#### Scenario: Playing a card
- **WHEN** the player plays a card with at least 1 Energia Tattica available
- **THEN** the system spends 1 Energia Tattica and immediately applies the card effect

#### Scenario: No undo
- **WHEN** the player has played a card
- **THEN** the system does not provide an undo action for that card play

#### Scenario: Insufficient energy
- **WHEN** the player has 0 Energia Tattica
- **THEN** the system prevents additional card play until the next Fase

### Requirement: Conclusions and scoring

The system SHALL allow at most one optional Conclusione per Fase and calculate goal probability from the selected Conclusione card, Pericolosità, Combinazioni, Bonus Passivi, opponent Difesa, and defensive penalties.

#### Scenario: Live conclusion probability
- **WHEN** the player changes Pericolosità, Combinazioni, Bonus Passivi, or defensive penalties before shooting
- **THEN** the system updates the probability displayed on available Conclusione cards

#### Scenario: Attempting a Conclusione
- **WHEN** the player uses a Conclusione card
- **THEN** the system resolves a goal or failed shot using a clamped probability between 10% and 85%

#### Scenario: Playing after Conclusione
- **WHEN** the player has already attempted a Conclusione in the current Fase
- **THEN** the system allows further non-Conclusione card play with remaining Energia Tattica but prevents a second Conclusione

### Requirement: Opponent intentions

The system SHALL give each opponent an eight-card Mazzo Intenzioni and draw one visible Intenzione Avversaria for each Fase.

#### Scenario: Drawing an opponent intention
- **WHEN** a new Fase begins
- **THEN** the system draws one Intenzione Avversaria from the current opponent's Mazzo Intenzioni and shows its type and effect

#### Scenario: Opponent intention reshuffle
- **WHEN** the opponent's Mazzo Intenzioni is empty and another intention is needed
- **THEN** the system shuffles discarded intentions into a new Mazzo Intenzioni and draws from it

#### Scenario: Live opponent goal probability
- **WHEN** the current Intenzione Avversaria is offensive and Copertura changes
- **THEN** the system updates the visible opponent goal probability

### Requirement: Rewards and progression

The system SHALL offer three distinct card rewards after each non-boss match victory and allow the player to skip the reward.

#### Scenario: Winning a normal match
- **WHEN** the player wins one of the first four matches
- **THEN** the system shows three distinct reward cards and a skip option

#### Scenario: Choosing a reward
- **WHEN** the player chooses one reward card
- **THEN** the system adds that card to the player's deck and advances to the next match

#### Scenario: Skipping a reward
- **WHEN** the player skips the reward
- **THEN** the system leaves the deck unchanged and advances to the next match

### Requirement: Required game content

The system SHALL include the MVP Basic static content defined by the design document: starter cards, reward cards, ten Calciatori, five opponents, and initial intention decks.

#### Scenario: Starter content is available
- **WHEN** a run is created
- **THEN** the system can build the starter deck, Calciatori pool, opponent sequence, and intention decks from static frontend data

#### Scenario: Reward pool is available
- **WHEN** reward options are generated
- **THEN** the system chooses from the static reward pool while showing three distinct options

### Requirement: Frontend-only implementation

The system SHALL run the MVP entirely in the browser without backend APIs, database, server actions, or persistent run storage.

#### Scenario: Playing without backend calls
- **WHEN** the player starts and completes a run
- **THEN** all gameplay state transitions happen client-side without requiring network requests to application APIs

#### Scenario: Reloading the page
- **WHEN** the player reloads the page during a run
- **THEN** the system does not restore the previous run state
