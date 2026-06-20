## Context

The MVP already has Calciatori, Bonus Passivi, Tag Tattici, Combinazioni, Pericolosità, Copertura, and Sbilanciamento. The new variety layer should not turn the game into a class-based RPG: an Allenatore is a football-facing way to choose a starting deck, not a source of hidden powers.

The chosen structure is:

- 3 Allenatori.
- 1 Mazzo di Partenza per Allenatore.
- 15 cards per Mazzo di Partenza.
- 6 identity slots per deck: 3 Carte Identitarie with 2 copies each.
- 9 shared cards per deck, chosen from the existing common card pool.
- Common rewards after matches, with no Carte Identitarie in the reward pool.

## Allenatori and Starter Decks

### Maestro del Possesso

Theme: patient buildup, many Costruzione cards, reliable Pericolosità through coherent sequences.

Deck:

- 2x Giro palla paziente
- 2x Terzo uomo
- 2x Imbucata centrale
- 2x Passaggio corto
- 2x Cambio gioco
- 1x Verticalizzazione
- 1x Inserimento
- 1x Pressing
- 1x Ripiegamento
- 1x Tiro

### Specialista del Blocco Basso

Theme: high Copertura, opportunistic direct play, and stronger Piazzato conclusions.

Deck:

- 2x Linea compatta
- 2x Lancio lungo
- 2x Punizione studiata
- 2x Pressing
- 2x Ripiegamento
- 1x Marcatura
- 1x Calcio piazzato
- 1x Tiro piazzato
- 1x Passaggio corto
- 1x Tiro

### Allenatore d'Assalto

Theme: high Pericolosità, more conclusions, little defense, and explicit Copertura risk.

Deck:

- 2x Sovrapposizione continua
- 2x Attacco in area
- 2x Tiro di prima
- 2x Inserimento
- 1x Cross
- 1x Azione sulla fascia
- 1x Cambio gioco
- 1x Passaggio corto
- 2x Tiro
- 1x Pressing

## Carte Identitarie

All identity cards cost 1 Energia Tattica and are exclusive to their Mazzo di Partenza.

### Maestro del Possesso

- Giro palla paziente: Costruzione, tags `Centrale` and `Ampiezza`, +1 Pericolosità.
- Terzo uomo: Occasione, tag `Spazio`, +2 Pericolosità; +1 additional Pericolosità if at least one Costruzione was played earlier in the current Fase.
- Imbucata centrale: Conclusione, 25% base goal chance; +10% if at least two Costruzione cards were played earlier in the current Fase.

### Specialista del Blocco Basso

- Linea compatta: Difesa, +4 Copertura; +1 additional Copertura if the current Intenzione Avversaria is offensive.
- Lancio lungo: Supporto, +10% to the next Conclusione if the current Intenzione Avversaria is offensive.
- Punizione studiata: Conclusione, tag `Piazzato`, 30% base goal chance.

### Allenatore d'Assalto

- Sovrapposizione continua: Costruzione, tag `Ampiezza`, +3 Pericolosità, -1 Copertura.
- Attacco in area: Occasione, tag `Spazio`, +3 Pericolosità.
- Tiro di prima: Conclusione, 35% base goal chance.

## Rules

### Allenatore is not a passive

Selecting an Allenatore only selects the Mazzo di Partenza. It does not add a Bonus Passivo, change shared cards, or alter reward generation.

### Identity card exclusivity

Carte Identitarie are not part of the reward pool. The player can draw and play the copies already present in the selected Mazzo di Partenza, but cannot gain more copies from normal rewards.

### Tactical effects

Card effects should be modeled as reusable, typed Effetti Tattici rather than one-off card code. Required effects:

- Bonus to the next Conclusione during the current Fase.
- Extra Pericolosità if a required card type was played earlier in the current Fase.
- Extra Conclusione chance if a required count of a card type was played earlier in the current Fase.
- Extra Copertura if the current Intenzione Avversaria is offensive.
- Negative Copertura from an explicit card effect.

### Negative Copertura

Copertura can go below 0 only through cards that explicitly say they reduce Copertura. Negative Copertura increases opponent risk: if Minaccia is 4 and Copertura effettiva is -1, Minaccia residua is 5.

Sbilanciamento should not by itself push a non-negative Copertura below 0. If Copertura is already negative because of a card effect, Sbilanciamento stacks with that negative value.

## UI

The first screen should ask the player to choose one of the three Allenatori. Each option should show:

- Allenatore name.
- Stile di Gioco summary.
- The three Carte Identitarie.
- A compact deck composition summary.

During a Partita, card rendering should show Effetti Tattici clearly and live probabilities must include active tactical effects before the player commits to a Conclusione or Termina Fase.

## Risks / Trade-offs

- Strong identity cards may dominate rewards -> keep them exclusive and start with two copies each.
- Possesso may still feel close to the current deck -> its identity cards use sequence bonuses and flexible tags to make Costruzione more valuable.
- Blocco Basso may become too passive -> Punizione studiata and Lancio lungo give it a clear scoring plan.
- Assalto may become too swingy -> it has high goal access but only one common defensive card and explicit negative Copertura risk.
- Typed effects add engine complexity -> keep the first effect set small and reusable.
