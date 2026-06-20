# Football Roguelike

This context describes the domain language for a roguelike football game where a coach guides a team through a short sequence of tactical matches.

## Language

**Run**:
A complete attempt made of a sequence of matches, rewards, and events, ending in either failure or completion. The game may present a run as a season in the interface, but the domain concept is not a league season with standings.
_Avoid_: Season, campaign, championship

**Allenatore**:
A selectable run identity chosen before the first Partita, used to choose the player's Mazzo di Partenza through a specific Stile di Gioco. It is a football-facing framing for deck choice, not a directly controlled character or an extra passive bonus during a Partita.
_Avoid_: Hero, commander, avatar

**Stile di Gioco**:
The football identity expressed by an Allenatore through a Mazzo di Partenza, shaping the tactical patterns the player's deck wants to build. It should describe a recognizable football approach rather than a generic RPG class or hidden rule modifier.
_Avoid_: Archetype, class, build

**Mazzo di Partenza**:
The initial set of tactical cards the player brings into a Run, chosen through an Allenatore before the first Partita. It defines the starting deck identity only; later rewards may change the deck without being bound to the Allenatore.
_Avoid_: Loadout, card pool, draw pile

**Carta Identitaria**:
A tactical card exclusive to a specific Mazzo di Partenza, expressing its Stile di Gioco more strongly than the shared cards. It is a distinct card, not a version of a shared card secretly powered up by the Allenatore.
_Avoid_: Upgraded card, class card, hidden buff

**Effetto Tattico**:
A visible consequence printed on a card that changes the current Fase or the next Conclusione in a specific, reusable way. It should remain understandable as a football action, not as arbitrary card-game scripting.
_Avoid_: Special power, custom script, hidden trigger

**Illustrazione di Carta**:
A small pixel-art visual printed near the top of a tactical card, representing the specific football action named by that card. It communicates the card's theme and should not replace the written Effetto Tattico or other printed rules text.
_Avoid_: Generic card icon, rules diagram, hidden effect indicator

**Partita**:
A short tactical contest between the player's team and one opponent, resolved through a fixed number of phases and ending with a win, loss, or draw according to its stakes. It abstracts a football match rather than simulating real minutes.
_Avoid_: Match simulation, fixture, real-time match

**Fase**:
One decisive tactical segment inside a Partita where the player responds to the opponent's visible intent while deciding how much to invest in attack or defense. A Fase is not a literal minute or possession.
_Avoid_: Turn, minute, possession

**Intenzione Avversaria**:
The opponent's visible tactical plan for the current Fase, giving the player enough information to judge the risk of ignoring it or the value of countering it. Every Fase has exactly one visible Intenzione Avversaria.
_Avoid_: Hidden AI action, random attack, enemy move

**Intenzione Offensiva**:
An Intenzione Avversaria that creates Minaccia and can lead to an opponent goal if the player does not create enough Copertura.
_Avoid_: Enemy attack roll, danger event

**Intenzione Difensiva**:
An Intenzione Avversaria that makes the player's Azione or Conclusione less effective without directly threatening a goal.
_Avoid_: Azione difensiva avversaria, passive turn, no-op, wall

**Mazzo Intenzioni**:
The small set of Intenzioni Avversarie an opponent draws from during a Partita. It gives each opponent a predictable tactical identity without requiring a complex AI.
_Avoid_: AI script, behavior tree, random table

**Pericolosità**:
The offensive quality built by the player's played cards during a Fase, used when attempting a conclusion. It describes the player's chance-creating momentum, not the opponent's attack.
_Avoid_: Threat, attack value, enemy danger

**Minaccia**:
The offensive pressure created by the current Intenzione Avversaria before the player's defensive response. It describes the opponent's chance to score, not the player's attack.
_Avoid_: Pericolosità avversaria, enemy danger, attack value

**Esposizione Avversaria**:
The vulnerability created by an opponent's Intenzione Offensiva when it commits players forward and leaves space for the player's Azione or Conclusione. It describes the opportunity the opponent gives away while attacking, not the danger it creates.
_Avoid_: Offensività, Pericolosità avversaria, hidden weakness

