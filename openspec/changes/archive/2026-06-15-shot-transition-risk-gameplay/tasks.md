## 1. Domain And Spec Alignment

- [x] 1.1 Update the domain glossary so Conclusione closes Azione.
- [x] 1.2 Add Sbilanciamento as a temporary vulnerability that reduces Copertura effettiva after a failed Conclusione against an Intenzione Offensiva.
- [x] 1.3 Add Esposizione Avversaria as the space conceded by an opponent while attacking.
- [x] 1.4 Update the MVP design document with fixed Sbilanciamento values, Esposizione Avversaria values, and immediate UI feedback requirements.

## 2. Type And Data Model

- [x] 2.1 Add `exposureBonus?: number` to `IntentionDefinition`.
- [x] 2.2 Add phase-local Sbilanciamento to `MatchState`.
- [x] 2.3 Add Sbilanciamento and Copertura effettiva fields to `OpponentChanceBreakdown`.
- [x] 2.4 Add Esposizione Avversaria to `GoalChanceBreakdown`.
- [x] 2.5 Update offensive intention data:
  - Attacco paziente: `baseThreat: 1`, `exposureBonus: 0`.
  - Attacco centrale: `baseThreat: 2`, `exposureBonus: 5`.
  - Contropiede: `baseThreat: 3`, `exposureBonus: 5`.
  - Assalto finale: `baseThreat: 4`, `exposureBonus: 15`.
- [x] 2.6 Update intention descriptions so the UI exposes both Minaccia and Esposizione Avversaria.

## 3. Rule Calculations

- [x] 3.1 Add `getIntentionExposureBonus(intention)` returning 0 for non-offensive or missing exposure values.
- [x] 3.2 Add `getShotFailureImbalance(intention)`:
  - returns 0 for defensive intentions;
  - returns 3 for Contropiede;
  - returns 2 for other offensive intentions.
- [x] 3.3 Add `getEffectiveCoverage(coverage, imbalance)` using `max(0, coverage - imbalance)`.
- [x] 3.4 Extend player goal chance calculation with Esposizione Avversaria.
- [x] 3.5 Extend opponent goal chance calculation with Sbilanciamento and Copertura effettiva.
- [x] 3.6 Keep all final goal probabilities clamped to the existing 10%-85% range.
- [x] 3.7 Ensure defensive intentions still apply only their existing player-side penalties and do not create hidden opponent scoring chances.

## 4. Engine State Transitions

- [x] 4.1 Initialize Sbilanciamento to 0 when a match and each Fase starts.
- [x] 4.2 Reset Sbilanciamento to 0 when advancing to a new Fase.
- [x] 4.3 Update `shoot` so a successful Conclusione never creates Sbilanciamento.
- [x] 4.4 Update `shoot` so a failed Conclusione against an offensive intention sets Sbilanciamento to the value from `getShotFailureImbalance`.
- [x] 4.5 Update `shoot` so a failed Conclusione against a defensive intention leaves Sbilanciamento at 0.
- [x] 4.6 Update `playCard` to reject all card play after `shotTaken`, with a clear log message.
- [x] 4.7 Update `shoot` to reject any further card use after `shotTaken`.
- [x] 4.8 Keep Termina Fase explicit after a Conclusione; do not auto-advance the phase.
- [x] 4.9 Ensure `endPhase` uses Copertura effettiva for opponent scoring resolution.
- [x] 4.10 Ensure hand and played cards are still discarded normally when Termina Fase resolves.

## 5. Match UI

- [x] 5.1 Disable every card in hand after a Conclusione, not only other Conclusioni.
- [x] 5.2 Show a clear disabled reason for cards after a Conclusione, such as "Azione conclusa".
- [x] 5.3 Show Esposizione Avversaria on offensive intention panels when the value is greater than 0.
- [x] 5.4 Include Esposizione Avversaria in Conclusione probability breakdowns.
- [x] 5.5 Show Sbilanciamento after a failed Conclusione when it is greater than 0.
- [x] 5.6 Show Copertura effettiva when it differs from Copertura.
- [x] 5.7 Update opponent goal probability immediately after Sbilanciamento is created.
- [x] 5.8 Keep Termina Fase visually available after a Conclusione.
- [x] 5.9 Make sure mobile card layout still fits the new risk labels without text overlap.

## 6. Verification

- [x] 6.1 Add deterministic checks that Esposizione Avversaria increases player goal chance by the configured amount.
- [x] 6.2 Add checks that failed Conclusione against Attacco centrale creates Sbilanciamento 2.
- [x] 6.3 Add checks that failed Conclusione against Contropiede creates Sbilanciamento 3.
- [x] 6.4 Add checks that successful Conclusione creates no Sbilanciamento.
- [x] 6.5 Add checks that failed Conclusione against Blocco basso or Pressing avversario creates no Sbilanciamento.
- [x] 6.6 Add checks that Copertura effettiva never goes below 0.
- [x] 6.7 Add checks that no card type can be played after shotTaken.
- [x] 6.8 Run TypeScript checks.
- [x] 6.9 Run production build.
- [x] 6.10 Manually verify in browser:
  - shooting disables all cards;
  - failed shot updates Sbilanciamento and opponent chance immediately;
  - Contropiede applies the higher Sbilanciamento;
  - Assalto finale shows higher Esposizione Avversaria;
  - Termina Fase remains the explicit advance action.

## 7. Balance Review

- [x] 7.1 Play at least three seeded runs and record approximate goals per match.
- [x] 7.2 Check whether the current 2-4 total goals target still holds.
- [x] 7.3 If goal totals spike, tune Esposizione Avversaria before changing Sbilanciamento.
- [x] 7.4 If failed shots feel too punishing, tune Sbilanciamento values before changing opponent Minaccia.
- [x] 7.5 Update the MVP design document if balance values change.
