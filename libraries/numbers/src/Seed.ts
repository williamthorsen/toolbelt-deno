import { getFakeMathRandom } from './getFakeMathRandom.ts';
import type { EmptyObject } from './numbers.types.ts';
import { pickInteger } from './pickInteger.ts';

/**
 * Number-generating class for use with functions that accept a `Seed` or `SeedLike` parameter.
 */
export class Seed {
  private _base: number; // internally incremented value to provide deterministic behaviour
  readonly preset: 'int' | 'int32' | 'standard' = 'standard';
  private readonly maxBase = Number.MAX_SAFE_INTEGER;

  private readonly generateBase: () => number;
  private readonly generateValue: () => number;

  static evaluate(seed: SeedLike | undefined): number | undefined {
    if (typeof seed === 'number') {
      return seed;
    } else if (seed instanceof Seed) {
      return seed.next();
    } else if (seed instanceof Function) {
      return seed();
    }
    return undefined;
  }
  // Creates a child; does not mutate the parent seed
  // By default, the child's base is incremented by 1 to produce a different output than the parent
  // while still being deterministic. Set nIncrements to 0 to produce the same output.
  static clone(seed?: undefined, nIncrements?: number): undefined;
  static clone(seed: SeedLike, nIncrements?: number): Seed;
  static clone(seed: SeedLike | undefined, nIncrements = 1): Seed | undefined {
    if (seed instanceof Seed) {
      return Seed.create(seed.base, { preset: seed.preset }).increment(nIncrements);
    }
  }

  static int(seed?: undefined): Seed {
    return Seed.create(seed, { preset: 'int' });
  }

  static int32(seed?: undefined): Seed {
    return Seed.create(seed, { preset: 'int32' });
  }

  // Creates a child; mutates the input seed, if it is a Seed instance or generator
  static spawn(seed?: undefined): undefined;
  static spawn(seed: SeedLike): Seed;
  static spawn(seed?: SeedLike): Seed | undefined {
    if (seed === undefined) {
      return undefined;
    }
    const preset = seed instanceof Seed ? seed.preset : undefined;
    return new Seed(seed, { preset });
  }

  /**
   * Given a seed-acception function and an optional seed, returns a new function that passes the seed to the function.
   */
  static withSeed<TOptions extends object, R>(
    fn: (options?: OptionsWithSeed<TOptions>) => R,
    seed: SeedLike | undefined,
  ): (options?: TOptions) => R;
  static withSeed<TOptions extends object, R>(
    fn: (options: OptionsWithSeed<TOptions>) => R,
    seed: SeedLike | undefined,
  ): (options: TOptions) => R;

  // Implementation
  static withSeed<TOptions extends object, R>(
    fn: (options?: OptionsWithSeed<TOptions> | OptionsWithSeed<EmptyObject>) => R,
    seed: SeedLike | undefined,
  ) {
    const spawnedSeed = Seed.spawn(seed); // stored outside the function to create a closure
    return function (options?: TOptions) {
      return fn({ ...options, seed: spawnedSeed });
    };
  }

  /**
   * Constructor
   */
  constructor(seed?: SeedLike, options: SeedOptions = {}) {
    const { preset = 'standard' } = options;
    if (preset === 'int') {
      this.generateBase = () => pickInteger({ min: 1 });
      this.generateValue = () => pickInteger({ min: 0, seed: getFakeMathRandom(this.nextBase()) });
    } else if (preset === 'int32') {
      this.generateBase = () => pickInteger({ min: 1, max: this.maxBase });
      this.generateValue = () => pickInteger({ min: 0, max: this.maxBase, seed: getFakeMathRandom(this.nextBase()) });
      this.maxBase = 4294967295; // 2^32 - 1
    } else {
      this.generateBase = () => Math.random();
      this.generateValue = () => getFakeMathRandom(this.nextBase());
    }
    this.preset = preset;
    this._base = (Seed.evaluate(seed) ?? this.generateBase()) % this.maxBase;
  }

  get base(): number {
    return this._base;
  }

  // Returns a function that can be used as a seed to produce a deterministic series of numbers
  get seedFn(): () => number {
    return () => this.generateValue();
  }

  clone(nIncrements = 1): Seed {
    return Seed.clone(this, nIncrements);
  }

  increment<T extends Seed>(this: T, n: number): T {
    this._base += Math.floor(n);
    return this;
  }

  next(): number {
    return this.generateValue();
  }

  protected static create(seed?: SeedLike, options: SeedOptions = {}): Seed {
    return new Seed(seed, options);
  }

  // Returns the base value and then safely increments it (safe equivalent to _base++)
  protected nextBase(): number {
    const base = this._base;
    this._base = (base + 1) % this.maxBase;
    return base;
  }
}

// region | Types
type OptionsWithSeed<O> = O & { seed?: SeedLike };

type SeedFunction = () => number;

export type SeedLike = number | Seed | SeedFunction | undefined;

interface SeedOptions {
  preset?: SeedPreset | undefined;
}

type SeedPreset = 'int' | 'int32' | 'standard';
// endregion | Types
