## ADDED Requirements

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
