## MODIFIED Requirements

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

### Requirement: Conclusions and scoring

The system SHALL allow at most one optional Conclusione per Fase and calculate player goal probability from the selected Conclusione card, Pericolosità, Combinazioni, Bonus Passivi, Esposizione Avversaria, opponent Difesa, and defensive penalties.

#### Scenario: Live conclusion probability includes opponent exposure
- **WHEN** the current Intenzione Avversaria has Esposizione Avversaria
- **THEN** the system includes that exposure as a direct bonus in the probability displayed on available Conclusione cards

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

### Requirement: Sbilanciamento

The system SHALL create Sbilanciamento only when the player fails a Conclusione against a visible offensive Intenzione Avversaria, and SHALL apply it by reducing Copertura effettiva for that Fase.

#### Scenario: Failed Conclusione against normal offensive intention
- **WHEN** the player fails a Conclusione while the current Intenzione Avversaria is offensive and is not Contropiede
- **THEN** the system sets Sbilanciamento to 2 for the current Fase

#### Scenario: Failed Conclusione against Contropiede
- **WHEN** the player fails a Conclusione while the current Intenzione Avversaria is Contropiede
- **THEN** the system sets Sbilanciamento to 3 for the current Fase

#### Scenario: Effective coverage cannot be negative
- **WHEN** Sbilanciamento is greater than the player's Copertura
- **THEN** Copertura effettiva is 0

#### Scenario: Effective coverage calculation
- **WHEN** the opponent scoring chance is calculated
- **THEN** the system calculates Copertura effettiva as `max(0, Copertura - Sbilanciamento)`
- **AND** calculates Minaccia residua as `max(0, Minaccia - Copertura effettiva)`

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
