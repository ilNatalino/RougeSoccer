## Context

The MVP already uses tactical cards as the player's main interaction surface during each Fase. The current rendering emphasizes rules text and lightweight type color, but it does not visually distinguish the football action represented by each card.

The resolved domain term is Illustrazione di Carta: a small pixel-art visual printed near the top of a tactical card. It represents the card's named football action and does not replace written Effetti Tattici or other rules text.

## Art Direction

The card illustration style is:

- Pixel art.
- Figurative, with tactical accents.
- Implemented as inline SVG sprites with `shape-rendering: crispEdges`.
- Unique for every current card.
- Consistent in frame size, grid feel, line weight, and readability.
- Free to vary the internal scene, so cards do not all share the same field background.

Each sprite should communicate a concrete football action. Examples:

- Punizione studiata: a free-kick taker, defensive wall, goal, and curved ball path.
- Pressing: two defenders closing a ball carrier.
- Cambio gioco: a diagonal switch across the field.
- Lancio lungo: a direct long pass into space.

## Card Layout

The card hierarchy should be:

1. Type and cost in a compact top row.
2. Card name.
3. Pixel-art illustration in the upper-middle area.
4. Written effects in the lower half.
5. Tags in the footer.

The lower-card area should include:

- Base description, such as `+2 Pericolosità` or `30% gol base`.
- Printed Effetti Tattici.
- Dynamic squad bonuses and tactical bonuses when relevant.
- Live Conclusione chance and compact chance breakdown when relevant.
- Disabled reason when relevant.

The effect text must stay visible and readable. The sprite is a recognition aid, not a replacement for rules text.

## Card Coverage

The implementation should cover all 21 existing cards:

### Shared Cards

- Passaggio corto: short central pass between teammates.
- Cambio gioco: diagonal switch from one side to the opposite flank.
- Inserimento: runner attacking space behind the line.
- Cross: wide player crossing into the box.
- Tiro: shooter striking from open play.
- Pressing: coordinated pressure around the ball carrier.
- Ripiegamento: players dropping back into defensive shape.
- Verticalizzazione: vertical pass breaking lines.
- Tiro piazzato: controlled placed shot toward the corner.
- Marcatura: defender tightly marking an attacker.
- Azione sulla fascia: wide dribble or overlap down the flank.
- Calcio piazzato: dead-ball setup before delivery.

### Carte Identitarie

- Giro palla paziente: patient circulation with multiple passing lanes.
- Terzo uomo: third-man run receiving after a layoff.
- Imbucata centrale: central through ball into shooting space.
- Linea compatta: compact defensive line.
- Lancio lungo: long ball behind an exposed opponent.
- Punizione studiata: rehearsed free kick with wall and planned path.
- Sovrapposizione continua: repeated overlapping run wide.
- Attacco in area: multiple attackers crashing the box.
- Tiro di prima: first-time shot from a pass.

## Identity Card Treatment

Carte Identitarie should receive a subtle visual distinction:

- A slightly more prestigious card border, inset pattern, or sprite frame.
- No different card size.
- No rarity label.
- No hidden gameplay implication.

The treatment should reinforce deck identity without conflicting with the glossary definition of Carta Identitaria.

## Technical Shape

Recommended implementation:

- Add a `CardIllustration` React component.
- Map `card.id` to a sprite renderer or structured sprite definition.
- Keep sprite definitions near presentation code unless they become large enough to justify a dedicated module.
- Use SVG primitives snapped to a small coordinate grid.
- Use a fallback sprite for unknown future `card.id` values.
- Share the illustration component between hand cards and reward cards.

## Risks / Trade-offs

- Richer cards can become too tall or dense -> use stable illustration dimensions and compact chip layout.
- Unique sprites can drift stylistically -> keep the same grid, frame size, stroke approach, and palette rules.
- Sprite code can bloat the main component -> extract a small sprite module if the inline component becomes hard to scan.
- Identity treatment can read as RPG rarity -> keep it subtle and avoid rarity language.
