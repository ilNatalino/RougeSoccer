## Why

Current tactical cards are readable but mostly textual. The player must scan the card name, type, description, effects, tags, and dynamic bonuses before recognizing what football action the card represents.

Cards need a stronger visual identity while preserving mechanical clarity during a Partita. Each card should feel like a football action, not just a rules tile.

## What Changes

- Add a unique pixel-art Illustrazione di Carta for every existing tactical card.
- Implement illustrations as inline code sprites, using SVG with crisp pixel rendering rather than external image assets.
- Show the illustration wherever a tactical card is rendered as a card, including the player's hand and reward choices.
- Rework card layout so the top area communicates card type, cost, name, and illustration, while written effects stay in the lower half.
- Keep the effect text, tactical effects, live bonuses, conclusion chance, and tags visible in compact form.
- Give Carte Identitarie a subtle visual treatment that distinguishes them from shared cards without turning them into RPG-style rarities.
- Provide a generic fallback illustration only for future cards that do not yet have a bespoke sprite.
- Fix card type visual styling so Supporto cards receive their intended type tint.

## Capabilities

### New Capabilities

- `card-pixel-art-sprites`: Covers unique pixel-art card illustrations, card layout hierarchy, fallback illustration behavior, and identity-card visual treatment.

### Modified Capabilities

- `football-roguelike-mvp`: Tactical cards become visually identifiable through card-specific illustrations while retaining their existing gameplay rules and readable effect text.

## Impact

- Adds a reusable card illustration component and a sprite definition for each of the 21 existing cards.
- Updates HandCard and RewardCard rendering to share the same illustration language.
- Updates card CSS for stable dimensions, compact lower-card rules text, and identity-card treatment.
- Keeps all gameplay state, card effects, probabilities, rewards, and deck behavior unchanged.
- Does not add image files, generation tooling, animation, new card mechanics, rarity systems, backend APIs, or persistence.
