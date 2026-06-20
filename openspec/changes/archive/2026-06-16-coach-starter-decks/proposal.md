## Why

The current MVP starts every run from the same starter deck, so repeated play tends to converge on the same card sequences. The game needs stronger run-to-run variety while staying coherent with the football theme.

## What Changes

- Add an initial Allenatore choice with three options: Maestro del Possesso, Specialista del Blocco Basso, and Allenatore d'Assalto.
- Make each Allenatore select one Mazzo di Partenza of 15 cards before the first Partita.
- Give each Mazzo di Partenza 6 exclusive Carte Identitarie: 3 new cards, 2 copies each.
- Keep the remaining 9 cards in each Mazzo di Partenza as shared cards from the existing card pool.
- Keep all rewards common and exclude Carte Identitarie from the reward pool.
- Add reusable Effetti Tattici for identity cards, including conditional Conclusione bonuses, sequence-based card bonuses, and explicit Copertura penalties.
- Allow Copertura to become negative only through cards with an explicit negative Copertura effect, and make negative Copertura increase opponent scoring risk.

## Capabilities

### New Capabilities

- `coach-starter-decks`: Covers Allenatore selection, themed Mazzi di Partenza, exclusive Carte Identitarie, and their tactical effects.

### Modified Capabilities

- `football-roguelike-mvp`: The run no longer starts from one fixed starter deck; it starts from the selected Allenatore's Mazzo di Partenza.

## Impact

- Adds static data for Allenatori, three starter deck definitions, and nine identity cards.
- Extends card effect modeling beyond only Pericolosità, Copertura, and base goal chance.
- Updates run creation and UI flow so the player chooses an Allenatore before the first match.
- Updates opponent chance calculation so negative Copertura is meaningful.
- Does not add coach passives, coach-specific rewards, persistence, backend APIs, or a new resource system.
