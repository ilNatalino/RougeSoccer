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

The system SHALL make card categories easy to distinguish through card type tints, compact type/cost labeling, and card illustrations that preserve readable written effects.

#### Scenario: Category background colors
- **WHEN** the system displays a card
- **THEN** Difesa cards use a light green background tint
- **AND** Costruzione cards use a light blue background tint
- **AND** Occasione cards use a light yellow background tint
- **AND** Conclusione cards use a light red background tint
- **AND** Supporto cards use their intended support tint

#### Scenario: Card visual hierarchy
- **WHEN** the system displays a card
- **THEN** the card presents compact type and cost information near the top
- **AND** the card name appears above the illustration
- **AND** the illustration appears before the written effects
- **AND** tags remain in the card footer

#### Scenario: Compact card information
- **WHEN** a card has dynamic squad bonuses, active Effetti Tattici, or live probability details
- **THEN** the system displays those details in a compact lower-card area
- **AND** the details do not overlap the illustration, card name, or tag footer

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

### Requirement: Landscape phone match cockpit

The system SHALL provide a height-aware Partita cockpit for supported landscape-phone viewports without changing the underlying game rules.

#### Scenario: Minimum supported landscape viewport
- **WHEN** a Partita is displayed in a viewport that is 667 CSS pixels wide, 375 CSS pixels high, and in landscape orientation
- **THEN** the landscape cockpit is active
- **AND** the entire cockpit fits inside the dynamic viewport and safe areas
- **AND** the document has no vertical or horizontal scrolling
- **AND** no interactive control is covered by a notch or dynamic browser bar

#### Scenario: Wider landscape phones use the cockpit
- **WHEN** a Partita is displayed in landscape orientation with width at least 667 CSS pixels and height at most 500 CSS pixels
- **THEN** the system uses the same height-aware cockpit
- **AND** the layout does not depend on a width-only mobile breakpoint

#### Scenario: Desktop presentation remains unchanged
- **WHEN** a Partita is displayed outside the landscape cockpit activation range
- **THEN** the system retains the existing desktop or scrollable responsive presentation
- **AND** the decorative tactical pitch remains available on desktop
- **AND** desktop cards retain their existing direct-play interaction

### Requirement: Landscape cockpit information hierarchy

The system SHALL keep the information required to decide and resolve the current Fase visible without opening secondary UI or scrolling the document.

#### Scenario: Essential match state stays visible
- **WHEN** the landscape cockpit is active during a Fase
- **THEN** the player can simultaneously see the score, Partita number, Fase number, remaining Energia Tattica, Pericolosità, and Copertura
- **AND** Sbilanciamento is visible when it is present
- **AND** the decorative tactical pitch does not consume cockpit space

#### Scenario: Intenzione Avversaria stays visible
- **WHEN** the landscape cockpit is active
- **THEN** the player can see the opponent, current Intenzione Avversaria name and description, and its offensive risk or defensive penalty
- **AND** live opponent goal probability and Esposizione Avversaria are visible when applicable

#### Scenario: Current action stays visible
- **WHEN** one or more cards have been played in the current Fase
- **THEN** the cockpit shows those cards in play order as the current Azione
- **AND** active Bonus di Sequenza, Combinazioni, and Effetti Tattici remain visible as compact status indicators
- **AND** the current Pericolosità and Copertura can be understood without opening the Registro

#### Scenario: Best available conclusion stays visible
- **WHEN** at least one Conclusione is available in the current Mano
- **THEN** the current Azione panel shows the best available Conclusione and its live goal probability
- **AND** that summary updates after each played card

#### Scenario: Latest conclusion result stays visible
- **WHEN** the player has attempted a Conclusione in the current Fase
- **THEN** the current Azione panel shows the Conclusione name, goal or miss result, roll, and chance

### Requirement: Compact landscape hand

The system SHALL present the five-card Mano as compact selection summaries in the landscape cockpit.

#### Scenario: Five-card hand fits without scrolling
- **WHEN** the landscape cockpit is active with five cards in the Mano
- **THEN** all five compact card summaries are simultaneously visible
- **AND** the Mano does not require horizontal or document-level vertical scrolling
- **AND** the summaries do not overlap

#### Scenario: Compact summary exposes decision signals
- **WHEN** a card is present in the compact Mano
- **THEN** its summary shows the card name, type, Energia cost, and main tactical impact or live Conclusione chance
- **AND** its disabled state is visible when it cannot be played
- **AND** the compact summary is not required to reproduce the complete Illustrazione di Carta or full rules text

