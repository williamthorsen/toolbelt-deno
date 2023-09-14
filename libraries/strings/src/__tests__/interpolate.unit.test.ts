import { interpolate } from '../interpolate.ts';
import { assertEquals, assertThrows, describe, it } from '../../dev_deps.ts';

describe('interpolate()', () => {
  it('when a placeholder matches a key in the mapping, replaces the placeholder with the corresponding value', () => {
    const input = 'Hello, {name}!';
    const mapping = { name: 'World' };
    const expectedOutput = 'Hello, World!';

    const output = interpolate(input, mapping);

    assertEquals(output, expectedOutput);
  });

  it('when a placeholder does not match any key in the mapping, leaves the placeholder unchanged', () => {
    const input = 'Hello, {name}!';
    const mapping = { greeting: 'Hi' };
    const expectedOutput = 'Hello, {name}!';

    const output = interpolate(input, mapping);

    assertEquals(output, expectedOutput);
  });

  it('when multiple occurrences of a placeholder match a key in the mapping, replaces all occurrences with the corresponding value', () => {
    const input = '{delimiter}Hello, {name}!{delimiter}';
    const mapping = { name: 'World', delimiter: '|' };
    const expectedOutput = '|Hello, World!|';

    const output = interpolate(input, mapping);

    assertEquals(output, expectedOutput);
  });

  it('when a placeholder is empty, leaves the placeholder unchanged', () => {
    const input = 'Hello, {}!';
    const mapping = { name: 'World' };
    const expectedOutput = 'Hello, {}!';

    const output = interpolate(input, mapping);

    assertEquals(output, expectedOutput);
  });

  it('when the input is an empty string, returns an empty string', () => {
    const input = '';
    const mapping = { name: 'World' };
    const expectedOutput = '';

    const output = interpolate(input, mapping);

    assertEquals(output, expectedOutput);
  });

  it('when the mapping is empty, leaves all placeholders unchanged', () => {
    const input = 'Hello, {name}!';
    const mapping = {};
    const expectedOutput = 'Hello, {name}!';

    const output = interpolate(input, mapping);

    assertEquals(output, expectedOutput);
  });

  it('accepts placeholders containing underscores', () => {
    const input = 'Hello, {name_1}!';
    const mapping = { name_1: 'World' };
    const expectedOutput = 'Hello, World!';

    const output = interpolate(input, mapping);

    assertEquals(output, expectedOutput);
  });

  it('allows placeholders that start with a number', () => {
    const input = 'Hello, {1name}!';
    const mapping = { '1name': 'World' };
    const expectedOutput = 'Hello, World!';

    const output = interpolate(input, mapping);

    assertEquals(output, expectedOutput);
  });

  it('allows placeholders that include a space', () => {
    const input = 'Hello, {name with space}!';
    const mapping = { 'name with space': 'World' };
    const expectedOutput = 'Hello, World!';

    const output = interpolate(input, mapping);

    assertEquals(output, expectedOutput);
  });

  it('works with a typed object not having a string index', () => {
    interface Mapping {
      name: string;
    }
    const input = 'Hello, {name}!';
    const mapping: Mapping = { name: 'World' };
    const expectedOutput = 'Hello, World!';

    const output = interpolate(input, mapping);

    assertEquals(output, expectedOutput);
  });

  it('works with a mapping that is missing keys that are optional in its type', () => {
    interface Mapping {
      required: string;
      notRequired?: string;
    }
    const input = 'Hello, {required}!';
    const mapping: Mapping = { required: 'World' };
    const expectedOutput = 'Hello, World!';

    const output = interpolate(input, mapping);

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
      const mapping = { name: 'World' };
      const throwingFn = () => interpolate(badInput, mapping);

      assertThrows(
        throwingFn,
        Error,
        'Text has',
      );
    });
  }

  it('accepts a Map as mapping', () => {
    const input = '{greeting}, {planet}!';
    const mapping = new Map()
      .set('greeting', 'Hello')
      .set('planet', 'World');
    const expectedOutput = 'Hello, World!';

    const output = interpolate(input, mapping);

    assertEquals(output, expectedOutput);
  });

  it('accepts a string array as mapping', () => {
    const input = '{0}, {1}!';
    const mapping = ['Hello', 'World'];
    const expectedOutput = 'Hello, World!';

    const output = interpolate(input, mapping);

    assertEquals(output, expectedOutput);
  });

  it('accepts a regular expression', () => {
    const input = '{hullo}, {hallo}!';
    const mapping = new Map()
      .set(/h.llo/, 'hello');
    const expectedOutput = 'hello, hello!';

    const output = interpolate(input, mapping);

    assertEquals(output, expectedOutput);
  });

  it('does not partially match a regular expression', () => {
    const input = '{key}, {key2}!';
    const mapping = new Map()
      .set(/key/, 'value');
    const expectedOutput = 'value, {key2}!';

    const output = interpolate(input, mapping);

    assertEquals(output, expectedOutput);
  });

  it('if key is a regex, does not adapt the value to the placeholder\'s case', () => {
    const input = '{key} {KEY} {Key}';
    const mapping = new Map()
      .set(/key/i, 'value');
    const expectedOutput = 'value value value';

    const output = interpolate(input, mapping);

    assertEquals(output, expectedOutput);
  });

  it('can use a catch-all to replace unmatched delimiters', () => {
    const input = '{Key1} {key2} {key3}';
    const mapping = new Map()
      .set('key1', 'value1')
      .set('key2', 'value2')
      .set(/.*/, 'unmatched');
    const expectedOutput = 'Value1 value2 unmatched';

    const output = interpolate(input, mapping, { adaptCase: true });

    assertEquals(output, expectedOutput);
  });

  describe('adaptCase=true', () => {
    const adaptCase = true;

    it('if the transform can be identified, applies the transform to the value', () => {
      const input = 'Hello, {AUDIENCE}!';
      const mapping = { 'audience': 'world' };
      const expectedOutput = 'Hello, WORLD!';
      const output = interpolate(input, mapping, { adaptCase });
      assertEquals(output, expectedOutput);
    });

    it('applies case-transformation individually to each occurrence', () => {
      const input = 'lowercase {key}, uppercase {KEY}, capitalized {Key}, mixed-case {mixedKey}, unmatched {otherKey}';
      const mapping = { 'key': 'value', 'mixedKey': 'value' };
      const expectedOutput =
        'lowercase value, uppercase VALUE, capitalized Value, mixed-case value, unmatched {otherKey}';

      const output = interpolate(input, mapping, { adaptCase });

      assertEquals(output, expectedOutput);
    });

    it('if the transform cannot be identified, leaves the placeholder unchanged', () => {
      const input = '{greeting}, {myPlanet}! This is a {grEeting}!';
      const mapping = { greeting: 'Hello', myPlanet: 'World' };
      const expectedOutput = 'Hello, World! This is a {grEeting}!';

      const output = interpolate(input, mapping, { adaptCase });

      assertEquals(output, expectedOutput);
    });
  });

  // TODO: Remove when deprecated `fallbackToKey` option is removed.
  //  For now, this duplicates the test of the new `ifMissing=USE_KEY` option.
  describe('fallbackToKey option', () => {
    it('if fallbackToKey=true, gives same result as ifMissing=USE_KEY', () => {
      const input = 'Hello, {name}!';
      const mapping = {};
      const expectedOutput = interpolate(input, mapping, {
        ifMissing: 'USE_KEY',
      });

      const fallbackOutput = interpolate(input, mapping, {
        fallbackToKey: true,
      });

      assertEquals(fallbackOutput, expectedOutput);
    });
  });

  describe('ifMissing options', () => {
    it('if ifMissing=THROW and there are unmatched placeholders, throws  error listing the unused placeholders', () => {
      const input = '{greeting}, {firstName} {lastName}!';
      const mapping = { greeting: 'Hi' };

      const throwingFn = () =>
        interpolate(input, mapping, {
          ifMissing: 'THROW',
        });

      // TODO: Inflect the error message to match the number of placeholders
      assertThrows(throwingFn, Error, 'Text has unmatched placeholders: firstName, lastName');
    });

    it('if ifMissing=USE_KEY, replaces any unmatched placeholder with the placeholder itself', () => {
      const input = 'Hello, {name}!';
      const mapping = {};
      const expectedOutput = 'Hello, name!';

      const output = interpolate(input, mapping, {
        ifMissing: 'USE_KEY',
      });

      assertEquals(output, expectedOutput);
    });

    it('if ifMissing is a function, replaces any unmatched placeholder with the result of the function', () => {
      const input = 'Hello, {name}!';
      const mapping = {};
      const expectedOutput = 'Hello, World!';
      const output = interpolate(input, mapping, {
        ifMissing: () => 'World',
      });

      assertEquals(output, expectedOutput);
    });
  });
});
