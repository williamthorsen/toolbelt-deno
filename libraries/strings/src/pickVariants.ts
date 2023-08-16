import { pickRandomItem } from '../../arrays/src/pickRandomItem.ts';

/**
 * Given a string that contains delimited variants [variant1|variant2|variant3], replaces the variants with a
 * randomly selected one and returns the new string.
 * TODO: Throw an error if the delimiters are mismatched.
 * TODO: Allow the delimiter to be customized.
 * TODO: Accept an optional seed that makes the results deterministic.
 */
export function pickVariants(text: string, options: Options = {}): string {
  // Check that the delimiters are correctly nested
  const stack = [];
  for (const char of text) {
    if (char === '[') {
      stack.push(char);
    } else if (char === ']') {
      if (stack.length === 0 || stack.pop() !== '[') {
        throw new Error('Variant delimiters [ ] are incorrectly nested.');
      }
    }
  }
  if (stack.length > 0) {
    throw new Error('Variant delimiters [ ] are incorrectly nested.');
  }

  const variantRegex = /\[([^\[\]]*?)]/g;
  const result = text.replace(variantRegex, (_delimitedVariants, variants: string): string => {
    return pickRandomItem(variants.split('|'), options);
  });

  // If the result still contains variants, call pickVariants again
  if (variantRegex.test(result)) {
    return pickVariants(result);
  }

  return result;
}

interface Options {
  seed?: number;
}
