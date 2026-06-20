## Purpose

Define the browser-only football roguelike MVP, including run structure, tactical phase rules, scoring, opponent intentions, and coach-selected starter deck variety.

## Requirements

### Requirement: Run lifecycle

The system SHALL allow the player to complete a single-player run made of five matches: four normal matches followed by one boss match, starting from the selected Allenatore's Mazzo di Partenza.

#### Scenario: Starting a new run
- **WHEN** the player chooses an Allenatore
- **THEN** the system creates an in-memory run with match index 1, the selected Allenatore's Mazzo di Partenza, an automatic RNG seed, one assigned Icona, and two assigned Calciatori Comuni

#### Scenario: Winning the boss match
- **WHEN** the player wins the fifth match
- **THEN** the system shows the run victory state

#### Scenario: Losing or drawing a match
- **WHEN** a match ends with the player score less than or equal to the opponent score
- **THEN** the system ends the run and shows the game-over state

### Requirement: Initial squad

The system SHALL assign exactly one Icona from a static pool of six and exactly two Calciatori Comuni from a static pool of ten at the start of each run.

#### Scenario: Showing assigned Calciatori
- **WHEN** the run starts
- **THEN** the system shows the assigned Icona, the two assigned Calciatori Comuni, and their Bonus Passivi before the first match

#### Scenario: Icone pool
- **WHEN** the system loads squad member data
- **THEN** it includes these six Icone:
  - Il Diez
  - Fenomeno
  - Il Maestro Totale
  - La Freccia d'Oro
  - Il Muro Azzurro
  - Il Capitano Eterno
- **AND** each Icona has a more impactful Bonus Passivo than a Calciatore Comune while remaining passive

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

### Requirement: Allenatore selection

The system SHALL require the player to choose one Allenatore before the first Partita, and the chosen Allenatore SHALL select the player's Mazzo di Partenza.

#### Scenario: Showing coach choices
- **WHEN** the player starts a new run from the initial screen
- **THEN** the system shows exactly three Allenatore choices:
  - Maestro del Possesso
  - Specialista del Blocco Basso
  - Allenatore d'Assalto
- **AND** each choice shows its Stile di Gioco and Carte Identitarie

#### Scenario: Starting from selected coach
- **WHEN** the player chooses an Allenatore
- **THEN** the system creates the run with that Allenatore's Mazzo di Partenza
- **AND** the system assigns one Icona and two Calciatori Comuni independently from the Allenatore choice
- **AND** the system advances to the existing pre-match run flow

#### Scenario: Coach has no passive power
- **WHEN** a card, Conclusione, opponent chance, reward, or Bonus Passivo is calculated
- **THEN** the system does not apply any hidden modifier from the selected Allenatore
- **AND** only the cards in the selected Mazzo di Partenza differentiate the Allenatore during gameplay

### Requirement: Coach starter decks

The system SHALL provide exactly three Mazzi di Partenza, each containing 15 cards made of 6 Carte Identitarie and 9 shared cards.

#### Scenario: Maestro del Possesso starter deck
- **WHEN** the system builds the Maestro del Possesso Mazzo di Partenza
- **THEN** the deck contains:
  - 2x Giro palla paziente
  - 2x Terzo uomo
  - 2x Imbucata centrale
  - 2x Passaggio corto
  - 2x Cambio gioco
  - 1x Verticalizzazione
  - 1x Inserimento
  - 1x Pressing
  - 1x Ripiegamento
  - 1x Tiro

#### Scenario: Specialista del Blocco Basso starter deck
- **WHEN** the system builds the Specialista del Blocco Basso Mazzo di Partenza
- **THEN** the deck contains:
  - 2x Linea compatta
  - 2x Lancio lungo
  - 2x Punizione studiata
  - 2x Pressing
  - 2x Ripiegamento
  - 1x Marcatura
  - 1x Calcio piazzato
  - 1x Tiro piazzato
  - 1x Passaggio corto
  - 1x Tiro

#### Scenario: Allenatore d'Assalto starter deck
- **WHEN** the system builds the Allenatore d'Assalto Mazzo di Partenza
- **THEN** the deck contains:
  - 2x Sovrapposizione continua
  - 2x Attacco in area
  - 2x Tiro di prima
  - 2x Inserimento
  - 1x Cross
  - 1x Azione sulla fascia
  - 1x Cambio gioco
  - 1x Passaggio corto
  - 2x Tiro
  - 1x Pressing

