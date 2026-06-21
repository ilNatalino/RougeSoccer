## Why

The current responsive rules use width-only breakpoints. Small phones such as 667x375 stack nearly every Partita element vertically, while wider landscape phones such as 844x390 can receive a layout closer to desktop even though their usable height is smaller.

In both cases the player must scroll past the header, a 230px decorative pitch, metrics, and full-height cards to compare the Intenzione Avversaria with the available hand. Essential decisions and Termina Fase are separated from the hand, so a Fase is technically accessible but not comfortably playable.

The Partita needs a height-aware landscape cockpit that keeps the complete decision loop within one phone viewport without changing the game rules.

## What Changes

- Add a landscape-phone cockpit for viewports in landscape orientation with width at least 667px and height at most 500px.
- Fit the Partita inside the dynamic viewport and safe areas without document-level vertical or horizontal scrolling.
- Replace the decorative tactical pitch and large match header with a compact status bar containing score, Partita, Fase, Energia Tattica, Pericolosità, Copertura, and access to Dettagli.
- Split the central area between the current Intenzione Avversaria and the current Azione, including played-card order, active modifiers, and the best available Conclusione chance.
- Render the five-card Mano as five compact summaries that remain simultaneously visible without horizontal scrolling.
- Make a tap on a compact hand summary open the complete card in a full-screen overlay; playing the card requires a separate Gioca or Concludi action.
- Keep the complete card content and Illustrazione di Carta in the overlay, allowing internal overlay scrolling when the content exceeds the available height.
- Move non-essential match information and run controls into a dismissible Dettagli drawer.
- Keep Termina Fase immediate and confirmation-free as a compact secondary action with an accessible touch target.
- Preserve the existing scrollable portrait layout and add a non-blocking suggestion to rotate the device.
- Keep desktop behavior and presentation unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `football-roguelike-mvp`: Adds a playable phone-landscape presentation and interaction model for the existing Partita without changing rules, probabilities, or run state.

## Impact

- Refactors the Partita presentation in `src/app/page.tsx` into reusable status, Intenzione, current Azione, compact hand, full-card overlay, and Dettagli drawer surfaces.
- Adds height- and orientation-aware rules to `src/app/globals.css`, including dynamic viewport and safe-area handling.
- Reuses existing game-engine selectors and actions; no changes are required to card effects, scoring, opponent resolution, RNG, deck handling, or persistence.
- Introduces local presentation state for the selected card, full-card overlay, Dettagli drawer, and portrait rotation notice.
- Requires responsive verification at 667x375, 844x390, and 915x412, with current Safari on iOS and Chrome on Android as browser targets.
- Does not add orientation locking, a mobile-only ruleset, new game mechanics, new cards, backend APIs, or legacy-browser support.
