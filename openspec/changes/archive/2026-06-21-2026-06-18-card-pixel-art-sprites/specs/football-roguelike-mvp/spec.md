## ADDED Requirements

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

## MODIFIED Requirements

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
