import {
  assertEquals,
  assertMatch,
  assertObjectMatch,
  assertSnapshot,
  assertThrows,
  describe,
  it,
} from '../../dev_deps.ts';

import { TextNode, VariantNode } from '../TextNode.ts';

describe('TextNode', () => {
  // These are all equivalent inputs to `selectVariants`
  const nestedIndices = [[0, [1, [1]]], [1, [0, 0]]];
  const encodedIndices = '0[1[1]] | 1[0|0]';
  const flatIndices = [0, 1, 1, 1, 0, 0];

  describe('static create()', () => {
    it('if given a simple phrase, returns a single TextNode', () => {
      const input = 'Hello';
      const expected = {
        content: 'Hello',
        children: undefined,
      };

      const actual = TextNode.create(input);

      assertObjectMatch(actual, expected);
    });

    it('if given a delimited phrase, splits it into variants', () => {
      const input = '[A|B|C]';
      const expected = {
        content: input,
        variants: ['A', 'B', 'C'],
      };

      const actual = TextNode.create(input);

      assertObjectMatch(actual, expected);
    });

    it('given a string containing delimited phrases, splits it into tokens and variants', () => {
      const input = 'static [A|B] more static [C|D]';
      const expected = {
        content: input,
        children: [
          'static ',
          {
            content: '[A|B]',
            variants: ['A', 'B'],
          },
          ' more static ',
          {
            content: '[C|D]',
            variants: ['C', 'D'],
          },
        ],
      };

      const actual = TextNode.create(input);

      assertObjectMatch(actual, expected);
    });

    it('can handle nested delimiters', async (snapshot) => {
      const input = '1:[A[1[a|b]|2[c|d]]|B] 2:[C|D]';

      const actual = TextNode.create(input);

      await assertSnapshot(snapshot, actual);
    });
  });

  describe('static decodeIndices()', () => {
    it('given a string, splits on non-numeric sequences and returns an array of numbers', () => {
      const input = encodedIndices;
      const expected = flatIndices;

      const actual = TextNode.create('').decodeIndices(input);

      assertEquals(actual, expected);
    });

    it('flattens nested arrays', () => {
      const input = nestedIndices;
      const expected = flatIndices;

      const actual = TextNode.create('').decodeIndices(input);

      assertEquals(actual, expected);
    });

    describe('static encodeIndices()', () => {
      it('transforms an arbitrarily nested array of numbers into a string', () => {
        const input = nestedIndices;
        const expectedEncoded = encodedIndices;

        const actualEncoded = VariantNode.encodeIndices(input);

        assertEquals(actualEncoded, expectedEncoded);

        // Verify that the encoded string is equivalent to the input string
        assertEquals(TextNode.decodeIndices(actualEncoded), TextNode.decodeIndices(input));
      });
    });
  });

  describe('pick()', () => {
    it('reconstructs static content', () => {
      const input = 'Hello, world!';
      const expected = input;

      const actual = TextNode.create(input).pick();

      assertEquals(actual, expected);
    });

    it('randomly resolves variants', () => {
      const input = '[A|B|C]';
      const expected = /^[ABC]$/;

      const actual = TextNode.create(input).pick();

      assertMatch(actual, expected);
    });

    it('given the same seed, always returns the same result', () => {
      const seed = 1236;
      const input = 'token1 [A[1[a|b]|2[c|d]]|B] token2 [C|D[1|2]]';
      const knownExpected = 'token1 A2c token2 D2';

      const actual = TextNode.create(input).pick({ seed });

      assertEquals(actual, knownExpected);
    });
  });

  describe('pickIndices', () => {
    const input = '1:[A[1[a|b]|2[c|d]]|B] | 2:[C|D[1|2][a|b]|E]';
    const testCases = [
      { seed: 1234, expectedIndices: [1, 2], expectedString: '1:B | 2:E' },
      { seed: 1236, expectedIndices: [[0, [1, [0]]], [1, [1, 1]]], expectedString: '1:A2c | 2:D2b' },
      { seed: 1249, expectedIndices: [[0, [1, [1]]], [1, [0, 0]]], expectedString: '1:A2d | 2:D1a' },
    ];
    for (const { seed, expectedIndices, expectedString } of testCases) {
      it('selects depth-first indices to resolve variants', () => {
        const actualIndices = TextNode.create(input).pickIndices({ seed });
        const actualString = TextNode.create(input).pick({ seed });

        assertEquals(actualString, expectedString);
        assertEquals(actualIndices, expectedIndices);
      });
    }

    it('given a node without children, returns an empty array', () => {
      const input = 'Hello';
      const expected: number[] = [];

      const actual = TextNode.create(input).pickIndices();

      assertEquals(actual, expected);
    });
  });

  describe('selectVariants()', () => {
    it('consumes indices to select variants depth-first', () => {
      const input = '1:[A[1[a|b]|2[c|d]]|B] | 2:[C|D]';
      const textNode = TextNode.create(input);

      const indices = [0, 1, 1, 1];
      const nestedIndices = [[0, [1, [1]]], 1];
      const encoding = '0[1[1]]] | 1';
      const expected = '1:A2d | 2:D';

      const actualFromIndices = textNode.selectVariants(indices);
      const actualFromNestedIndices = textNode.selectVariants(nestedIndices);
      const actualFromEncoding = textNode.selectVariants(encoding);

      assertEquals(actualFromIndices, expected);
      assertEquals(actualFromNestedIndices, expected);
      assertEquals(actualFromEncoding, expected);
    });

    it('works when top-level node is a VariantNode', () => {
      const input = '[A|B[1|2]|C]';
      const indices = '1[0]';
      const ast = TextNode.create(input);
      const expected = 'B1';

      const actual = ast.selectVariants(indices);

      assertEquals(actual, expected);
    });

    it('given a text without children, returns an empty string', () => {
      const input = '';
      const expected = '';

      const actual = TextNode.create(input).selectVariants([]);

      assertEquals(actual, expected);
    });

    it('given an invalid index, throws an error', () => {
      const input = '[A|B|C]';
      const indices = [3];
      const ast = TextNode.create(input);

      const throwingFn = () => ast.selectVariants(indices);

      assertThrows(throwingFn, RangeError, 'Variant index exceeds maximum index. Expected maximum of 2, got 3.');
    });

    it('given too few indices to resolve all variants, throws an error', () => {
      const input = '[A[1|2]|B[3|4]|C[5|6]]'; // needs 2 indices to resolve
      const indices = [0];
      const ast = TextNode.create(input);

      const throwingFn = () => ast.selectVariants(indices);

      assertThrows(throwingFn, Error, 'Not enough indices to resolve all variants.');
    });

    it('given too many indices, throws an error', () => {
      const input = '[A|B|C]';
      const indices = [1, 1];
      const ast = TextNode.create(input);

      const throwingFn = () => ast.selectVariants(indices);

      assertThrows(throwingFn, Error, 'Unused variant indices. Received 2, leaving 1 unused.');
    });
  });

  describe('toString()', () => {
    it('reconstructs the original content', () => {
      const input = 'token1 [A[1[a|b]|2[c|d]]|B] token2 [C|D]';
      const expected = input;

      const actual = TextNode.create(input).toString();

      assertEquals(actual, expected);
    });

    it('given a text without children, returns an empty string', () => {
      const input = '';
      const expected = '';

      const actual = TextNode.create(input).toString();

      assertEquals(actual, expected);
    });
  });
});

describe('VariantNode class', () => {
});
