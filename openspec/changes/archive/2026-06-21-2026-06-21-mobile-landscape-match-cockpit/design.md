## Context

The Partita currently renders one desktop-oriented hierarchy: header, match metrics, a decorative tactical board, phase metrics, full tactical cards, and a long side stack. At widths below 760px that hierarchy becomes a single column. At landscape-phone heights, this separates information that the player must compare during every Fase.

The game rules already expose all required state through `RunState` and existing selectors. The change is therefore a presentation and interaction redesign, not a new game-state model.

The target minimum viewport is 667x375 CSS pixels. The compact cockpit also applies to wider phones when their viewport height is at most 500px. Current mobile Safari and Chrome are the supported browser families.

## Goals

- Make the complete Partita decision loop usable without document scrolling at 667x375.
- Keep essential Fase state continuously visible while the player evaluates the Mano.
- Keep all five hand cards visible at once.
- Preserve the complete tactical-card content and artwork on demand.
- Avoid accidental card play by separating inspection from execution.
- Preserve desktop and game-engine behavior.

## Non-goals

- Supporting portrait as a no-scroll cockpit.
- Locking device orientation or blocking portrait play.
- Redesigning the start, Allenatore, Squadra, reward, victory, or game-over screens into no-scroll views.
- Changing card costs, hand size, phase rules, scoring, probabilities, or opponent behavior.
- Removing information from the complete card representation.
- Supporting legacy mobile browsers.

## Responsive Activation

The landscape cockpit activates when all of the following are true:

- `orientation: landscape`
- viewport width is at least `667px`
- viewport height is at most `500px`

Height is the primary constraint. Width-only breakpoints cannot distinguish a landscape phone from a short desktop window reliably enough for this interface.

The cockpit uses `100dvh` and `env(safe-area-inset-*)` so browser chrome and notches do not cover interactive content. The Partita root owns the viewport and suppresses document scrolling only while this layout is active. Scroll remains available inside the full-card overlay and Dettagli drawer.

Viewports outside the activation range retain the existing responsive layout. Portrait shows a non-blocking rotation suggestion during a Partita but remains usable through normal page scrolling.

## Cockpit Information Architecture

The cockpit has three fixed regions:

```text
┌ Punteggio · Partita · Fase · Energia · Pericolosità · Copertura · Dettagli ┐
├─────────────────────────────┬───────────────────────────────────────────────┤
│ Intenzione Avversaria       │ Azione in corso                              │
│ rischio e probabilità gol   │ sequenza, bonus attivi, miglior Conclusione  │
├─────────────────────────────┴───────────────────────────────[Termina Fase]─┤
│ Carta 1 │ Carta 2 │ Carta 3 │ Carta 4 │ Carta 5                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Compact status bar

The top region contains:

- Current score.
- Partita number.
- Fase number.
- Remaining Energia Tattica.
- Current Pericolosità, including effective value when it differs from the stored value.
- Current Copertura and Sbilanciamento when present.
- Compact badges for active Bonus di Sequenza, Combinazioni, and Effetti Tattici.
- A Dettagli control.

The desktop brand, seed, Come si gioca button, Nuova Run button, and decorative pitch do not occupy cockpit space.

### Intenzione Avversaria

The left central panel contains the opponent name, Intenzione name and description, Minaccia or defensive penalty, Esposizione Avversaria when present, and the live opponent goal probability with its most relevant inputs.

### Azione in corso

The right central panel shows:

- Cards played during the current Fase in play order.
- Active Bonus di Sequenza, Combinazioni, and Effetti Tattici.
- The best available Conclusione and its live goal probability.
- The latest Conclusione result when present.

This gives the player a visible explanation for the current tactical totals without requiring the full Registro.

Termina Fase remains a compact secondary button in the fixed cockpit. It resolves immediately, including when Energia remains; no additional confirmation is introduced. Its visual footprint may be small, but its interactive area remains at least 44x44 CSS pixels.

## Compact Mano

`HAND_SIZE` is fixed at five, so the cockpit reserves one bottom row for five equal compact summaries without horizontal scrolling.

Each summary contains enough information to choose what to inspect:

- Card name.
- Card type.
- Energia cost.
- Main Pericolosità, Copertura, or Conclusione chance signal.
- Disabled state when the card cannot be played.

The compact summary is a hand-selection control, not the complete tactical-card rendering. It therefore does not need to reproduce the Illustrazione di Carta or full rules text. This distinction preserves the card-illustration requirement for complete cards while making the five-card hand usable in the constrained cockpit.

## Full-card Overlay

Tapping a compact hand summary opens a modal, full-screen card overlay and does not play the card.

The overlay contains the complete current card representation:

- Type and cost.
- Name.
- Illustrazione di Carta.
- Base description.
- Effetti Tattici and their active state.
- Current Pericolosità and Copertura impact, including Squadra and tactical modifiers.
- Combinazione preview.
- Live Conclusione probability and full breakdown when applicable.
- Visible boosts.
- Disabled reason.
- Tag Tattici.

The card body may scroll vertically inside the overlay when it cannot fit at a readable size. The match behind the modal remains fixed.

The overlay provides a separate primary action:

- `Gioca` for non-Conclusione cards.
- `Concludi` for Conclusione cards.

Executing the action uses the existing `playCard` or `shoot` path, closes the overlay, and returns focus to the cockpit. Closing the overlay without executing leaves the Partita unchanged.

The overlay uses dialog semantics, traps focus while open, supports Escape, exposes an explicit close control, and restores focus to the compact hand summary that opened it.

## Dettagli Drawer

The Dettagli control opens an overlay drawer from the right, approximately 75% of the viewport width, with its own vertical scroll. It contains:

- Allenatore and Stile di Gioco.
- Squadra and Bonus Passivi.
- Mazzo and Scarti counts.
- Static Bonus di Sequenza and Combinazioni reference.
- Registro.
- Run seed.
- Come si gioca.
- Nuova Run.

Active modifiers remain in the cockpit instead of being available only in the drawer.

The drawer closes through an explicit close control, backdrop click, or Escape. Opening or closing it does not alter Partita state. It uses dialog semantics and restores focus to its trigger.

## Presentation State

The following state is local to the Partita presentation and is not added to `RunState`:

- Selected compact hand card / open full-card overlay.
- Dettagli drawer open state.
- Dismissed portrait rotation suggestion.

When a selected card leaves the Mano because it is played, the overlay closes and selection clears. Starting a new Fase or leaving the Partita also clears transient presentation state.

## Accessibility and Input

- All primary cockpit controls have an interactive target of at least 44x44 CSS pixels.
- Compact summaries expose card name, type, cost, main impact, and disabled state through visible text and accessible naming.
- Focus order follows status, central panels, Termina Fase, then the Mano.
- Dialog and drawer content remain keyboard operable.
- Reduced-motion preferences disable non-essential overlay and drawer transitions.
- Information is not encoded only through color.

## Risks / Trade-offs

- Five equal summaries can become dense at 667px -> constrain each summary to decision-critical fields and keep full rules in the overlay.
- Full cards can exceed the landscape height -> scroll inside the full-screen overlay, never the underlying Partita.
- Duplicating desktop and cockpit markup can create divergent behavior -> share selectors, card-content renderers, and action callbacks between presentations.
- Browser chrome can reduce available height -> use dynamic viewport units and safe-area insets rather than fixed `100vh`.
- Hidden information can make results feel arbitrary -> keep active modifiers and current Azione visible; move only reference and run metadata to Dettagli.
- A compact Termina Fase control can be harder to hit -> keep the visual treatment secondary while preserving a 44x44 target.

## Documentation Decision

No `CONTEXT.md` update is required because this change introduces no new domain term or changed domain meaning. No ADR is required because the responsive presentation is reversible, unsurprising once the viewport constraint is known, and isolated from the game model.