### Requirement: Carte Identitarie

The system SHALL include nine Carte Identitarie, each exclusive to one Mazzo di Partenza and absent from the normal reward pool.

#### Scenario: Maestro del Possesso identity cards
- **WHEN** the system loads identity card data
- **THEN** Maestro del Possesso has these Carte Identitarie:
  - Giro palla paziente: Costruzione, cost 1, tags `Centrale` and `Ampiezza`, +1 Pericolosità
  - Terzo uomo: Occasione, cost 1, tag `Spazio`, +2 Pericolosità, plus +1 Pericolosità if at least one Costruzione was played earlier in the current Fase
  - Imbucata centrale: Conclusione, cost 1, 25% base goal chance, plus +10% goal chance if at least two Costruzione cards were played earlier in the current Fase

#### Scenario: Specialista del Blocco Basso identity cards
- **WHEN** the system loads identity card data
- **THEN** Specialista del Blocco Basso has these Carte Identitarie:
  - Linea compatta: Difesa, cost 1, +4 Copertura, plus +1 Copertura if the current Intenzione Avversaria is offensive
  - Lancio lungo: Supporto, cost 1, +10% to the next Conclusione if the current Intenzione Avversaria is offensive
  - Punizione studiata: Conclusione, cost 1, tag `Piazzato`, 30% base goal chance

#### Scenario: Allenatore d'Assalto identity cards
- **WHEN** the system loads identity card data
- **THEN** Allenatore d'Assalto has these Carte Identitarie:
  - Sovrapposizione continua: Costruzione, cost 1, tag `Ampiezza`, +3 Pericolosità and -1 Copertura
  - Attacco in area: Occasione, cost 1, tag `Spazio`, +3 Pericolosità
  - Tiro di prima: Conclusione, cost 1, 35% base goal chance

#### Scenario: Identity cards excluded from rewards
- **WHEN** reward options are generated after a Partita victory
- **THEN** the system does not include Carte Identitarie in the reward options
- **AND** this applies even to the selected Allenatore's own Carte Identitarie

### Requirement: Phase flow

The system SHALL make every Fase revolve around one visible Intenzione Avversaria, card play, at most one optional Conclusione, post-Conclusione card lockout, and explicit Termina Fase resolution.

#### Scenario: Explicit phase ending remains after Conclusione
- **WHEN** the player has attempted a Conclusione
- **THEN** the system keeps the Fase active until the player uses Termina Fase
- **AND** the system does not automatically resolve the opponent intention

#### Scenario: No card play after Conclusione
- **WHEN** the player has attempted a Conclusione in the current Fase
- **THEN** the system prevents every further card play in that Fase
- **AND** this includes offensive, defensive, support, occasion, construction, and conclusion cards

#### Scenario: Offensive Intenzione resolution with effective coverage
- **WHEN** the player uses Termina Fase while the current Intenzione Avversaria is offensive
- **THEN** the system resolves the opponent scoring chance using Minaccia reduced by Copertura effettiva

#### Scenario: Defensive Intenzione does not create hidden counterattack
- **WHEN** the player fails a Conclusione while the current Intenzione Avversaria is defensive
- **THEN** the system does not create Sbilanciamento
- **AND** the system does not create an opponent scoring chance for that defensive intention

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

The system SHALL allow at most one optional Conclusione per Fase and calculate player goal probability from the selected Conclusione card, Pericolosità, Combinazioni, Bonus di Sequenza, Bonus Passivi, Esposizione Avversaria, opponent Difesa, and defensive penalties.

#### Scenario: Live conclusion probability includes opponent exposure
- **WHEN** the current Intenzione Avversaria has Esposizione Avversaria
- **THEN** the system includes that exposure as a direct bonus in the probability displayed on available Conclusione cards

#### Scenario: Sequence bonus before a conclusion
- **WHEN** the player has played at least one Costruzione followed by at least one Occasione in the current Fase
- **THEN** the next Conclusione probability includes a +5% Bonus di Sequenza before the final 10%-85% clamp
- **AND** the displayed Conclusione probability breakdown shows the Bonus di Sequenza before the player attempts the Conclusione

#### Scenario: Attacking an exposed opponent
- **WHEN** the current Intenzione Avversaria is Assalto finale
- **THEN** the player's Conclusione probability includes +15% Esposizione Avversaria before the final 10%-85% clamp