#### Scenario: Tapping a compact card inspects without playing
- **WHEN** the player taps an enabled compact card summary
- **THEN** the system opens that card in the full-card overlay
- **AND** the system does not spend Energia Tattica
- **AND** the system does not apply the card effect or attempt a Conclusione

### Requirement: Complete landscape card overlay

The system SHALL show the selected hand card in a full-screen modal overlay before the player executes it from the landscape cockpit.

#### Scenario: Overlay shows the complete card
- **WHEN** the player opens a compact hand card
- **THEN** the overlay shows its type, cost, name, complete Illustrazione di Carta, description, Effetti Tattici, current tactical impacts, visible boosts, Combinazione preview, disabled reason, and Tag Tattici when applicable
- **AND** a Conclusione shows its live goal probability and complete probability breakdown
- **AND** the overlay preserves readable text rather than scaling the complete card to an illegible size

#### Scenario: Long card scrolls inside the overlay
- **WHEN** the complete card content exceeds the landscape viewport height
- **THEN** the overlay body scrolls vertically
- **AND** the underlying Partita remains fixed
- **AND** the document itself does not scroll

#### Scenario: Explicitly playing a non-conclusion card
- **WHEN** the player uses Gioca in the overlay for an enabled non-Conclusione card
- **THEN** the system applies the existing card-play rules exactly once
- **AND** the overlay closes
- **AND** the cockpit reflects the updated Energia Tattica, Mano, current Azione, Pericolosità, Copertura, and active modifiers

#### Scenario: Explicitly attempting a conclusion
- **WHEN** the player uses Concludi in the overlay for an enabled Conclusione card
- **THEN** the system applies the existing Conclusione rules exactly once
- **AND** the overlay closes
- **AND** the cockpit shows the shot result and updated Fase state

#### Scenario: Closing without playing
- **WHEN** the player closes the full-card overlay without using Gioca or Concludi
- **THEN** no Energia Tattica is spent
- **AND** no Partita or Run state changes
- **AND** focus returns to the compact hand summary that opened the overlay

#### Scenario: Selected card becomes unavailable
- **WHEN** the selected card becomes disabled or leaves the Mano before execution
- **THEN** the system prevents Gioca or Concludi from executing it
- **AND** the overlay exposes the current disabled reason or closes safely

### Requirement: Landscape details drawer

The system SHALL move non-essential match reference and run metadata into a dismissible overlay drawer while keeping active tactical state in the cockpit.

#### Scenario: Opening details
- **WHEN** the player opens Dettagli from the landscape cockpit
- **THEN** a right-side overlay drawer opens with its own vertical scrolling
- **AND** it shows Allenatore, Stile di Gioco, Squadra, Bonus Passivi, Mazzo and Scarti counts, static sequence and combination references, Registro, seed, Come si gioca, and Nuova Run
- **AND** opening the drawer does not change Partita or Run state

#### Scenario: Active modifiers do not disappear into details
- **WHEN** Bonus di Sequenza, Combinazioni, or Effetti Tattici are active
- **THEN** their compact indicators remain visible in the cockpit while Dettagli is closed
- **AND** the player is not required to open Dettagli to discover that an active modifier exists

#### Scenario: Closing details
- **WHEN** the player uses the close control, backdrop, or Escape
- **THEN** the Dettagli drawer closes without changing Partita state
- **AND** focus returns to the Dettagli trigger

### Requirement: Landscape phase controls

The system SHALL keep Termina Fase immediately available as a compact secondary cockpit action.

#### Scenario: Ending a phase with energy remaining
- **WHEN** the player uses Termina Fase while Energia Tattica or playable cards remain
- **THEN** the system immediately applies the existing end-phase rules
- **AND** the system does not ask for confirmation

#### Scenario: Compact control remains touch accessible
- **WHEN** Termina Fase is rendered in the landscape cockpit
- **THEN** its visual treatment is secondary to Gioca or Concludi
- **AND** its interactive target is at least 44x44 CSS pixels

### Requirement: Portrait fallback and orientation guidance

The system SHALL preserve a usable scrollable portrait fallback without enforcing device orientation.