**Copertura**:
The defensive protection built or lost by the player's played cards during a Fase, used to reduce the opponent's Minaccia. It can become negative when risky attacking cards expose the team, and it is not a permanent team defense stat.
_Avoid_: Defense points, block, shield, Scopertura

**Sbilanciamento**:
A temporary vulnerability created when the player attempts a Conclusione and does not score while the opponent already has an Intenzione Offensiva. It reduces the player's effective Copertura against that visible offensive intention, but it is not a hidden counterattack and is not created by a successful Conclusione.
_Avoid_: Hidden counterattack, permanent defense loss, post-goal risk

**Conclusione**:
A decisive scoring attempt made by the player's team after building enough Pericolosità during a Fase. It closes the current Azione and is the moment where an offensive action becomes a shot-like outcome.
_Avoid_: Shot card, finisher, attack roll

**Azione**:
The player's offensive sequence within a Fase, built through tactical cards and potentially ending in a Conclusione. Once a Conclusione is attempted, the Azione is resolved. An Azione is not the same thing as the Fase that contains it.
_Avoid_: Attack phase, offensive turn, possession

**Costruzione**:
The early development of an Azione, where the player's cards create the conditions for a better scoring attempt. It improves a later Conclusione but is not required before attempting one.
_Avoid_: Mandatory opener, setup phase

**Occasione**:
The chance-creation moment of an Azione, where the player's cards turn prior buildup into a more concrete scoring opportunity. It improves a later Conclusione but is not required before attempting one.
_Avoid_: Required chance, assist phase

**Combinazione**:
A meaningful pairing or sequence of cards played within the same Fase, using compatible tactical tags to make an Azione more effective than the same cards played without synergy. It rewards coherent football patterns without requiring exact card recipes.
_Avoid_: Combo lock, recipe, required chain

**Bonus di Sequenza**:
A temporary benefit earned when the player develops an Azione in a coherent order, such as moving from Costruzione to Occasione before attempting a Conclusione. It rewards the shape of the Azione without replacing Tag Tattici or requiring exact card recipes.
_Avoid_: Combinazione, mandatory chain, card recipe

**Tag Tattico**:
A visible tactical label on a card that describes the kind of football pattern it belongs to and can interact with other compatible tags. Tags are used to recognise Combinazioni without depending on exact card names.
_Avoid_: Hidden combo key, card recipe, keyword puzzle

**Energia Tattica**:
The fixed amount of tactical resource the player can spend on cards during each Fase. In the basic MVP it is a stable constraint, not a resource the player generates or stores.
_Avoid_: Mana, stamina, action points

**Squadra**:
The player's compact group assigned at the start of a Run, made of one Icona and two Calciatori Comuni, giving the deck a tactical identity through passive bonuses independently from the Allenatore. It is fixed during the Run and is not a full football squad with substitutions, contracts, or formation management.
_Avoid_: Full roster, club, formation

**Calciatore**:
A member of the Squadra whose role is expressed through a passive bonus to relevant cards, tags, or tactical outcomes. A Calciatore is not directly controlled during a Partita.
_Avoid_: Controllable player, unit, squad member

**Icona**:
A rare Calciatore with an evocative, fictional identity inspired by football legends, assigned once per Squadra and defined by a more impactful Bonus Passivo than a Calciatore Comune. An Icona is not a playable tactical card, does not use real player names, and is not manually activated during a Partita.
_Avoid_: Real player name, legendary card, hero power, activated ability

**Calciatore Comune**:
A standard Calciatore assigned alongside an Icona at the start of a Run, providing a focused Bonus Passivo with lower impact than an Icona. Existing ordinary Calciatori belong to this category, which distinguishes them from rare football icons without making them directly controllable.
_Avoid_: Normal card, filler player, unit

**Bonus Passivo**:
A persistent modifier, or small set of related modifiers, provided by a Calciatore that affects matching cards or tactical outcomes without being manually activated. It should shape play style without adding a new action choice, even when an Icona makes it more impactful.
_Avoid_: Active ability, triggered skill, consumable buff
