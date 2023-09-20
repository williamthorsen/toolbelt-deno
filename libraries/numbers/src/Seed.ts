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
  static clone(seed: SeedLike | undefined): Seed | undefined {
    if (seed instanceof Seed) {
      return Seed.spawn(seed.base);
    }
  }
  // Creates a child; mutates the input seed, if it is a Seed instance or generator
  static spawn(seed: SeedLike | undefined): Seed | undefined {
    return seed === undefined ? undefined : new Seed(seed);
  }

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

  clone(nIncrements = 0): Seed {
    return new Seed(this._base).increment(nIncrements);
  }

  increment(n: number): this {
    this._base += n;
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

type SeedFunction = () => number;

export type SeedLike = number | Seed | SeedFunction | undefined;
