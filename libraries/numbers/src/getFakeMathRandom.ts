/**
 * Deterministically computes and returns a number in the range [0, 1) based on the input.
 * Used internally in this library. Not part of the public API.
 */
export function getFakeMathRandom(seed: number): number {
  // Convert the seed to a string representation to extract as much variation
  const strSeed = seed.toString().replace('.', ''); // Remove the decimal point for further processing

  let hash = 0;

  // Use a string-based hashing approach
  for (let i = 0; i < strSeed.length; i++) {
    const char = strSeed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to a 32-bit integer
  }

  // Mix the bits a little
  hash += hash << 10;
  hash ^= hash >> 6;
  hash += hash << 3;
  hash ^= hash >> 11;
  hash += hash << 15;

  // Convert to a number in the range [0, 1)
  return (hash & 0x7FFFFFFF) / 0x7FFFFFFF;
}