#### Scenario: Partita in portrait
- **WHEN** a phone displays a Partita in portrait orientation
- **THEN** the system preserves the existing scrollable match layout
- **AND** it shows a non-blocking suggestion to rotate the device for a better experience
- **AND** the player may dismiss the suggestion and continue playing in portrait

#### Scenario: Orientation is not locked
- **WHEN** the player enters or leaves a Partita
- **THEN** the system does not require or request browser orientation locking

### Requirement: Landscape cockpit accessibility

The system SHALL keep the compact cockpit, card overlay, and Dettagli drawer operable through touch and keyboard input.

#### Scenario: Touch targets
- **WHEN** the landscape cockpit is active
- **THEN** compact hand summaries and primary cockpit controls have interactive targets of at least 44x44 CSS pixels

#### Scenario: Modal focus behavior
- **WHEN** the full-card overlay or Dettagli drawer is open
- **THEN** focus remains inside the active modal surface
- **AND** Escape closes that surface
- **AND** closing restores focus to the control that opened it
- **AND** the card overlay and Dettagli drawer cannot be open simultaneously

#### Scenario: Reduced motion
- **WHEN** the player prefers reduced motion
- **THEN** non-essential card-overlay and drawer transitions are disabled

#### Scenario: Current state is not color-only
- **WHEN** a compact card is disabled or a tactical modifier is active
- **THEN** the system communicates that state through text or iconography in addition to color

### Requirement: Card pixel-art illustrations

The system SHALL show a unique pixel-art Illustrazione di Carta for every existing tactical card whenever that card is rendered as a card.

#### Scenario: Card in hand shows its illustration
- **WHEN** the player is in a Partita and a tactical card is visible in hand
- **THEN** the card shows a pixel-art illustration near the top of the card
- **AND** the illustration is specific to that card id
- **AND** the written card effects remain visible below the illustration

#### Scenario: Reward card shows its illustration
- **WHEN** the player is choosing a reward card
- **THEN** each reward option shows the same card-specific pixel-art illustration used for that card in hand
- **AND** the reward card keeps its effect text and tags visible

#### Scenario: Existing cards have bespoke illustrations
- **WHEN** the system loads the current tactical card pool
- **THEN** every current card has a bespoke illustration:
  - Passaggio corto
  - Cambio gioco
  - Inserimento
  - Cross
  - Tiro
  - Pressing
  - Ripiegamento
  - Verticalizzazione
  - Tiro piazzato
  - Marcatura
  - Azione sulla fascia
  - Calcio piazzato
  - Giro palla paziente
  - Terzo uomo
  - Imbucata centrale
  - Linea compatta
  - Lancio lungo
  - Punizione studiata
  - Sovrapposizione continua
  - Attacco in area
  - Tiro di prima

#### Scenario: Future card fallback
- **WHEN** a future card without a bespoke illustration is rendered
- **THEN** the system shows a generic fallback pixel-art illustration
- **AND** the card remains playable and readable

#### Scenario: Illustration does not replace rules text
- **WHEN** a card has a base description, Effetti Tattici, dynamic bonuses, live Conclusione chance, disabled reason, or tags
- **THEN** those textual and numeric details remain visible in compact form
- **AND** the illustration does not become the only way to understand the card's effect

### Requirement: Pixel-art sprite implementation

The system SHALL implement card illustrations as code-rendered sprites rather than external image assets.

#### Scenario: Sprite rendering technology
- **WHEN** the system renders a card illustration
- **THEN** it uses inline SVG or equivalent code-rendered shapes
- **AND** the rendered result uses crisp pixel-style edges
- **AND** it does not require network-loaded or file-based card image assets

#### Scenario: Unique scene with common readability constraints
- **WHEN** two different card illustrations are shown
- **THEN** they may use different internal scenes and football contexts
- **AND** they share stable dimensions, pixel-art styling, and card-frame readability constraints

### Requirement: Identity card visual treatment

The system SHALL make Carte Identitarie visually distinguishable from shared cards without implying a new gameplay rule.

#### Scenario: Identity card in hand
- **WHEN** a Carta Identitaria is visible in hand
- **THEN** the card uses a subtle identity treatment such as a border, frame, or inset pattern
- **AND** the treatment does not change the card size
- **AND** the treatment does not add rarity language or hidden rule text

#### Scenario: Shared card remains ordinary
- **WHEN** a shared card is visible as a card
- **THEN** it does not use the identity-card visual treatment
