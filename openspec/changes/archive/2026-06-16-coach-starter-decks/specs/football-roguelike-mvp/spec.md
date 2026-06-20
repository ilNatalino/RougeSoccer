## ADDED Requirements

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
- **AND** the system assigns Calciatori independently from the Allenatore choice
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

## MODIFIED Requirements

### Requirement: Run lifecycle

The system SHALL allow the player to complete a single-player run made of five matches: four normal matches followed by one boss match, starting from the selected Allenatore's Mazzo di Partenza.

#### Scenario: Starting a new run
- **WHEN** the player chooses an Allenatore
- **THEN** the system creates an in-memory run with match index 1, the selected Allenatore's Mazzo di Partenza, an automatic RNG seed, and five assigned Calciatori

#### Scenario: Winning the boss match
- **WHEN** the player wins the fifth match
- **THEN** the system shows the run victory state

#### Scenario: Losing or drawing a match
- **WHEN** a match ends with the player score less than or equal to the opponent score
- **THEN** the system ends the run and shows the game-over state

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
