## Why

The current MVP match loop is playable, but shots and opponent attacks still feel too independent from each other. A Conclusione currently resolves only the player's scoring chance, while the opponent's visible Intenzione Avversaria resolves later without reacting to whether the player has overcommitted and missed.

The gameplay should become more tactical and more football-like: shooting should be a commitment, a failed shot against an already attacking opponent should leave the player structurally exposed, and aggressive opponent attacks should also create exploitable space for the player. The player must be able to see these risks before committing, not discover hidden punishment after clicking Termina Fase.

## What Changes

- Make Conclusione close the player's Azione for the current Fase.
- Keep Termina Fase as the explicit button that advances to opponent resolution, but prevent all further card play after a Conclusione, including defensive cards.
- Add Sbilanciamento when the player misses a Conclusione while the current Intenzione Avversaria is offensive.
- Apply Sbilanciamento as a reduction to Copertura effettiva, clamped at zero.
- Use fixed Sbilanciamento values for the MVP Basic:
  - 2 against normal Intenzioni Offensive.
  - 3 against Contropiede.
- Do not create Sbilanciamento after a successful Conclusione, because play narratively restarts from a kickoff.
- Do not create hidden counterattacks against Intenzioni Difensive.
- Add Esposizione Avversaria to offensive opponent intentions as a direct bonus to the player's Conclusione probability.
- Use initial Esposizione Avversaria values:
  - Attacco paziente: +0%.
  - Attacco centrale: +5%.
  - Contropiede: +5%.
  - Assalto finale: +15%.
- Update the match UI immediately after a failed Conclusione so Copertura effettiva and opponent goal chance reflect Sbilanciamento before Termina Fase.

## Capabilities

### Modified Capabilities

- `football-roguelike-mvp`: Modifies tactical phase flow, Conclusione resolution, opponent intention calculations, live probability display, and match UI feedback.

### New Capabilities

- None. This change deepens the existing MVP tactical match capability rather than adding a separate gameplay mode.

## Impact

- Updates domain and MVP design documentation for Conclusione, Sbilanciamento, and Esposizione Avversaria.
- Changes TypeScript game data for Intenzioni Offensive.
- Changes scoring formulas in `rules.ts`.
- Changes match state and state transitions in `engine.ts`.
- Changes UI affordances in `page.tsx` so post-shot cards are disabled and risk updates are visible.
- Requires focused checks for post-Conclusione blocking, Sbilanciamento math, Esposizione Avversaria scoring, and live opponent probability changes.