#### Scenario: Attempting a Conclusione
- **WHEN** the player uses a Conclusione card
- **THEN** the system resolves a goal or failed shot using a clamped probability between 10% and 85%
- **AND** the system marks the current Azione as concluded

#### Scenario: Successful Conclusione creates no Sbilanciamento
- **WHEN** the player scores with a Conclusione
- **THEN** the system does not create Sbilanciamento
- **AND** the opponent resolution later in the Fase is not modified by post-shot Sbilanciamento

### Requirement: Tactical guidance

The system SHALL provide a static "Come si gioca" section for the essential game rules and a static reference of available action synergies, so the player can understand the game without discovering its rules only through trial and error.

#### Scenario: Opening the game guide before a run
- **WHEN** the player is on the initial menu
- **THEN** the system shows a secondary "Come si gioca" action alongside the Start action
- **AND** opening the guide does not require the player to start a Run

#### Scenario: Opening the game guide during a match
- **WHEN** the player is in a Partita
- **THEN** the system shows a book-icon action that opens the same "Come si gioca" content in an overlay
- **AND** opening or closing the guide does not change the current Run or Partita state

#### Scenario: Guide remains optional
- **WHEN** the player opens the game or starts a Run
- **THEN** the system does not open the "Come si gioca" section automatically

#### Scenario: Essential guide content
- **WHEN** the player opens the "Come si gioca" section
- **THEN** the system explains that the player must win five Partite and that a draw or loss ends the Run
- **AND** the system explains that each Fase starts with 3 Energia Tattica, a five-card hand, and one visible Intenzione Avversaria
- **AND** the system explains that cards build Pericolosità for attacking or Copertura for defending
- **AND** the system explains that the player may attempt a Conclusione and then uses Termina Fase to resolve the Fase
- **AND** these four concepts are presented as compact visual panels using the game's existing icon language
- **AND** the system shows `Costruzione -> Occasione -> Conclusione -> Termina Fase` as a typical, non-mandatory example sequence
- **AND** detailed formulas, Bonus di Sequenza, and Combinazioni remain separate advanced references in the Partita interface

#### Scenario: Static synergy reference
- **WHEN** the player is in a match
- **THEN** the system shows a static list of available Bonus di Sequenza options and Combinazioni
- **AND** the Bonus di Sequenza list is visually separated from Tag Tattico-based Combinazioni

### Requirement: Card category readability

The system SHALL make card categories easy to distinguish through a light background tint on each card.

#### Scenario: Category background colors
- **WHEN** the system displays a card
- **THEN** Difesa cards use a light green background tint
- **AND** Costruzione cards use a light blue background tint
- **AND** Occasione cards use a light yellow background tint
- **AND** Conclusione cards use a light red background tint

### Requirement: Effetti Tattici

The system SHALL model identity card effects as visible reusable Effetti Tattici and include active effects in live probability displays.

#### Scenario: Next Conclusione bonus from Lancio lungo
- **WHEN** the player plays Lancio lungo while the current Intenzione Avversaria is offensive
- **THEN** the next available Conclusione in the current Fase shows +10% goal chance before the final 10%-85% clamp
- **AND** the bonus is consumed when the player attempts a Conclusione
- **AND** the bonus resets when the next Fase begins

#### Scenario: Lancio lungo against defensive intention
- **WHEN** the player plays Lancio lungo while the current Intenzione Avversaria is defensive
- **THEN** the system does not add a Conclusione chance bonus

#### Scenario: Terzo uomo after Costruzione
- **WHEN** the player plays Terzo uomo after at least one Costruzione card in the current Fase
- **THEN** Terzo uomo adds 3 total Pericolosità

#### Scenario: Terzo uomo without prior Costruzione
- **WHEN** the player plays Terzo uomo before any Costruzione card in the current Fase
- **THEN** Terzo uomo adds 2 total Pericolosità

#### Scenario: Imbucata centrale after two Costruzione cards
- **WHEN** the player can attempt Imbucata centrale after at least two Costruzione cards were played earlier in the current Fase
- **THEN** the displayed Conclusione chance includes +10% before the final 10%-85% clamp

#### Scenario: Linea compatta against offensive intention
- **WHEN** the player plays Linea compatta while the current Intenzione Avversaria is offensive
- **THEN** Linea compatta adds 5 total Copertura

