import { deriveMakeSeedFn, deriveSpawnSeedFn } from './deriveSeedFns.ts';
import { pickInteger } from './pickInteger.ts';

/**
 * @deprecated Use `IntSeed#seedFn` instead.
 */
export const makeIntSeedFn = deriveMakeSeedFn(pickInteger)({ min: 1 });

/**
 * @deprecated Use `IntSeed.spawn` instead.
 */
export const spawnIntSeedFn = deriveSpawnSeedFn(makeIntSeedFn);
