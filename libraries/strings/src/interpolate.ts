import { deriveCaseTransformer } from './deriveCaseTransformer.ts';

/**
 * Replaces the placeholders in a string with the values passed in the dictionary object.
 * If a placeholder does not match any key in the dictionary, it is left unchanged.
 * If a placeholder matches multiple keys in the dictionary, all occurrences are replaced.
 */
export function interpolate<K extends string>(
  text: string,
  dictionary: Map<K | RegExp, string> | Record<K, string>,
  options: Options = {},
): string {
  const { adaptCase, fallbackToKey } = options;

  assertHasNoNestedBraces(text);
  assertHasNoUnmatchedBraces(text);

  const map = dictionary instanceof Map ? dictionary : new Map(Object.entries<string>(dictionary));

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
  // If fallbackToKey=true, replace any remaining occurrences of the placeholder with the placeholder itself.
  if (fallbackToKey) {
    const matcher = createDelimitedMatcher(/(.+)/);
    newText = newText.replace(
      matcher,
      (_, placeholder) => placeholder,
    );
  }

  return newText;
}

/**
 * Encloses a matcher in braces, so that only delimited placeholders are matched.
 */
function createDelimitedMatcher(matcher: RegExp | string, options: DelimitedMatcherOptions = {}): RegExp {
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

function assertHasNoNestedBraces(input: string): void {
  let openBracesCount = 0;

  for (const char of input) {
    if (char === '{') {
      openBracesCount++;
      if (openBracesCount > 1) {
        throw new Error('Text has nested delimiter braces.');
      }
    } else if (char === '}') {
      openBracesCount--;
    }
  }
}

function assertHasNoUnmatchedBraces(input: string): void {
  let openBracesCount = 0;

  for (const char of input) {
    if (char === '{') {
      openBracesCount++;
    } else if (char === '}') {
      if (openBracesCount === 0) {
        throw new Error('Text has unmatched closing brace.');
      }
      openBracesCount--;
    }
  }

  if (openBracesCount !== 0) {
    throw new Error('Text has unmatched opening brace.');
  }
}

interface Options {
  adaptCase?: boolean; // if true, will try to adapt the case of the dictionary value to match the placeholder
  fallbackToKey?: boolean; // if true, use the undelimited placeholder itself if it is not found in the dictionary
}
