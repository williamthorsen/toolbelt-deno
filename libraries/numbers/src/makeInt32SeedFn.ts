import { deriveMakeSeedFn, deriveSpawnSeedFn } from './deriveSeedFns.ts';
import { pickInteger } from './pickInteger.ts';

const MAX_INT_32 = 4294967295; // 2^32 - 1

export const makeInt32SeedFn = deriveMakeSeedFn(pickInteger)({ min: 1, max: MAX_INT_32 });
export const spawnInt32SeedFn = deriveSpawnSeedFn(makeInt32SeedFn);
