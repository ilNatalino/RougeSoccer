## Context

The MVP already has visible Intenzioni Avversarie, Pericolosità, Copertura, Conclusioni, and opponent goal probability. The player can currently shoot and then keep playing non-Conclusione cards with remaining Energia Tattica. That was acceptable for the first vertical slice, but it weakens the football feeling: a shot should commit the team to an outcome, and a missed shot against an attacking opponent should make the next defensive resolution more dangerous.

The domain glossary now distinguishes:

- **Minaccia**: the opponent's pressure and chance to score.
- **Copertura**: the player's defensive protection against Minaccia.
- **Sbilanciamento**: temporary vulnerability after a failed Conclusione against a visible Intenzione Offensiva.
- **Esposizione Avversaria**: the space conceded by an opponent while attacking.

This change implements those concepts in the existing frontend-only engine.

## Goals / Non-Goals

**Goals:**

- Make Conclusione a tactical commitment that closes player card play for the current Fase.
- Make failed shots against offensive intentions reduce Copertura effettiva through Sbilanciamento.
- Keep Sbilanciamento visible, deterministic, and easy to reason about.
- Make aggressive opponent intentions create attacking windows through Esposizione Avversaria.
- Keep all formulas centralized and deterministic.
- Preserve the explicit Termina Fase button so the player remains in control of when opponent resolution happens.

**Non-Goals:**

- No second Conclusione, rebounds, corner kicks, or saved-shot outcome types yet.
- No hidden counterattack against Intenzioni Difensive.
- No automatic phase ending immediately after a Conclusione.
- No new card types or new opponents.
- No persistence, backend, animation system, or football simulation timeline.
- No variable Sbilanciamento based on shot card, distance, roll margin, or card tags in this change.

## Decisions

### Conclusione closes player card play, but Termina Fase remains explicit

After any Conclusione attempt, the player cannot play additional cards in that Fase, including defensive cards. The player still clicks Termina Fase to resolve the opponent intention and proceed.

This preserves UI clarity: the shot is a commitment, but the player can inspect the changed risk before advancing.

Alternative considered: automatically ending the Fase after a Conclusione. That is more direct, but it hides the tactical consequence too quickly and removes the chance to inspect Sbilanciamento before resolution.

### Sbilanciamento is created only by failed Conclusioni against visible offensive intentions

Sbilanciamento happens when all of these are true:

- the player attempts a Conclusione;
- the Conclusione fails;
- the current Intenzione Avversaria is offensive.

Sbilanciamento does not happen when the shot scores, because the narrative resets from kickoff. It also does not happen against defensive intentions, because that would create a hidden attack the player could not read from the visible intention.

### Sbilanciamento reduces Copertura effettiva

Sbilanciamento reduces Copertura for the opponent scoring calculation:

```text
Copertura effettiva = max(0, Copertura - Sbilanciamento)
Minaccia residua = max(0, Minaccia - Copertura effettiva)
```

This models the player's structure breaking after a failed attack. It deliberately affects the player's previously built defensive shape, which makes the decision to shoot more meaningful.

Alternative considered: adding Sbilanciamento to Minaccia. That is simpler mathematically, but it makes defensive cards feel less directly connected to the risk. Reducing Copertura better matches the intended football reading: the team is less covered after missing.

### Sbilanciamento values are fixed for the MVP Basic

Initial values:

| Situation | Sbilanciamento |
| --- | ---: |
| Failed Conclusione against a normal Intenzione Offensiva | 2 |
| Failed Conclusione against Contropiede | 3 |

These values are intentionally coarse. They should be easy to read in the UI and easy to tune after playtesting.

### Esposizione Avversaria is a direct goal-chance bonus

Esposizione Avversaria increases the player's Conclusione probability directly:

```text
Probabilita gol =
base Conclusione
+ Pericolosita * 5%
+ bonus Combinazioni
+ Bonus Passivi
+ Esposizione Avversaria
- penalita Intenzione Difensiva
- Difesa avversaria * 5%
```

It does not reduce the opponent's Difesa stat. Difesa remains a stable opponent identity; Esposizione Avversaria is a temporary tactical window created by the current intention.

Initial values:

| Intenzione Offensiva | Potenza base Minaccia | Esposizione Avversaria |
| --- | ---: | ---: |
| Attacco paziente | 1 | +0% |
| Attacco centrale | 2 | +5% |
| Contropiede | 3 | +5% |
| Assalto finale | 4 | +15% |

### Live UI feedback is required

If a failed Conclusione creates Sbilanciamento, the UI must immediately update:

- Sbilanciamento value.
- Copertura effettiva.
- opponent goal probability.
- disabled state for all remaining cards.

The player should never be surprised by a changed opponent chance only after clicking Termina Fase.

## Implementation Notes

The likely implementation shape is:

- Add `exposureBonus?: number` to `IntentionDefinition`.
- Add phase-local Sbilanciamento to `MatchState`, for example `imbalance: number`.
- Add helper functions in `rules.ts` for:
  - `getIntentionExposureBonus`.
  - `getShotFailureImbalance`.
  - `getEffectiveCoverage`.
- Extend `calculateGoalChance` to include Esposizione Avversaria in the breakdown.
- Extend `calculateOpponentGoalChance` to use Copertura effettiva.
- Update `shoot` so failed Conclusioni set Sbilanciamento when applicable.
- Update `playCard` and `shoot` so no card can be played after `shotTaken`.
- Reset Sbilanciamento at the start of each new Fase.
- Update UI labels and card disabled states.

## Risks / Trade-offs

- The rule may make offensive play feel punishing if numbers are too high. Start with fixed values and verify match goal rates.
- Blocking all cards after a shot makes energy sequencing stricter. The UI must communicate this clearly before and after shooting.
- Esposizione Avversaria increases scoring against aggressive opponents; combined with Sbilanciamento, some phases become high-variance. That is intended, but should be tested against the 2-4 total goals target.
- Adding another displayed number may clutter the HUD. Prefer showing Copertura effettiva only when it differs from Copertura, with Sbilanciamento nearby.
