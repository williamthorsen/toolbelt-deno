import { assertEquals, assertObjectMatch, describe, it } from '../../dev_deps.ts';
import { Interpolable } from '../Interpolable.ts';
import { interpolate, InterpolateOptions } from '../interpolate.ts';
import { StringIndexedMapping } from '../strings.types.ts';

describe('Interpolable class', () => {
  describe('classifyKeys()', () => {
    it('correctly identifies which keys have matching placeholders', () => {
      const template = '{templateOnly}{match}';
      const interpolable = new Interpolable(template);
      const mapping = { match: 'value', mappingOnly: 'value' };
      const expected = { matched: ['match'], unmatched: ['mappingOnly'] };

      const actual = interpolable.classifyKeys({ mapping });

      assertEquals(actual, expected);
    });

    it('if adaptCase=true, ignores case when comparing keys to placeholders', () => {
      const template = '{templateonly}{MATCH}';
      const interpolable = new Interpolable(template, { adaptCase: true });
      const mapping = { match: 'value', MAPPINGONLY: 'value' };
      const expected = { matched: ['match'], unmatched: ['mappingonly'] };

      const actual = interpolable.classifyKeys({ mapping });

      assertEquals(actual, expected);
    });
  });

  describe('classifyPlaceholders()', () => {
    it('correctly identifies which placeholders have matching mapping entries', () => {
      const template = 'Hello, {firstName} {lastName}!';
      const interpolable = new Interpolable(template);
      const mapping = { firstName: 'Joe' };
      const expected = { matched: ['firstName'], unmatched: ['lastName'] };

      const actual = interpolable.classifyPlaceholders({ mapping });

      assertEquals(actual, expected);
    });
  });

  describe('getPlaceholders()', () => {
    it('if the template contains no placeholders, returns an empty array', () => {
      const template = 'Hello, World!';
      const interpolable = new Interpolable(template);
      const expected: string[] = [];

      const actual = interpolable.getPlaceholders();

      assertEquals(actual, expected);
    });

    it('if the template contains placeholders, returns a unique array of them', () => {
      const template = 'To {firstName} {lastName}! Hello, {firstName}!';
      const interpolable = new Interpolable(template);
      const expected = ['firstName', 'lastName'];

      const actual = interpolable.getPlaceholders();

      assertEquals(actual, expected);
    });

    it('if adaptCase=true, returns all placeholders in lower case', () => {
      const template = '{UPPERCASE}{PascalCase}{camelCase}';
      const interpolable = new Interpolable(template, { adaptCase: true });
      const expected = ['uppercase', 'pascalcase', 'camelcase'];

      const actual = interpolable.getPlaceholders();

      assertEquals(actual, expected);
    });
  });

  describe('interpolate()', () => {
    const useCases: { template: string; mapping: StringIndexedMapping; options?: InterpolateOptions }[] = [
      {
        template: 'Hello, {name}',
        mapping: { name: 'World' },
      },
      {
        template: 'Hello, {name}',
        mapping: new Map().set('name', 'World'),
      },
      {
        template: '{bar}Hello{bar}',
        mapping: { bar: '|' },
      },
      {
        template: 'Hello, {name}',
        mapping: {},
        options: { ifMissing: 'USE_KEY' },
      },
      {
        template: 'Hello, {Name}',
        mapping: { name: 'world' },
        options: { adaptCase: true },
      },
    ];
    for (const { template, mapping, options = {} } of useCases) {
      it('has the same result as the interpolate function', () => {
        const interpolable = new Interpolable(template, options);
        const expected = interpolate(template, mapping, options);

        const actual = interpolable.interpolate({ mapping });

        assertEquals(actual, expected);
      });
    }

    it('if mapping is not given, uses the mapping stored in the instance', () => {
      const template = 'Hello, {name}';
      const mapping = { name: 'World' };
      const interpolable = new Interpolable(template).setOptions({ mapping });
      const expected = interpolate(template, mapping);

      const actual = interpolable.interpolate();

      assertEquals(actual, expected);
    });
  });

  describe('setOptions()', () => {
    const template = 'Hello, {name}';
    const interpolable = new Interpolable(template);
    for (
      const mapping of [
        new Map().set('0', 'World'),
        { 0: 'World' },
        ['World'],
      ]
    ) {
      it('optionally stores the mapping in the instance', () => {
        const expected = new Map().set('0', 'World');

        const actual = interpolable.setOptions({ mapping }).mapping;

        assertEquals(actual, expected);
      });
    }
  });

  describe('validate()', () => {
    it('if the template contains nested braces, returns failure', () => {
      const template = 'Hello, {name{foo}}';
      const interpolable = new Interpolable(template);
      const expected = {
        isValid: false,
        errors: [{ code: 'NESTED_DELIMITERS' }],
      };

      const actual = interpolable.validate();

      assertObjectMatch(actual, expected);
    });

    it('if the template contains mismatched braces, returns failure', () => {
      const template = 'Hello, {name}{';
      const interpolable = new Interpolable(template);
      const expected = {
        isValid: false,
        errors: [{ code: 'UNMATCHED_OPENING_DELIMITER' }],
      };

      const actual = interpolable.validate();

      assertObjectMatch(actual, expected);
    });
  });
});
