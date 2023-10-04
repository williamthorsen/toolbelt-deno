/**
 * Checks a target string against one or more string or RegExp patterns.
 * Returns true if the target string exactly matches a string pattern or matches any RegExp pattern, else false.
 * @experimental
 */
export function isPatternMatch(pattern: Patterns, target: string): boolean {
  if (!target) return false;

  const patterns = Array.isArray(pattern) ? pattern : [pattern];

  return patterns.some((p) => {
    if (typeof p === 'string') return target === p;
    if (p instanceof Function) return p(target);
    return p.test(target);
  });
}

type Pattern = string | RegExp | ((input: string) => boolean);
type Patterns = Pattern | ReadonlyArray<Pattern>;
