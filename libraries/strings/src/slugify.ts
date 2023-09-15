export function slugify(input: string | number | ReadonlyArray<string | number>, options: SlugifyOptions = {}): string {
  const { separator = '-' } = options;
  // Limited to one character to support the `replace(new RegExp...)` below.
  if (separator.length !== 1) {
    throw new Error('Separator must be a single character.');
  }

  const inputArray = Array.isArray(input) ? input : [input];

  return inputArray
    .map((item) => item.toString())
    .join(' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '') // replace diacritics
    .toLowerCase()
    .trim()
    .replace(/[._-]/g, separator) // replace common separators with separator
    .replace(new RegExp(`[^\\${separator}a-z0-9 ]`, 'g'), '') // remove all chars except letters, numbers, spaces
    .replace(/\s+/g, separator); // replace spaces with separator
}

interface SlugifyOptions {
  separator?: string | undefined;
}
