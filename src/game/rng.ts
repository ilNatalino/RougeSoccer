import type { RngState } from "./types";

export function createRunSeed(): string {
  const time = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 16_777_216)
    .toString(36)
    .toUpperCase()
    .padStart(5, "0");

  return `RUN-${time}-${random}`;
}

export function createRng(seed: string): RngState {
  return {
    seed,
    state: hashSeed(seed),
  };
}

export function nextFloat(rng: RngState): { rng: RngState; value: number } {
  let state = (rng.state + 0x6d2b79f5) >>> 0;
  let value = state;

  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

  return {
    rng: { seed: rng.seed, state },
    value: ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296,
  };
}

export function randomInt(
  rng: RngState,
  minInclusive: number,
  maxExclusive: number,
): { rng: RngState; value: number } {
  const next = nextFloat(rng);
  return {
    rng: next.rng,
    value:
      minInclusive +
      Math.floor(next.value * (maxExclusive - minInclusive)),
  };
}

export function shuffle<T>(
  items: readonly T[],
  rng: RngState,
): { rng: RngState; items: T[] } {
  const shuffled = [...items];
  let nextRng = rng;

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const roll = randomInt(nextRng, 0, index + 1);
    nextRng = roll.rng;
    [shuffled[index], shuffled[roll.value]] = [
      shuffled[roll.value],
      shuffled[index],
    ];
  }

  return { rng: nextRng, items: shuffled };
}

export function chooseManyDistinct<T>(
  items: readonly T[],
  count: number,
  rng: RngState,
): { rng: RngState; items: T[] } {
  const result = shuffle(items, rng);
  return {
    rng: result.rng,
    items: result.items.slice(0, Math.min(count, result.items.length)),
  };
}

export function rollPercent(
  rng: RngState,
  chancePercent: number,
): { rng: RngState; success: boolean; roll: number } {
  const next = nextFloat(rng);
  const roll = Math.floor(next.value * 100) + 1;

  return {
    rng: next.rng,
    roll,
    success: roll <= chancePercent,
  };
}

function hashSeed(seed: string): number {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0) || 1;
}
