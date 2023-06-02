/**
 * Replaces the placeholders in a string with the values passed in the dictionary object.
 * If a placeholder does not match any key in the dictionary, it is left unchanged.
 * If a placeholder matches multiple keys in the dictionary, all occurrences are replaced.
 */
export function interpolate<K extends string>(
  text: string,
  dictionary: Record<string, string>,
  options: Options = {},
): string {
  const { adaptCase, fallbackToKey } = options;
  const placeholderRegex = /{([a-zA-Z_]+[a-zA-Z0-9_]*)}/g;
  return text.replace(placeholderRegex, (delimitedPlaceholder, placeholder: string): string => {
    const lcPlaceholder = placeholder.toLowerCase();
    // The simplest case is that the placeholder matches a key in the dictionary. No transformation is needed.
    if (placeholder in dictionary) {
      return dictionary[placeholder];
    } // If the placeholder is not lowercase and not in the dictionary, check whether its lowercase version is in the
    // dictionary. We don't try to automate any other conversions.
    else if (adaptCase && lcPlaceholder in dictionary) {
      // What transformation do we need to apply to the dictionary value to match the case of the placeholder?
      const transform = detectTransformation(lcPlaceholder, placeholder);
      if (typeof transform !== 'boolean') {
        return transform?.(dictionary[lcPlaceholder]) ?? dictionary[lcPlaceholder];
      }
    }
    // The key wasn't found. Return the placeholder itself or the delimited placeholder, depending on the option.
    return fallbackToKey ? placeholder : delimitedPlaceholder;
  });
}

/**
 * Returns a function that transforms the original text into the transformed text.
 * If the original and the transformed text are already identical, return null.
 * If the placeholder is lowercase, return null.
 * If the placeholder is uppercase, return 'uppercase'.
 * If the placeholder is capitalized, return 'capitalized'.
 * If the placeholder is not lowercase, uppercase, or capitalized, throw an error.
 */
function detectTransformation(original: string, transformed: string): ((text: string) => string) | null | boolean {
  const lcOriginal = original.toLowerCase();
  if (lcOriginal !== transformed.toLowerCase()) {
    throw new Error(`Transformed string does not match original string: ${transformed} !== ${original}`);
  }
  if (original !== lcOriginal) {
    console.warn('Key is not lowercase');
    return null;
  }
  if (transformed === original) {
    return null;
  } else if (transformed === original.toUpperCase()) {
    console.log('UPPERCASE detected');
    return (text: string) => text.toUpperCase();
  } else if (transformed === original[0].toUpperCase() + original.slice(1)) {
    console.log('CAPITALIZED detected');
    return (text: string) => text[0].toUpperCase() + text.slice(1).toLowerCase();
  } else {
    return false;
  }
}

interface Options {
  adaptCase?: boolean; // if true, will try to adapt the case of the dictionary value to match the placeholder
  fallbackToKey?: boolean; // if true, use the undelimited placeholder itself if it is not found in the dictionary
}
