import { deriveCaseTransformer } from './deriveCaseTransformer.ts';

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
    } // If the placeholder is not in the dictionary, check whether its lowercase version is in the dictionary.
    // We don't try to automate any other conversions.
    else if (adaptCase && lcPlaceholder in dictionary) {
      // Identify the transformation that transforms the dictionary key to have the same case as the placeholder.
      // We can then apply the same function to the dictionary value.
      const transform = deriveCaseTransformer(lcPlaceholder, placeholder);
      if (transform !== null) {
        return transform(dictionary[lcPlaceholder]);
      }
    }
    // The key wasn't found. Return the placeholder itself or the delimited placeholder, depending on the option.
    return fallbackToKey ? placeholder : delimitedPlaceholder;
  });
}

interface Options {
  adaptCase?: boolean; // if true, will try to adapt the case of the dictionary value to match the placeholder
  fallbackToKey?: boolean; // if true, use the undelimited placeholder itself if it is not found in the dictionary
}
