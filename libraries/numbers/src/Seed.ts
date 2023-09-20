import { getFakeMathRandom } from './getFakeMathRandom.ts';
import type { EmptyObject } from './numbers.types.ts';
import { pickInteger } from './pickInteger.ts';

/**
 * Number-generating class for use with functions that accept a `Seed` or `SeedLike` parameter.
 */
export class Seed {
  preset: 'int' | 'int32' | 'standard' = 'standard'; // TODO: make this a private property

  private _base: number; // internally incremented value to provide deterministic behaviour
  private maxBase = Number.MAX_SAFE_INTEGER;

  private generateBase: () => number = this.standardGenerateBase;
  private generateValue: () => number = this.standardGenerateValue;

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

  static int(seed?: SeedLike): Seed {
    return Seed.create(seed, { preset: 'int' });
  }

  static int32(seed?: SeedLike): Seed {
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
    return Seed.create(seed, { preset });
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
  constructor(seed?: SeedLike) {
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

  protected static create(seedLike: SeedLike, options: SeedOptions): Seed {
    const seed = new Seed(seedLike);

    const { preset = 'standard' } = options;
    if (preset === 'standard') return seed;

    if (options.preset === 'int') {
      seed.generateBase = seed.intGenerateBase;
      seed.generateValue = seed.intGenerateValue;
    } else if (options.preset === 'int32') {
      seed.generateBase = seed.int32GenerateBase;
      seed.generateValue = seed.int32GenerateValue;
      seed.maxBase = 2 ** 32 - 1;
    }
    seed.preset = preset;
    seed._base = (Seed.evaluate(seedLike) ?? seed.generateBase()) % seed.maxBase;

    return seed;
  }

  // Returns the base value and then safely increments it (safe equivalent to _base++)
  protected nextBase(): number {
    const base = this._base;
    this._base = (base + 1) % this.maxBase;
    return base;
  }

  private standardGenerateBase(): number {
    return Math.random();
  }

  private standardGenerateValue(): number {
    return getFakeMathRandom(this.nextBase());
  }

  private intGenerateBase(): number {
    return pickInteger({ min: 1 });
  }

  private intGenerateValue(): number {
    return pickInteger({ min: 0, seed: getFakeMathRandom(this.nextBase()) });
  }

  private int32GenerateBase(): number {
    return pickInteger({ min: 1, max: this.maxBase });
  }

  private int32GenerateValue(): number {
    return pickInteger({ min: 0, max: this.maxBase, seed: getFakeMathRandom(this.nextBase()) });
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
