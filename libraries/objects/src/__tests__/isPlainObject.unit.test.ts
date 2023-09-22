import { assert, assertEquals, describe, it } from '../../dev_deps.ts';
import { isPlainObject } from '../isPlainObject.ts';
import { scalars } from './primitives.fixture.ts';

describe('isPlainObject(value: unknown)', () => {
  describe('nonscalars', () => {
    it('returns true for an object literal', () => {
      const plainObjects = [{}, { a: 1 }];
      for (const plainObject of plainObjects) {
        assert(isPlainObject(plainObject));
      }
    });

    it('returns true for an object created using the Object constructor', () => {
      const value = new Object();
      assert(isPlainObject(value));
    });

    it('returns false for an array', () => {
      assert(!isPlainObject([]));
    });

    it(`returns false for a function`, () => {
      const value = () => {};
      assertEquals(isPlainObject(value), false);
    });

    it('returns false for an instance of any class other than Object', () => {
      class MyClass {
        constructor(public prop?: unknown) {}
      }

      const instances = [
        new Date(),
        new Map(),
        new MyClass(),
        new Set(),
        new WeakMap(),
      ];
      for (const instance of instances) {
        assert(!isPlainObject(instance));
      }
    });
  });

  describe('scalars', () => {
    it(`returns false for null`, () => {
      assertEquals(
        isPlainObject(null),
        false,
      );
    });

    for (const [label, value] of scalars) {
      it(`returns false for ${label}`, () => {
        assertEquals(isPlainObject(value), false);
      });
    }
  });
});
