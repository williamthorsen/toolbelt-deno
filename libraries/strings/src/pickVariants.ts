import type { Seed } from '../sibling_deps.ts';
import { pickItem, SeededRng } from '../sibling_deps.ts';
import { validateDelimiters } from './validateDelimiters.ts';
import { segmentByDelimited } from './segmentByDelimited.ts';

const DELIMITER_OPTIONS = { opening: '[', closing: ']' };
const VARIANT_REGEX = /\[([^\[\]]*?)]/g;

/**
 * Given a string that contains delimited variants [variant1|variant2|variant3], replaces the variants with a
 * randomly selected one and returns the new string.
 * TODO: Allow the delimiter to be customized.
 */
export function pickVariants(text: string, options: Options = {}): string {
  const seed = SeededRng.spawn(options.seed);

  validateDelimiters(text, { ...DELIMITER_OPTIONS, throwOnError: true });

  if (!VARIANT_REGEX.test(text)) {
    return text;
  }

  if (!hasNestedDelimiters(text)) {
    pickUnnestedVariants(text, { seed });
  }

  if (text.startsWith('[') && text.endsWith(']')) {
    const resolvedInner = pickVariants(text.slice(1, -1), { seed });
    return pickUnnestedVariants('[' + resolvedInner + ']', { seed });
  }

  const segments = segmentByDelimited(text, DELIMITER_OPTIONS);

  return pickVariants(
    segments.map((segment) => {
      return pickVariants(segment, { seed });
    }).join(''),
  );
}

/**
 * Given a string that contains otherwise valid delimiters, returns true if any delimiters are nested.
 * @internal
 */
function hasNestedDelimiters(text: string): boolean {
  return !validateDelimiters(text, { ...DELIMITER_OPTIONS, disallowNested: true }).isValid;
}

export function pickUnnestedVariants(text: string, options: Options = {}): string {
  const seed = SeededRng.spawn(options.seed);

  // Check that the delimiters are correctly nested
  validateDelimiters(text, { ...DELIMITER_OPTIONS, disallowNested: true, throwOnError: true });

  if (!VARIANT_REGEX.test(text)) {
    return text;
  }

  return text.replace(VARIANT_REGEX, (_delimitedVariants, variants: string) => {
    return pickItem(variants.split('|'), { seed });
  });
}

interface Options {
  seed?: Seed | undefined;
}

interface VariantsResult {
  text: string;
  variants: string[];
}
