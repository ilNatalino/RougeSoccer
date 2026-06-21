## 1. Responsive Foundation

- [x] 1.1 Add a landscape-phone activation rule for orientation landscape, width at least 667px, and height at most 500px.
- [x] 1.2 Make the active Partita cockpit fit `100dvh` without document-level vertical or horizontal scrolling.
- [x] 1.3 Apply safe-area insets and verify that notches and dynamic browser bars do not cover controls.
- [x] 1.4 Add a non-blocking portrait rotation suggestion while preserving the existing scrollable portrait layout.

## 2. Cockpit Layout

- [x] 2.1 Add a compact status bar for score, Partita, Fase, Energia Tattica, Pericolosità, Copertura, Sbilanciamento, active modifiers, and Dettagli access.
- [x] 2.2 Remove the decorative tactical pitch and large header from the landscape cockpit while leaving desktop presentation unchanged.
- [x] 2.3 Add a compact Intenzione Avversaria panel with opponent, intention, risk or penalty, exposure, and opponent goal probability.
- [x] 2.4 Add an Azione in corso panel showing cards played in order, active modifiers, the best available Conclusione chance, and the latest shot result.
- [x] 2.5 Keep Termina Fase as an immediate compact secondary action with a minimum 44x44 touch target and no confirmation step.

## 3. Compact Mano

- [x] 3.1 Add a compact hand-summary component for card name, type, cost, main impact or Conclusione chance, and disabled state.
- [x] 3.2 Render up to five equal compact summaries simultaneously at 667px without horizontal scrolling or overlap.
- [x] 3.3 Ensure tapping a compact summary selects the card for inspection without playing it.
- [x] 3.4 Preserve current full-card rendering and one-tap play behavior outside the landscape cockpit.

## 4. Full-card Overlay

- [x] 4.1 Extract or reuse shared full-card content so desktop cards and the overlay cannot drift in rules, bonuses, probability, tags, or illustration.
- [x] 4.2 Add a full-screen dialog that shows the selected card's complete current content and Illustrazione di Carta.
- [x] 4.3 Allow vertical scrolling inside the overlay while keeping the underlying Partita fixed.
- [x] 4.4 Add explicit Gioca and Concludi actions that use the existing play and shoot callbacks, then close the overlay.
- [x] 4.5 Preserve disabled reasons and prevent execution when the selected card is no longer playable.
- [x] 4.6 Implement close, Escape, focus trapping, and focus restoration behavior.

## 5. Dettagli Drawer

- [x] 5.1 Add a right-side overlay drawer with internal scrolling and responsive safe-area spacing.
- [x] 5.2 Move Allenatore, Squadra, Mazzo/Scarti, static sequence and combination reference, Registro, seed, Come si gioca, and Nuova Run into the landscape drawer.
- [x] 5.3 Keep active modifiers visible in the cockpit rather than only in Dettagli.
- [x] 5.4 Implement close, backdrop, Escape, dialog semantics, and focus restoration behavior.

## 6. Accessibility and Visual States

- [x] 6.1 Keep cockpit controls and compact hand summaries at least 44x44 CSS pixels.
- [x] 6.2 Provide visible focus, accessible names, and non-color-only states for compact cards, dialogs, drawer controls, and Termina Fase.
- [x] 6.3 Respect `prefers-reduced-motion` for overlay and drawer transitions.
- [x] 6.4 Ensure card overlay and Dettagli drawer cannot be open simultaneously.

## 7. Verification

- [x] 7.1 Run typecheck.
- [x] 7.2 Run existing game checks and confirm no engine or probability behavior changed.
- [x] 7.3 Run the production build.
- [x] 7.4 Verify the complete Partita loop at 667x375 with no document scroll or horizontal overflow.
- [x] 7.5 Verify the cockpit at 844x390 and 915x412, including safe-area spacing.
- [x] 7.6 Verify all five compact cards are visible and each opens the correct full-card overlay without playing immediately.
- [x] 7.7 Verify Gioca, Concludi, Termina Fase, overlay dismissal, and drawer dismissal through touch and keyboard input.
- [x] 7.8 Verify active modifiers, current Azione order, opponent chance, and best Conclusione update after each card play.
- [x] 7.9 Verify portrait remains scrollable with a non-blocking rotation suggestion.
- [x] 7.10 Verify desktop layout and existing one-tap card behavior remain unchanged.
- [x] 7.11 Verify current Safari on iOS and Chrome on Android, or their closest available device emulation, at the target viewports.
