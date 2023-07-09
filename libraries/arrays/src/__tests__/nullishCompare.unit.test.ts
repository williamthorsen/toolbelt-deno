import { assert, assertEquals, describe, it } from '../../dev_deps.ts';

import { createNullishComparator, nullishCompare } from '../nullishCompare.ts';

describe('createNullishComparator()', () => {
  // Original comparison function
  function compare(a: number, b: number): number {
    return a - b;
  }

  describe('nullishGreater=false (the default)', () => {
    it('returns -1 if a < b', () => {
      const nullishCompare = createNullishComparator(compare);
      assert(nullishCompare(-1, 1) < 0);
    });

    it('returns 1 if a > b', () => {
      const nullishCompare = createNullishComparator(compare);
      assert(nullishCompare(1, -1) > 0);
    });

    it('lesser values are ranked higher than greater values when sorted', () => {
      const values = [2, 1, 4, 3];
      const expectedValues = [1, 2, 3, 4];

      const nullishCompare = createNullishComparator(compare);
      const actualValues = values.slice().sort(nullishCompare);

      assertEquals(actualValues, expectedValues);
    });
  });

  describe('nullishGreater option', () => {
    it('if nullishGreater=true, nullish values are ranked lower than other values when sorted', () => {
      const options = { nullishGreater: true };
      const values = [1, -1, null, 2];
      const expectedValues = [-1, 1, 2, null];

      const nullishCompare = createNullishComparator(compare, options);
      const actualValues = values.slice().sort(nullishCompare);

      assertEquals(actualValues, expectedValues);
    });
  });
});

describe('nullishCompare()', () => {
  function compare(a: number, b: number): number {
    return a - b;
  }

  describe('nullishGreater=false (the default)', () => {
    it('if the values are equal, returns 0', () => {
      const a = 1;
      const b = 1;
      const expected = 0;

      const actual = nullishCompare(compare, a, b);

      assertEquals(actual, expected);
    });

    it('if the values are both nullish, returns 0', () => {
      const a = null;
      const b = null;
      const expected = 0;

      const actual = nullishCompare(compare, a, b);

      assertEquals(actual, expected);
    });

    it('if a < b, returns a negative number', () => {
      const a = 0;
      const b = 1;

      const result = nullishCompare(compare, a, b);

      assert(result < 0);
    });

    it('if a > b, returns a positive number', () => {
      const a = 1;
      const b = 0;

      const result = nullishCompare(compare, a, b);

      assert(result > 0);
    });

    for (const nullish of [null, undefined]) {
      it('if only a is nullish, returns a negative number', () => {
        const a = nullish;
        const b = 1;

        const result = nullishCompare(compare, a, b);

        assert(result < 0);
      });
    }

    for (const nullish of [null, undefined]) {
      it('if only b is nullish, returns a positive number', () => {
        const a = 1;
        const b = nullish;

        const result = nullishCompare(compare, a, b);

        assert(result > 0);
      });
    }
  });

  describe('nullishGreater=true', () => {
    function compare(a: { value: number }, b: { value: number }): number {
      return a.value - b.value;
    }

    const options = { nullishGreater: true };

    it('if the values are equal, returns 0', () => {
      const a = { value: 1 };
      const b = { value: 1 };
      const expected = 0;

      const actual = nullishCompare(compare, a, b, options);

      assertEquals(actual, expected);
    });

    it('if the values are both nullish, returns 0', () => {
      const a = null;
      const b = undefined;
      const expected = 0;

      const actual = nullishCompare(compare, a, b, options);

      assertEquals(actual, expected);
    });

    it('if a < b, returns a negative number', () => {
      const a = { value: 1 };
      const b = { value: 2 };

      const result = nullishCompare(compare, a, b, options);

      assert(result < 0);
    });

    it('if a > b, returns a positive number', () => {
      const a = { value: 2 };
      const b = { value: 1 };

      const result = nullishCompare(compare, a, b, options);

      assert(result > 0);
    });

    for (const nullish of [null, undefined]) {
      it(`if only a is ${nullish}, returns a positive number`, () => {
        const a = nullish;
        const b = { value: 0 };

        const result = nullishCompare(compare, a, b, options);

        assert(result > 0);
      });
    }

    for (const nullish of [null, undefined]) {
      it(`if only b is ${nullish}, returns a negative number`, () => {
        const a = { value: 0 };
        const b = nullish;

        const result = nullishCompare(compare, a, b, options);

        assert(result < 0);
      });
    }
  });
});
