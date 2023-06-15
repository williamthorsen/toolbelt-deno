/**
 * Given a string that contains delimited variants [variant1|variant2|variant3], replaces the variants with a
 * randomly selected one and returns the new string.
 * TODO: Throw an error if the delimiters are mismatched.
 * TODO: Allow the delimiter to be customized.
 * TODO: Accept an optional seed that makes the results deterministic.
 */
export function pickVariants(text: string): string {
  // Validate input
  const leftDelimiters = (text.match(/\[/g) || []).length;
  const rightDelimiters = (text.match(/]/g) || []).length;

  if (leftDelimiters !== rightDelimiters) {
    throw new Error('Variant delimiters [ ] are mismatched.');
  }

  const variantRegex = /\[([^\[\]]*?)]/g;
  const result = text.replace(variantRegex, (_delimitedVariants, variants: string): string => {
    const variantList = variants.split('|');
    const randomIndex = Math.floor(Math.random() * variantList.length);
    return variantList[randomIndex];
  });

  // If the result still contains variants, call pickVariants again
  if (variantRegex.test(result)) {
    return pickVariants(result);
  }

  return result;
}
