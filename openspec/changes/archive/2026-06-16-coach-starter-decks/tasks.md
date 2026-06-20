## 1. Domain Types and Static Data

- [x] 1.1 Add Allenatore and Mazzo di Partenza types, including a stable coach id and starter deck entries.
- [x] 1.2 Add the three Allenatori: Maestro del Possesso, Specialista del Blocco Basso, and Allenatore d'Assalto.
- [x] 1.3 Add the nine Carte Identitarie with stable card ids, costs, types, tags, descriptions, and typed Effetti Tattici.
- [x] 1.4 Replace the single starter deck definition with three 15-card starter deck definitions.
- [x] 1.5 Keep the reward pool common and exclude every Carta Identitaria.

## 2. Tactical Effects and Rules

- [x] 2.1 Add typed support for current-Fase Conclusione chance bonuses.
- [x] 2.2 Add typed support for bonuses based on card types already played in the current Fase.
- [x] 2.3 Add typed support for effects conditional on offensive Intenzione Avversaria.
- [x] 2.4 Allow explicit negative Copertura effects on cards.
- [x] 2.5 Update opponent chance calculation so negative Copertura increases Minaccia residua while Sbilanciamento alone cannot push non-negative Copertura below 0.
- [x] 2.6 Ensure live Conclusione and opponent goal probability breakdowns include active Effetti Tattici.

## 3. Game Engine Flow

- [x] 3.1 Update run creation so starting a run requires an Allenatore selection.
- [x] 3.2 Build the initial owned deck from the selected Allenatore's Mazzo di Partenza.
- [x] 3.3 Store the selected Allenatore on RunState for UI display and debugging.
- [x] 3.4 Keep Calciatori assignment and Bonus Passivi independent from Allenatore selection.
- [x] 3.5 Keep reward generation independent from Allenatore selection.

## 4. User Interface

- [x] 4.1 Replace the immediate new-run action with an Allenatore selection screen.
- [x] 4.2 Show each Allenatore's Stile di Gioco, identity cards, and deck composition before selection.
- [x] 4.3 Show the selected Allenatore during the run.
- [x] 4.4 Render Effetti Tattici on cards in hand, played-card logs, and probability breakdowns where relevant.
- [x] 4.5 Ensure mobile layout can compare the three Allenatori without text overflow.

## 5. Verification

- [x] 5.1 Add deterministic checks that each Mazzo di Partenza has exactly 15 cards, 6 identity slots, and 9 shared-card slots.
- [x] 5.2 Add checks that every Carta Identitaria is exclusive to one Mazzo di Partenza and absent from the reward pool.
- [x] 5.3 Add checks for Lancio lungo's offensive-intention Conclusione bonus.
- [x] 5.4 Add checks for Terzo uomo and Imbucata centrale sequence conditions.
- [x] 5.5 Add checks for Linea compatta's offensive-intention Copertura bonus.
- [x] 5.6 Add checks that Sovrapposizione continua can make Copertura negative and that negative Copertura increases opponent scoring risk.
- [x] 5.7 Run typecheck, tests, and production build.
