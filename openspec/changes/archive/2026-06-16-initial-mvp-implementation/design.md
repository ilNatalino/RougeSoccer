## Context

The repository currently contains the MVP Basic design document and domain glossary, but no runnable application. The MVP is a single-player football roguelike with a short five-match run, tactical card play, visible opponent intentions, simple deck growth, and no persistence or backend.

The implementation should get to a playable loop quickly while keeping the rules easy to test and rebalance. Next.js is the chosen application shell, but the gameplay remains entirely client-side.

## Goals / Non-Goals

**Goals:**

- Build the first playable MVP Basic as a Next.js frontend-only app.
- Keep game state in memory for the active browser session.
- Keep card, player, opponent, and intention data as static typed data.
- Separate deterministic game rules from React components.
- Make the core loop playable before adding polish: new run, squad reveal, match, reward, next match, boss, victory/game over.

**Non-Goals:**

- No backend API, server actions, database, authentication, or persistence.
- No multiplayer, map, shop, events, card upgrades, card removal, or meta-progression.
- No direct footballer control, animated pitch simulation, 3D scene, or real-time match simulation.
- No manual seed entry in the initial UI.

## Decisions

### Use Next.js as the app shell

Use the App Router with a single client-side page for the playable MVP. Next.js gives us project structure, dev server, build tooling, and a straightforward path to richer screens later.

Alternative considered: Vite + React. It is lighter, but the user explicitly chose Next.js and the MVP does not need Vite-specific simplicity.

### Keep gameplay frontend-only and in memory

The run state lives in React state and resets on page reload. This matches the MVP scope and avoids storage edge cases around partially completed runs, stale schemas, and rollback.

Alternative considered: localStorage persistence. It would make reloads friendlier, but the MVP run is short and persistence is explicitly out of scope.

### Implement a small local game engine instead of wiring an external turn engine first

Create pure TypeScript modules for data, RNG, rules, and state transitions. React components call explicit actions such as `startRun`, `playCard`, `shoot`, `endPhase`, `chooseReward`, and `skipReward`.

Alternative considered: boardgame.io. It remains a good candidate if the game later needs formal move logs, multiplayer, bots, or richer turn orchestration. For this first frontend-only slice, a small local engine has less integration overhead and keeps the domain terms directly visible.

### Store all MVP content as typed static data

Cards, calciatori, opponents, intentions, starter deck composition, reward pool, and combination rules live in static TypeScript data. This makes the first balancing pass cheap and avoids building editors or data pipelines.

Alternative considered: JSON files. TypeScript data is easier for the first pass because card effects and ids can stay type-checked without writing loaders.

### Use seeded RNG for reproducibility

Each run creates an automatic seed and routes all random choices through a small deterministic RNG helper. The UI may display the seed for debugging, but the MVP does not support manual seed entry.

Alternative considered: `Math.random`. It is faster to write, but makes run bugs and balance reports harder to reproduce.

## Risks / Trade-offs

- Custom engine grows messy as features expand -> Keep the engine pure, typed, and small; move to a formal game framework only when the complexity appears.
- Balance may feel too random or too harsh -> Keep probabilities visible, clamp scoring chances, and centralize formulas in `rules.ts`.
- UI could become crowded with tactical numbers -> Prioritize the required match HUD and defer extra explanations or animations.
- Static data can become hard to edit later -> Keep content arrays clean and use stable ids so they can migrate to JSON or tooling later.
- No persistence can frustrate reloads -> Accept for MVP Basic because runs are short and persistence is explicitly out of scope.
