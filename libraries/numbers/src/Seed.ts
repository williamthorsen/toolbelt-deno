import { getFakeMathRandom } from './getFakeMathRandom.ts';
import { pickInteger } from './pickInteger.ts';

/**
 * Number-generating class for use with functions that accept a `Seed` or `SeedLike` parameter.
 */
export class Seed {
  protected get maxBase() {
    return Number.MAX_SAFE_INTEGER;
  }

  protected _base: number; // internally incremented value to provide deterministic behaviour

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
  static clone<T extends ThisConstructor<typeof Seed>>(
    this: T,
    seed: SeedLike | undefined,
    nIncrements = 1,
  ): This<T> | undefined {
    if (seed instanceof this) {
      return this.spawn(seed.base)?.increment(nIncrements);
    }
  }

  // Creates a child; mutates the input seed, if it is a Seed instance or generator
  static spawn<T extends ThisConstructor<typeof Seed>>(this: T, seed: SeedLike | undefined): This<T> | undefined {
    return seed === undefined ? undefined : new this(seed);
  }

  constructor(seed?: SeedLike) {
    this._base = ((new.target).evaluate(seed) ?? this.generateBase()) % this.maxBase;
  }

  get base(): number {
    return this._base;
  }

  // Returns a function that can be used as a seed to produce a deterministic series of numbers
  get seedFn(): () => number {
    return () => this.generateValue();
  }

  clone<T extends Seed>(this: T, nIncrements = 0): T {
    return new (this.constructor as Constructor<T>)(this._base).increment(nIncrements);
  }

  increment<T extends Seed>(this: T, n: number): T {
    this._base += Math.floor(n);
    return this;
  }

  next(): number {
    return this.generateValue();
  }

  protected generateBase() {
    return Math.random();
  }

  protected generateValue() {
    return getFakeMathRandom(this.nextBase());
  }

  // Returns the base value and then safely increments it (safe equivalent to _base++)
  protected nextBase(): number {
    const base = this._base;
    this._base = (base + 1) % this.maxBase;
    return base;
  }
}

export class IntSeed extends Seed {
  protected generateBase() {
    return pickInteger({ min: 1 });
  }

  protected generateValue() {
    return pickInteger({ min: 0, seed: getFakeMathRandom(this.nextBase()) });
  }
}

export class Int32Seed extends Seed {
  protected get maxBase() {
    return 4294967295; // 2^32 - 1
  }

  protected generateBase() {
    return pickInteger({ min: 1, max: this.maxBase });
  }

  protected generateValue() {
    return pickInteger({ min: 0, seed: getFakeMathRandom(this.nextBase()) });
  }
}

// region | Types
// deno-lint-ignore no-explicit-any
type Constructor<T, Arguments extends unknown[] = any[]> = new (...arguments_: Arguments) => T;

type OptionsWithSeed<O> = O & { seed?: SeedLike };

type SeedFunction = () => number;

export type SeedLike = number | Seed | SeedFunction | undefined;

type ThisConstructor<
  T extends { prototype: unknown } = { prototype: unknown },
> = T;
type This<T extends ThisConstructor> = T['prototype'];
// endregion | Types
