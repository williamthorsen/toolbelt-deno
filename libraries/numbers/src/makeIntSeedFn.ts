import { deriveMakeSeedFn, deriveSpawnSeedFn } from './deriveSeedFns.ts';
import { pickInteger } from './pickInteger.ts';

export const makeIntSeedFn = deriveMakeSeedFn(pickInteger)({ min: 1 });
export const spawnIntSeedFn = deriveSpawnSeedFn(makeIntSeedFn);