#### Scenario: Linea compatta against defensive intention
- **WHEN** the player plays Linea compatta while the current Intenzione Avversaria is defensive
- **THEN** Linea compatta adds 4 total Copertura

#### Scenario: Sovrapposizione continua reduces coverage
- **WHEN** the player plays Sovrapposizione continua
- **THEN** the system adds 3 Pericolosità
- **AND** the system reduces current Copertura by 1
- **AND** Copertura may become negative

### Requirement: Negative Copertura

The system SHALL allow Copertura to become negative only through explicit card effects and SHALL make negative Copertura increase opponent scoring risk.

#### Scenario: Negative coverage increases residual threat
- **WHEN** the current offensive Intenzione Avversaria has Minaccia 4
- **AND** the player has Copertura -1
- **THEN** the system calculates Minaccia residua as 5

#### Scenario: Ordinary offensive cards do not reduce coverage
- **WHEN** the player plays an offensive card without an explicit negative Copertura effect
- **THEN** the system does not reduce Copertura

#### Scenario: Negative coverage resets
- **WHEN** the next Fase begins
- **THEN** Copertura resets to 0
- **AND** any negative Copertura from the prior Fase is cleared

### Requirement: Sbilanciamento

The system SHALL create Sbilanciamento only when the player fails a Conclusione against a visible offensive Intenzione Avversaria, and SHALL apply it by reducing Copertura effettiva for that Fase without letting Sbilanciamento alone create negative Copertura from a non-negative value.

#### Scenario: Failed Conclusione against normal offensive intention
- **WHEN** the player fails a Conclusione while the current Intenzione Avversaria is offensive and is not Contropiede
- **THEN** the system sets Sbilanciamento to 2 for the current Fase

#### Scenario: Failed Conclusione against Contropiede
- **WHEN** the player fails a Conclusione while the current Intenzione Avversaria is Contropiede
- **THEN** the system sets Sbilanciamento to 3 for the current Fase

#### Scenario: Sbilanciamento alone cannot create negative effective coverage
- **WHEN** the player's Copertura is 1
- **AND** Sbilanciamento is 2
- **THEN** Copertura effettiva is 0

#### Scenario: Sbilanciamento stacks with already-negative coverage
- **WHEN** the player's Copertura is -1 because of an explicit card effect
- **AND** Sbilanciamento is 2
- **THEN** Copertura effettiva is -3

#### Scenario: Effective coverage calculation
- **WHEN** the opponent scoring chance is calculated
- **THEN** the system calculates Copertura effettiva as `max(0, Copertura - Sbilanciamento)` if Copertura is 0 or greater
- **AND** the system calculates Copertura effettiva as `Copertura - Sbilanciamento` if Copertura is less than 0
- **AND** the system calculates Minaccia residua as `max(0, Minaccia - Copertura effettiva)`

#### Scenario: Sbilanciamento resets
- **WHEN** the next Fase begins
- **THEN** Sbilanciamento resets to 0

### Requirement: Opponent intentions

The system SHALL give each opponent an eight-card Mazzo Intenzioni and draw one visible Intenzione Avversaria for each Fase, where offensive intentions can define both Minaccia and Esposizione Avversaria.

#### Scenario: Offensive intention values
- **WHEN** an offensive Intenzione Avversaria is shown
- **THEN** the system can show its base Minaccia and Esposizione Avversaria values

#### Scenario: Initial offensive intention tuning
- **WHEN** the system loads MVP Basic intention data
- **THEN** the offensive intentions have these values:
  - Attacco paziente: base Minaccia 1 and Esposizione Avversaria +0%
  - Attacco centrale: base Minaccia 2 and Esposizione Avversaria +5%
  - Contropiede: base Minaccia 3 and Esposizione Avversaria +5%
  - Assalto finale: base Minaccia 4 and Esposizione Avversaria +15%

#### Scenario: Live opponent goal probability after Sbilanciamento
- **WHEN** a failed Conclusione creates Sbilanciamento
- **THEN** the visible opponent goal probability updates immediately before Termina Fase
- **AND** the display uses Copertura effettiva rather than raw Copertura

#### Scenario: Live opponent goal probability after defensive card
- **WHEN** the current Intenzione Avversaria is offensive and Copertura changes before a Conclusione
- **THEN** the system updates the visible opponent goal probability using the current Copertura effettiva

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
