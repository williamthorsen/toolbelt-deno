import { getFakeMathRandom } from './getFakeMathRandom.ts';
import type { EmptyObject } from './numbers.types.ts';
import { pickInteger } from './pickInteger.ts';
import { wrapSum } from './wrapSum.ts';
import type { DeterministicRng, Seed } from './evaluateSeed.ts';
import { evaluateSeed } from './evaluateSeed.ts';

/**
 * Class that manages a pseudo-random number generator that behaves deterministically when given a seed.
 */
export class SeededRng implements DeterministicRng {
  preset: 'int' | 'int32' | 'standard' = 'standard'; // TODO: make this a private property

  private _seed = 0; // internally incremented value to provide deterministic behaviour
  private baseSeed = 0; // original value used to create the seed
  private maxBase = Number.MAX_SAFE_INTEGER;
  private nIncrements = 0;

  private generateBase: () => number = this.standardGenerateBase;
  private generateValue: () => number = this.standardGenerateValue;

  // Resolves a seed-like value to a number
  static evaluateSeed(seed?: Seed | undefined) {
    return evaluateSeed(seed);
  }

  // Creates a child; does not mutate the parent seed
  // By default, the child's base is incremented by 1 to produce a different output than the parent
  // while still being deterministic. Set nIncrements to 0 to produce the same output.
  static clone(seed?: undefined, nIncrements?: number): undefined;
  static clone(seed: Seed, nIncrements?: number): SeededRng;
  static clone(seed: Seed | undefined, nIncrements = 1): SeededRng | undefined {
    if (seed instanceof SeededRng) {
      return SeededRng.create(seed.seed, { preset: seed.preset }).increment(nIncrements);
    }
  }

  static int(seed?: Seed): SeededRng {
    return SeededRng.create(seed, { preset: 'int' });
  }

  static int32(seed?: Seed): SeededRng {
    return SeededRng.create(seed, { preset: 'int32' });
  }

  // Creates a child; mutates the input seed, if it is a Seed instance or generator
  static spawn(seed?: undefined): undefined;
  static spawn(seed: Seed): SeededRng;
  static spawn(seed?: Seed): SeededRng | undefined {
    if (seed === undefined) {
      return undefined;
    }
    const preset = seed instanceof SeededRng ? seed.preset : undefined;
    return SeededRng.create(seed, { preset });
  }

  /**
   * Given a seed-acception function and an optional seed, returns a new function that passes the seed to the function.
   */
  static withSeed<TOptions extends object, R>(
    fn: (options?: OptionsWithSeed<TOptions> | OptionsWithSeed<EmptyObject>) => R,
    seed: Seed | undefined,
  ) {
    const spawnedRng = SeededRng.spawn(seed); // stored outside the function to create a closure
    return function (options?: TOptions) {
      return fn({ ...options, seed: spawnedRng });
    };
  }

  /**
   * Constructor
   */
  constructor(seed?: Seed) {
    this.initializeSeeds(SeededRng.evaluateSeed(seed) ?? this.generateBase());
  }

  // Returns a function that successively returns a deterministic sequence of numbers based on this instance's seed
  get rng(): () => number {
    return () => this.generateValue();
  }

  get seed(): number {
    return this._seed;
  }

  clone(nIncrements = 1): SeededRng {
    return SeededRng.clone(this, nIncrements);
  }

  /** Safely increments the seed by the given number of increments */
  increment(nIncrements = 1): this {
    const n = Math.floor(nIncrements);

    this._seed = wrapSum(this.maxBase, this._seed, n);
    this.nIncrements += n;

    return this;
  }

  /*
  inspect(): { baseSeed: number; seed: number; nIncrements: number } {
    return { baseSeed: this.baseSeed, seed: this._seed, nIncrements: this.nIncrements };
  }
   */

  // Returns the next value in the pseudo-random sequence
  next(): number {
    return this.generateValue();
  }

  protected static create(seedLike: Seed, options: SeedOptions): SeededRng {
    const rng = new SeededRng(seedLike);

    const { preset = 'standard' } = options;
    if (preset === 'standard') return rng;

    if (options.preset === 'int') {
      rng.generateBase = rng.intGenerateBase;
      rng.generateValue = rng.intGenerateValue;
    } else if (options.preset === 'int32') {
      rng.generateBase = rng.int32GenerateBase;
      rng.generateValue = rng.int32GenerateValue;
      rng.maxBase = 2 ** 32 - 1;
    }
    rng.preset = preset;
    rng.initializeSeeds(SeededRng.evaluateSeed(seedLike) ?? rng.generateBase());
    return rng;
  }

  protected initializeSeeds(baseSeed: number) {
    this.baseSeed = wrapSum(this.maxBase, baseSeed);
    this._seed = this.baseSeed;
  }

  // Safely sets the seed and returns the safe seed
  // Returns the seed value and then safely increments it (safe equivalent to _seed++)
  protected getSeedAndIncrement(): number {
    const seed = this._seed;
    this.increment();
    return seed;
  }

  private standardGenerateBase(): number {
    return Math.random();
  }

  private standardGenerateValue(): number {
    return getFakeMathRandom(this.getSeedAndIncrement());
  }

  private intGenerateBase(): number {
    return pickInteger({ min: 1 });
  }

  private intGenerateValue(): number {
    return pickInteger({ min: 0, seed: getFakeMathRandom(this.getSeedAndIncrement()) });
  }

  private int32GenerateBase(): number {
    return pickInteger({ min: 1, max: this.maxBase });
  }

  private int32GenerateValue(): number {
    return pickInteger({ min: 0, max: this.maxBase, seed: getFakeMathRandom(this.getSeedAndIncrement()) });
  }
}

// region | Types
type OptionsWithSeed<O> = O & { seed?: Seed };

interface SeedOptions {
  preset?: SeedPreset | undefined;
}

type SeedPreset = 'int' | 'int32' | 'standard';
// endregion | Types
