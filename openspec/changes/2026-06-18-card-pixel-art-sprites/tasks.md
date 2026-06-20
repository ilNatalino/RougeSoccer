## 1. Card Illustration Model

- [ ] 1.1 Add a reusable `CardIllustration` component that receives a `CardDefinition` or card id.
- [ ] 1.2 Render illustrations as inline SVG sprites with crisp pixel edges.
- [ ] 1.3 Add a fallback sprite for future cards without bespoke illustrations.
- [ ] 1.4 Add a shared frame/grid convention so all sprites have stable dimensions.

## 2. Sprite Coverage

- [ ] 2.1 Add bespoke sprites for all shared cards: Passaggio corto, Cambio gioco, Inserimento, Cross, Tiro, Pressing, Ripiegamento, Verticalizzazione, Tiro piazzato, Marcatura, Azione sulla fascia, and Calcio piazzato.
- [ ] 2.2 Add bespoke sprites for Maestro del Possesso Carte Identitarie: Giro palla paziente, Terzo uomo, and Imbucata centrale.
- [ ] 2.3 Add bespoke sprites for Specialista del Blocco Basso Carte Identitarie: Linea compatta, Lancio lungo, and Punizione studiata.
- [ ] 2.4 Add bespoke sprites for Allenatore d'Assalto Carte Identitarie: Sovrapposizione continua, Attacco in area, and Tiro di prima.
- [ ] 2.5 Ensure every sprite communicates the card's named football action rather than only its card type or Tag Tattico.

## 3. Card Layout

- [ ] 3.1 Update HandCard to show type/cost, name, sprite, compact lower-card effects, dynamic bonuses, chance information, disabled reason, and tags.
- [ ] 3.2 Update RewardCard to use the same card visual language and sprite component.
- [ ] 3.3 Keep base description and Effetti Tattici in the lower half of the card.
- [ ] 3.4 Keep live Conclusione chance and dynamic bonus information visible in compact form.
- [ ] 3.5 Add a subtle visual treatment for Carte Identitarie without adding rarity language or changing card size.
- [ ] 3.6 Fix Supporto card styling so `type-supporto` receives the intended type tint.

## 4. Responsive Styling

- [ ] 4.1 Define stable sprite dimensions for hand and reward cards.
- [ ] 4.2 Adjust card min-heights and spacing so the hand stays readable on desktop and mobile.
- [ ] 4.3 Ensure text does not overlap sprites, chips, goal chance badges, or tags.
- [ ] 4.4 Ensure cards remain keyboard/button accessible after layout changes.

## 5. Verification

- [ ] 5.1 Run typecheck.
- [ ] 5.2 Run existing game checks.
- [ ] 5.3 Run production build.
- [ ] 5.4 Open the local app and visually inspect the hand and reward card layouts on desktop.
- [ ] 5.5 Inspect a mobile viewport and verify card text, sprites, and tags do not overlap.
- [ ] 5.6 Confirm at least one card of each type, including Supporto, shows the correct visual tint.
- [ ] 5.7 Confirm Carte Identitarie are visually distinct but do not imply a new gameplay rule.
