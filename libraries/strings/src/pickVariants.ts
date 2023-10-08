import type { Seed } from '../sibling_deps.ts';
import { pickItem, SeededRng } from '../sibling_deps.ts';
import { validateDelimiters } from './validateDelimiters.ts';

/**
 * Given a string that contains delimited variants [variant1|variant2|variant3], replaces the variants with a
 * randomly selected one and returns the new string.
 * TODO: Throw an error if the delimiters are mismatched.
 * TODO: Allow the delimiter to be customized.
 */
export function pickVariants(text: string, options: Options = {}): string {
  const seed = SeededRng.spawn(options.seed);

  // Check that the delimiters are correctly nested
  const validationResult = validateDelimiters(text, { opening: '[', closing: ']' });
  if (!validationResult.isValid) {
    throw new Error(validationResult.errors[0].message);
  }

  const variantRegex = /\[([^\[\]]*?)]/g;
  const result = text.replace(variantRegex, (_delimitedVariants, variants: string): string => {
    return pickItem(variants.split('|'), { seed });
  });

  // If the result still contains variants, call pickVariants again
  if (variantRegex.test(result)) {
    return pickVariants(result, { seed });
  }

  return result;
}

interface Options {
  seed?: Seed | undefined;
}
