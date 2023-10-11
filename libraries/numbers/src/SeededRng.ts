import { getFakeMathRandom } from './getFakeMathRandom.ts';
import type { EmptyObject } from './numbers.types.ts';
import { wrapSum } from './wrapSum.ts';
import type { Seed, SeededGenerator } from './evaluateSeed.ts';
import { checkIsRngLike, evaluateSeed } from './evaluateSeed.ts';
import { IntegerSeed } from './IntegerSeed.ts';
import { scaleInt } from './scale.ts';
import { pickInteger } from './pickInteger.ts';

/**
 * Class that manages a pseudo-random number generator that behaves deterministically when given a seed.
 */
export class SeededRng implements SeededGenerator {
  private _seed = 0; // internally incremented value to provide deterministic behaviour
  private baseSeed = 0; // original value used to create the seed
  private nIncrements = 0;

  // Resolves a seed-like value to a number
  static evaluateSeed(seed?: Seed | undefined) {
    return evaluateSeed(seed);
  }

  /**
   * Creates a child from a seed without mutating the parent seed.
   */
  static clone<T extends ThisConstructor<typeof SeededRng>>(this: T, seed: undefined, nIncrements?: number): undefined;
  static clone<T extends ThisConstructor<typeof SeededRng>>(this: T, seed: Seed, nIncrements?: number): This<T>;
  static clone<T extends ThisConstructor<typeof SeededRng>>(
    this: T,
    seed: Seed | undefined,
    nIncrements?: number,
  ): This<T> | undefined;
  static clone<T extends ThisConstructor<typeof SeededRng>>(
    this: T,
    seed?: Seed | undefined,
    nIncrements = 0,
  ): This<T> | undefined {
    if (checkIsRngLike(seed)) {
      return new this(seed.seed).increment(nIncrements);
    }
    return seed === undefined ? undefined : new this(seed).increment(nIncrements);
  }

  /**
   * Clones the given seed or creates a new one if none is given.
   */
  static cloneOrCreate<T extends ThisConstructor<typeof SeededRng>>(
    this: T,
    seed?: Seed,
    nIncrements?: number,
  ): This<T> {
    return seed === undefined ? new this() : this.clone(seed, nIncrements);
  }

  // Creates a child; mutates the input seed, if it is a Seed instance or generator
  static spawn<T extends ThisConstructor<typeof SeededRng>>(this: T, seed: undefined): undefined;
  static spawn<T extends ThisConstructor<typeof SeededRng>>(this: T, seed: Seed): This<T>;
  static spawn<T extends ThisConstructor<typeof SeededRng>>(this: T, seed: Seed | undefined): This<T> | undefined;
  static spawn<T extends ThisConstructor<typeof SeededRng>>(this: T, seed?: Seed): This<T> | undefined {
    return seed === undefined ? undefined : new this(seed);
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
    this.initializeSeeds(SeededRng.evaluateSeed(seed));
  }

  // Must be a method because JavaScript does not support static property overrides
  get maxBase() {
    return IntegerSeed.max;
  }

  // Returns a function that successively returns a deterministic sequence of numbers based on this instance's seed
  get rng(): () => number {
    return () => this.next();
  }

  get seed(): number {
    return this._seed;
  }

  clone<T extends SeededRng>(this: T, nIncrements = 0): T {
    return new (this.constructor as Constructor<T>)(this._seed).increment(nIncrements);
  }

  /** Safely increments the seed by the given number of increments */
  increment(nIncrements = 1): this {
    const n = Math.floor(nIncrements);
    for (let i = 0; i < n; i++) {
      // TODO: Consider whether scaling is justified by the use case of a smaller seed range
      const scaledSeed = this.scaleUpSeed(this._seed);
      this._seed = this.scaleDownSeed(IntegerSeed.next(scaledSeed));
    }
    this.nIncrements += n;
    return this;
  }

  /*
  inspect(): { baseSeed: number; seed: number; nIncrements: number } {
    return { baseSeed: this.baseSeed, seed: this._seed, nIncrements: this.nIncrements };
  }
   */

  // Returns the next value in the pseudo-random sequence
  next(n = 1): number {
    const value = this.generateValue();
    for (let i = 0; i < n; i++) this.increment();
    return value;
  }

  /**
   * Returns the next value in the pseudo-random sequence without incrementing the seed.
   * For use in testing and debugging.
   */
  peek(): number {
    return this.generateValue();
  }

  scaleDownSeed(seed: number): number {
    return scaleInt(seed, { min: 1, max: this.maxBase }, { min: 1, max: IntegerSeed.max });
  }

  scaleUpSeed(value: number): number {
    return scaleInt(value, { min: 1, max: IntegerSeed.max }, { min: 1, max: this.maxBase });
  }

  protected generateValue(): number {
    return getFakeMathRandom(this._seed);
  }

  // Safely sets records the base seed and sets the current seed to the same value
  protected initializeSeeds(baseSeed?: number) {
    this.baseSeed = wrapSum(this.maxBase, IntegerSeed.toInt(baseSeed));
    this._seed = this.baseSeed;
  }
}

// Behaves exactly the same as `SeededRng`, but returns integers in the range [1, Number.MAX_SAFE_INTEGER]
export class IntSeededRng extends SeededRng {
  protected generateValue(): number {
    return pickInteger({ min: 1, max: Number.MAX_SAFE_INTEGER, seed: getFakeMathRandom(this.seed) });
  }
}

// Same as `IntSeededRng`, but returns integers in the range [1, 2 ** 32 - 1]
export class Int32SeededRng extends SeededRng {
  protected generateValue(): number {
    return pickInteger({ min: 1, max: 2 ** 32 - 1, seed: getFakeMathRandom(this.seed) });
  }
}
// region | Types
// deno-lint-ignore no-explicit-any
type Constructor<T, Arguments extends unknown[] = any[]> = new (...arguments_: Arguments) => T;

type OptionsWithSeed<O> = O & { seed?: Seed };

type ThisConstructor<
  T extends { prototype: unknown } = { prototype: unknown },
> = T;

type This<T extends ThisConstructor> = T['prototype'];
// endregion | Types
