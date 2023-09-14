import type { StrictObject } from './strings.types.ts';
import { deriveCaseTransformer } from './deriveCaseTransformer.ts';
import { validateDelimiters } from './validateDelimiters.ts';

/**
 * Replaces the placeholders in a string with the values passed in the dictionary object.
 * If a placeholder does not match any key in the dictionary, it is left unchanged.
 * If a placeholder matches multiple keys in the dictionary, all occurrences are replaced.
 */
// Overload for Map
export function interpolate(
  text: string,
  dictionary: Map<string, string>,
  options?: InterpolateOptions,
): string;
// Overload for generic object types
export function interpolate<T extends object, K extends string>(
  text: string,
  dictionary: StrictObject<T>, // exclude
  options?: InterpolateOptions,
): string;
// FIXME: This signature has the desired effect but is not consistent with the overloads.
export function interpolate<T extends Record<string, string>>(
  text: string,
  dictionary: T | Map<string, string>,
  options: InterpolateOptions = {},
): string {
  const { adaptCase, fallbackToKey, ifMissing = 'IGNORE' } = options;

  assertHasValidDelimiters(text);

  const map = dictionary instanceof Map ? dictionary : new Map(Object.entries(dictionary));

  let newText = text;
  for (const [key, value] of map) {
    const matcher = createDelimitedMatcher(key);
    const insensitiveMatcher = createDelimitedMatcher(key, { caseInsensitive: true });

    // 1. Perform replacements
    newText = newText.replace(insensitiveMatcher, (delimitedPlaceholder): string => {
      const placeholder = delimitedPlaceholder.slice(1, -1);

      const isMatch = typeof key === 'string' ? placeholder === key : delimitedPlaceholder.match(matcher);
      const isInsensitiveMatch = typeof key === 'string'
        ? placeholder.toLowerCase() === key
        : delimitedPlaceholder.match(insensitiveMatcher);

      // The simplest case is that the placeholder is a case-sensitive match. No transformation is needed.
      if (isMatch) {
        return value;
      } // If the placeholder is not the same as the key, check whether its lowercase version is.
      // We don't try to automate any other conversions.
      else if (adaptCase && typeof key === 'string' && isInsensitiveMatch) {
        // Identify the transformation that transforms the dictionary key to have the same case as the placeholder.
        // We can then apply the same function to the dictionary value.
        const transform = deriveCaseTransformer(key, placeholder);
        if (transform !== null) {
          return transform(value);
        }
      }
      return delimitedPlaceholder;
    });
  }
  // If ifMissing is defined, handle any remaining occurrences of the placeholder.
  if (ifMissing !== 'IGNORE' || fallbackToKey) {
    const matcher = createDelimitedMatcher(/([^}]+)/);
    if (fallbackToKey || ifMissing === 'USE_KEY') {
      return newText.replace(matcher, (_, placeholder) => placeholder);
    }
    if (ifMissing === 'THROW') {
      const unhandledPlaceholders = newText.matchAll(matcher);
      if (unhandledPlaceholders !== null) {
        const placeholders = Array.from(unhandledPlaceholders).map(([_, placeholder]) => placeholder);
        // TODO: Inflect the error message to match the number of placeholders
        throw new Error(`Text has unmatched placeholders: ${placeholders.join(', ')}`);
      }
    }
    if (typeof ifMissing === 'function') {
      return newText.replace(matcher, (_, placeholder) => ifMissing(placeholder));
    }
  }

  return newText;
}

/**
 * Encloses a matcher in braces, so that only delimited placeholders are matched.
 */
export function createDelimitedMatcher(matcher: RegExp | string, options: DelimitedMatcherOptions = {}): RegExp {
  const { caseInsensitive } = options;

  const matcherSource = typeof matcher === 'string' ? matcher : matcher.source;
  const matcherFlagsSet = new Set(typeof matcher === 'string' ? [] : matcher.flags.split(''));

  matcherFlagsSet.add('g');

  if (caseInsensitive) {
    matcherFlagsSet.add('i');
  }
  const matcherFlags = Array.from(matcherFlagsSet).join('');

  return new RegExp(`\\{${matcherSource}\\}`, matcherFlags);
}

interface DelimitedMatcherOptions {
  caseInsensitive?: boolean | undefined;
}

function assertHasValidDelimiters(input: string): void {
  const [validationError] = validateDelimiters(input, { opening: '{', closing: '}', disallowNested: true }).errors;
  if (validationError) {
    const braceMessage = validationError.message
      .replace('opening delimiter "{"', 'opening brace')
      .replace('closing delimiter "}"', 'closing brace');
    throw new Error(braceMessage);
  }
}

export interface InterpolateOptions {
  // if true, will try to adapt the case of the dictionary value to match the placeholder
  adaptCase?: boolean;
  /** @deprecated Use `ifMissing` instead */
  fallbackToKey?: boolean | undefined;
  // what to do if a placeholder is not found in the dictionary
  ifMissing?: 'IGNORE' | 'THROW' | 'USE_KEY' | ((placeholder: string) => string) | undefined;
}
