import { assertEquals, assertMatch, assertObjectMatch, assertThrows, describe, it } from '../../dev_deps.ts';

import { TextNode, VariantNode } from '../TextNode.ts';

describe('TextNode', () => {
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
      const input = 'token1 [A[1[a|b]|2[c|d]]|B] token2 [C|D]';
      const expected = {
        content: input,
        children: [
          'token1 ',
          {
            variants: [
              {
                children: [
                  'A',
                  {
                    variants: [
                      {
                        children: [
                          '1',
                          {
                            variants: ['a', 'b'],
                          },
                        ],
                      },
                      {
                        children: [
                          '2',
                          {
                            variants: ['c', 'd'],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          ' token2 ',
          {
            variants: ['C', 'D'],
          },
        ],
      };

      const actual = TextNode.create(input);

      assertObjectMatch(actual, expected);
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

    it('given a text without children, returns an empty string', () => {
      const input = '';
      const expected = '';

      const actual = TextNode.create(input).selectVariants([]);

      assertEquals(actual, expected);
    });

    it('given too few indices to resolve all variants, throws an error', () => {
      const input = '[A|B|C]';

      const throwingFn = () => TextNode.create(input).selectVariants([]);

      assertThrows(throwingFn, Error, 'Not enough indices to resolve all variants.');
    });

    // itTodo('given too many indices, throws an error');
    // itTodo('given an invalid index, throws an error');
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
  const nestedIndices = [[0, [1, [1]]], [1, [0, 0]]];
  const encodedIndices = '0[1[1]] | 1[0|0]';

  describe('static decodeIndices()', () => {
    it('splits on non-numeric sequences and converts numeric strings to numbers', () => {
      const input = encodedIndices;
      const expected = [0, 1, 1, 1, 0, 0];

      const actual = VariantNode.decodeIndices(input);

      assertEquals(actual, expected);
    });

    it('flattens nested arrays', () => {
      const input = nestedIndices;
      const expected = [0, 1, 1, 1, 0, 0];

      const actual = VariantNode.decodeIndices(input);

      assertEquals(actual, expected);
    });
  });

  describe('static encodeIndices()', () => {
    it('transforms an arbitrarily nested array of numbers into a string', () => {
      const input = nestedIndices;
      const expected = encodedIndices;

      const actual = VariantNode.encodeIndices(input);

      assertEquals(actual, expected);
    });
  });
});
