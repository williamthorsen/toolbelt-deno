import {
  assertEquals,
  assertMatch,
  assertNotEquals,
  assertObjectMatch,
  assertThrows,
  describe,
  it,
} from '../../dev_deps.ts';

import { TextNode, VariantNode } from '../TextNode.ts';
import expectedNestedAst from './__fixtures__/TextNode.fixture.ts';

describe('TextNode', () => {
  const testCase = {
    input: '1:[A[1[a|b]|2[c|d]]|B] | 2:[C|D[1|2][a|b]|E]',
    output: '1:A2c | 2:D1b',
    fingerprint: '0[1[0]]|1[0|1]:1236',
    seed: 1236,
    encodedIndices: '0[1[0]]|1[0|1]',
    flatIndices: [0, 1, 0, 1, 0, 1],
    nestedIndices: [[0, [1, [0]]], [1, [0, 1]]],
  };

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

    it('can handle nested delimiters', () => {
      const input = '1:[A[1[a|b]|2[c|d]]|B] 2:[C|D]';
      const expected = expectedNestedAst;

      const actual = TextNode.create(input);

      assertObjectMatch(actual, expected);
    });
  });

  describe('static decodeIndices()', () => {
    it('given encoded indices, splits on non-numeric sequences and returns an array of numbers', () => {
      const input = testCase.encodedIndices;
      const expected = testCase.flatIndices;

      const actual = TextNode.decodeIndices(input);

      assertEquals(actual, expected);
    });

    it('given a fingerprint, strips the seed and parses the decodes the indices', () => {
      const fingerprint = '0[1]]:1236';
      const expected = TextNode.decodeIndices('0[1]]');

      const actual = TextNode.decodeIndices(fingerprint);

      assertEquals(actual, expected);
    });

    it('flattens nested arrays', () => {
      const input = testCase.nestedIndices;
      const expected = testCase.flatIndices;

      const actual = TextNode.decodeIndices(input);

      assertEquals(actual, expected);
    });

    describe('static encodeIndices()', () => {
      it('transforms an arbitrarily nested array of numbers into a fingerprint', () => {
        const input = testCase.nestedIndices;
        const expected = testCase.encodedIndices;

        const actual = VariantNode.encodeIndices(input);

        assertEquals(actual, expected);

        // Verify that the encoded string is equivalent to the input string
        assertEquals(TextNode.decodeIndices(actual), TextNode.decodeIndices(input));
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
  });

  describe('pickIndices', () => {
    it('selects depth-first indices to resolve variants', () => {
      const { input, seed } = testCase;

      const actualString = TextNode.create(input).pick({ seed });
      const actualIndices = TextNode.create(input).pickIndices({ seed });

      assertEquals(actualString, testCase.output);
      assertEquals(actualIndices, testCase.nestedIndices);
    });

    it('given a node without children, returns an empty array', () => {
      const input = 'Hello';
      const expected: number[] = [];

      const actual = TextNode.create(input).pickIndices();

      assertEquals(actual, expected);
    });
  });

  describe('pickWithFingerprint()', () => {
    it('returns an object containing the picked content and fingerprint', () => {
      const { input, output, encodedIndices, nestedIndices, seed } = testCase;
      const textNode = TextNode.create(input);
      const expected = {
        content: output,
        encodedIndices,
        fingerprint: `${encodedIndices}:${seed}`,
        indices: nestedIndices,
        seed,
      };

      const actual = textNode.pickWithFingerprint({ seed });

      assertObjectMatch(actual, expected);
    });

    it('given no seed, generates an integer seed and returns a new one', () => {
      const textNode = TextNode.create(testCase.input);

      const { seed } = textNode.pickWithFingerprint();

      assertEquals(Number.isInteger(seed), true);
    });

    it('given a non-integer seed, generates a deterministic integer from it and returns it', () => {
      const inputSeed = 0.1234;
      const textNode = TextNode.create(testCase.input);

      const outputSeed = textNode.pickWithFingerprint({ seed: inputSeed }).seed;
      const outputSeed2 = textNode.pickWithFingerprint({ seed: inputSeed }).seed;

      assertNotEquals(outputSeed, inputSeed); // not the same as the input seed
      assertEquals(outputSeed, outputSeed2); // but deterministically determined
      assertEquals(Number.isInteger(outputSeed), true);
    });
  });

  describe('selectVariants()', () => {
    it('consumes indices to select variants depth-first', () => {
      const textNode = TextNode.create(testCase.input);
      const expected = textNode.pick({ seed: testCase.seed });

      assertEquals(expected, testCase.output);

      const actualFromIndices = textNode.selectVariants(testCase.flatIndices);
      const actualFromNestedIndices = textNode.selectVariants(testCase.nestedIndices);
      const actualFromEncoding = textNode.selectVariants(testCase.encodedIndices);

      assertEquals(actualFromIndices, testCase.output);
      assertEquals(actualFromNestedIndices, testCase.output);
      assertEquals(actualFromEncoding, testCase.output);
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
