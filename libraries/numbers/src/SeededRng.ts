import { getFakeMathRandom } from './getFakeMathRandom.ts';
import type { EmptyObject } from './numbers.types.ts';
import { pickInteger } from './pickInteger.ts';
import { wrapSum } from './wrapSum.ts';
import type { Seed, SeededGenerator } from './evaluateSeed.ts';
import { checkIsRngLike, evaluateSeed } from './evaluateSeed.ts';

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

  // Creates a child; does not mutate the parent seed
  // By default, the child's base is incremented by 1 to produce a different output than the parent
  // while still being deterministic. Set nIncrements to 0 to produce the same output.
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
    this.initializeSeeds(SeededRng.evaluateSeed(seed) ?? this.generateBase());
  }

  get maxBase() {
    return Number.MAX_SAFE_INTEGER;
  }

  // Returns a function that successively returns a deterministic sequence of numbers based on this instance's seed
  get rng(): () => number {
    return () => this.generateValue();
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
  next(n = 1): number {
    for (let i = 1; i < n; i++) {
      this.increment();
    }
    return this.generateValue();
  }

  /**
   * Returns the next value in the pseudo-random sequence without incrementing the seed.
   * For use in testing and debugging.
   */
  peek(): number {
    return this.generateValue({ noIncrement: true });
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

  protected generateBase(): number {
    return Math.random();
  }

  protected generateValue({ noIncrement }: { noIncrement?: boolean } = {}): number {
    const seed = noIncrement ? this._seed : this.getSeedAndIncrement();
    return getFakeMathRandom(seed);
  }
}

export class IntSeededRng extends SeededRng {
  protected generateBase() {
    return pickInteger({ min: 1 });
  }

  protected generateValue(): number {
    return pickInteger({ min: 0, seed: getFakeMathRandom(this.getSeedAndIncrement()) });
  }
}

export class Int32SeededRng extends SeededRng {
  get maxBase() {
    return 2 ** 32 - 1;
  }

  protected generateBase() {
    return pickInteger({ min: 1, max: this.maxBase });
  }

  protected generateValue(): number {
    return pickInteger({ min: 0, max: this.maxBase, seed: getFakeMathRandom(this.getSeedAndIncrement()) });
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
