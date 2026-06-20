## Why

The project has a resolved MVP concept for a football roguelike, but no runnable implementation yet. This change creates the first playable vertical slice so the core loop can be tested quickly: tactical phases, card play, scoring, opponent intentions, rewards, and run completion.

## What Changes

- Add a frontend-only Next.js application for the MVP Basic.
- Implement a complete in-memory run flow: new run, initial squad reveal, five-match progression, reward selection, boss match, victory, and game over.
- Implement the tactical match loop with 10 phases, visible opponent intentions, energy, hand/deck/discard handling, card play, conclusions, opponent scoring, and end-of-phase resolution.
- Add static game data for starter cards, reward cards, player passives, opponents, and opponent intention decks.
- Add deterministic local RNG with an automatic seed for debugging and reproducible runs.
- Exclude backend APIs, persistence, events, card upgrades/removal, multiplayer, and direct player control.

## Capabilities

### New Capabilities

- `football-roguelike-mvp`: Covers the playable MVP Basic experience for a frontend-only football roguelike, including run flow, tactical matches, cards, squad passives, opponent intentions, scoring, rewards, and terminal states.

### Modified Capabilities

- None.

## Impact

- Adds a Next.js app structure and package metadata.
- Adds client-side game engine modules for data, rules, RNG, and state transitions.
- Adds a single interactive UI for the run, squad reveal, match, reward, victory, and game-over screens.
- No backend, database, external API, or persistent storage is introduced.
