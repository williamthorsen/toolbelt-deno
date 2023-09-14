import { assertEquals, assertThrows, describe, it } from '../../dev_deps.ts';
import { validateDelimiters } from '../validateDelimiters.ts';

describe('validateDelimiters()', () => {
  it('given a string without delimiters, returns success', () => {
    const input = 'Hello, world!';
    const params = { opening: '{', closing: '}' };

    const output = validateDelimiters(input, params);

    assertEquals(output, { isValid: true, errors: [] });
  });

  it('given a string with matching delimiters, returns success', () => {
    const input = 'Hello, {world}!';
    const params = { opening: '{', closing: '}' };

    const output = validateDelimiters(input, params);

    assertEquals(output, { isValid: true, errors: [] });
  });

  it('given a string with unmatched opening delimiter, returns failure', () => {
    const input = 'Hello, {world!';
    const params = { opening: '{', closing: '}' };

    const output = validateDelimiters(input, params);

    assertEquals(output, {
      isValid: false,
      errors: [{
        code: 'UNMATCHED_OPENING_DELIMITER',
        message: 'Text has unmatched opening delimiter "{".',
      }],
    });
  });

  it('given a string with unmatched closing delimiter, returns failure', () => {
    const input = 'Hello, world}!';
    const params = { opening: '{', closing: '}' };

    const output = validateDelimiters(input, params);

    assertEquals(output, {
      isValid: false,
      errors: [{
        code: 'UNMATCHED_CLOSING_DELIMITER',
        message: 'Text has unmatched closing delimiter "}".',
      }],
    });
  });

  it('given a string with nested matching delimiters, returns success', () => {
    const input = 'Hello, {wo{r}ld}!';
    const params = { opening: '{', closing: '}' };

    const output = validateDelimiters(input, params);

    assertEquals(output, { isValid: true, errors: [] });
  });

  it('given a string with incorrectly nested delimiters, returns failure', () => {
    const input = 'Hello, {wo}r}ld!';
    const params = { opening: '{', closing: '}' };

    const output = validateDelimiters(input, params);

    assertEquals(output, {
      isValid: false,
      errors: [{
        code: 'UNMATCHED_CLOSING_DELIMITER',
        message: 'Text has unmatched closing delimiter "}".',
      }],
    });
  });

  it('if delimiters match, throws an error', () => {
    const input = '';
    const params = { opening: '{', closing: '{' };

    const throwingFn = () => validateDelimiters(input, params);

    assertThrows(
      throwingFn,
      Error,
      'Opening and closing delimiters must be different.',
    );
  });
});
