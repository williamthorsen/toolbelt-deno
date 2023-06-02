import { interpolate } from '../interpolate.ts';
import { assertEquals, describe, it } from '../../dev_deps.ts';

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

  // TODO: Relax this requirement. Any string should be usable as a placeholder.
  it('ignores placeholders that start with a number', () => {
    const input = 'Hello, {1name}!';
    const dictionary = { '1name': 'World' };
    const expectedOutput = 'Hello, {1name}!';
    const output = interpolate(input, dictionary);
    assertEquals(output, expectedOutput);
  });

  // TODO: Relax this requirement. Any string should be usable as a placeholder.
  it('ignores placeholders that include a space', () => {
    const input = 'Hello, {name with space}!';
    const dictionary = { 'name with space': 'World' };
    const expectedOutput = 'Hello, {name with space}!';
    const output = interpolate(input, dictionary);
    assertEquals(output, expectedOutput);
  });

  describe('adaptCase=true', () => {
    const adaptCase = true;

    it('if the placeholder is equal to the uppercased key, transforms the value to upper case', () => {
      const input = 'Hello, {AUDIENCE}!';
      const dictionary = { 'audience': 'world' };
      const expectedOutput = 'Hello, WORLD!';
      const output = interpolate(input, dictionary, { adaptCase });
      assertEquals(output, expectedOutput);
    });

    it('if the placeholder is equal to the capitalized key, capitalizes the value', () => {
      const input = 'Hello, {Audience}!';
      const dictionary = { 'audience': 'world' };
      const expectedOutput = 'Hello, World!';
      const output = interpolate(input, dictionary, { adaptCase });
      assertEquals(output, expectedOutput);
    });

    it('if a mixed-case placeholder exactly matches a key, uses the value', () => {
      const input = 'Hello, {myPlanet}!';
      const dictionary = { 'myPlanet': 'Earth' };
      const expectedOutput = 'Hello, Earth!';
      const output = interpolate(input, dictionary, { adaptCase });
      assertEquals(output, expectedOutput);
    });

    it('if a mixed-case placeholder does not exactly match a key, leaves the placeholder unchanged', () => {
      const input = 'Hello, {myPlanet}!';
      const dictionary = { 'myplanet': 'Earth' };
      const expectedOutput = 'Hello, {myPlanet}!';

      const output = interpolate(input, dictionary, { adaptCase });

      assertEquals(output, expectedOutput);
    });

    it('applies case-transformation individually to each occurrence', () => {
      const input = 'lowercase {key}, uppercase {KEY}, capitalized {Key}, unmatched {kEy}';
      const dictionary = { 'key': 'value' };
      const expectedOutput = 'lowercase value, uppercase VALUE, capitalized Value, unmatched {kEy}';

      const output = interpolate(input, dictionary, { adaptCase });

      assertEquals(output, expectedOutput);
    });

    it('if a mixed-case placeholder does not exactly match a key and fallbackToKey=true, removes the delimiters of unmatched placeholders', () => {
      const input = '{greeting}, {myPlanet}! This is a {grEeting}!';
      const dictionary = { greeting: 'Hello' };
      const expectedOutput = 'Hello, myPlanet! This is a grEeting!';
      const output = interpolate(input, dictionary, {
        adaptCase,
        fallbackToKey: true,
      });
      assertEquals(output, expectedOutput);
    });
  });
});
