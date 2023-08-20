import { interpolate } from '../interpolate.ts';
import { assertEquals, assertThrows, describe, it } from '../../dev_deps.ts';

describe('interpolate()', () => {
  it('when a placeholder matches a key in the dictionary, replaces the placeholder with the corresponding value', () => {
    const input = 'Hello, {name}!';
    const dictionary = { name: 'World' };
    const expectedOutput = 'Hello, World!';

    const output = interpolate(input, dictionary);

    assertEquals(output, expectedOutput);
  });

  it('when a placeholder does not match any key in the dictionary, leaves the placeholder unchanged', () => {
    const input = 'Hello, {name}!';
    const dictionary = { greeting: 'Hi' };
    const expectedOutput = 'Hello, {name}!';

    const output = interpolate(input, dictionary);

    assertEquals(output, expectedOutput);
  });

  it('when a placeholder does not match any key in the dictionary and fallbackToKey=true, treats unmatched placeholders as values', () => {
    const input = 'Hello, {name}!';
    const dictionary = { greeting: 'Hi' };
    const expectedOutput = 'Hello, name!';

    const output = interpolate(input, dictionary, {
      fallbackToKey: true,
    });

    assertEquals(output, expectedOutput);
  });

  it('when multiple occurrences of a placeholder match a key in the dictionary, replaces all occurrences with the corresponding value', () => {
    const input = '{delimiter}Hello, {name}!{delimiter}';
    const dictionary = { name: 'World', delimiter: '|' };
    const expectedOutput = '|Hello, World!|';

    const output = interpolate(input, dictionary);

    assertEquals(output, expectedOutput);
  });

  it('when a placeholder is empty, leaves the placeholder unchanged', () => {
    const input = 'Hello, {}!';
    const dictionary = { name: 'World' };
    const expectedOutput = 'Hello, {}!';

    const output = interpolate(input, dictionary);

    assertEquals(output, expectedOutput);
  });

  it('when the input is an empty string, returns an empty string', () => {
    const input = '';
    const dictionary = { name: 'World' };
    const expectedOutput = '';

    const output = interpolate(input, dictionary);

    assertEquals(output, expectedOutput);
  });

  it('when the dictionary is empty, leaves all placeholders unchanged', () => {
    const input = 'Hello, {name}!';
    const dictionary = {};
    const expectedOutput = 'Hello, {name}!';

    const output = interpolate(input, dictionary);

    assertEquals(output, expectedOutput);
  });

  it('accepts placeholders containing underscores', () => {
    const input = 'Hello, {name_1}!';
    const dictionary = { name_1: 'World' };
    const expectedOutput = 'Hello, World!';

    const output = interpolate(input, dictionary);

    assertEquals(output, expectedOutput);
  });

  it('allows placeholders that start with a number', () => {
    const input = 'Hello, {1name}!';
    const dictionary = { '1name': 'World' };
    const expectedOutput = 'Hello, World!';

    const output = interpolate(input, dictionary);

    assertEquals(output, expectedOutput);
  });

  it('allows placeholders that include a space', () => {
    const input = 'Hello, {name with space}!';
    const dictionary = { 'name with space': 'World' };
    const expectedOutput = 'Hello, World!';

    const output = interpolate(input, dictionary);

    assertEquals(output, expectedOutput);
  });

  it('works with a typed object not having [key: string] index', () => {
    interface Dictionary {
      name: string;
    }
    const input = 'Hello, {name}!';
    const dictionary: Dictionary = { name: 'World' };
    const expectedOutput = 'Hello, World!';

    const output = interpolate(input, dictionary);

    assertEquals(output, expectedOutput);
  });

  for (
    const badInput of [
      'Hello, {name!',
      'Hello, name}!',
      'Hello, {name{}}!',
    ]
  ) {
    it('if delimiters are mismatched or nested, throws an error', () => {
      const dictionary = { name: 'World' };
      const throwingFn = () => interpolate(badInput, dictionary);

      assertThrows(
        throwingFn,
        Error,
        'Text has',
      );
    });
  }

  describe('adaptCase=true', () => {
    const adaptCase = true;

    it('if the transform can be identified, applies the transform to the value', () => {
      const input = 'Hello, {AUDIENCE}!';
      const dictionary = { 'audience': 'world' };
      const expectedOutput = 'Hello, WORLD!';
      const output = interpolate(input, dictionary, { adaptCase });
      assertEquals(output, expectedOutput);
    });

    it('applies case-transformation individually to each occurrence', () => {
      const input = 'lowercase {key}, uppercase {KEY}, capitalized {Key}, mixed-case {mixedKey}, unmatched {otherKey}';
      const dictionary = { 'key': 'value', 'mixedKey': 'value' };
      const expectedOutput =
        'lowercase value, uppercase VALUE, capitalized Value, mixed-case value, unmatched {otherKey}';

      const output = interpolate(input, dictionary, { adaptCase });

      assertEquals(output, expectedOutput);
    });

    // it.todo('accepts a regular expression', () => {
    //   const input = '{hullo}, {hallo}!';
    //   const dictionary = new Map([
    //     [/h.{1}llo/, 'hello'],
    //   ]);
    //   const expectedOutput = 'Hello, hello!';
    //
    //   const output = interpolate(input, dictionary, { adaptCase });
    //
    //   assertEquals(output, expectedOutput);
    // });

    it('if the transform cannot be identified, leaves the placeholder unchanged', () => {
      const input = '{greeting}, {myPlanet}! This is a {grEeting}!';
      const dictionary = { greeting: 'Hello', myPlanet: 'World' };
      const expectedOutput = 'Hello, World! This is a {grEeting}!';

      const output = interpolate(input, dictionary, { adaptCase });

      assertEquals(output, expectedOutput);
    });
  });
});
