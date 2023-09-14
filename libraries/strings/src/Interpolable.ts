import { hasOwnProperty } from '../../objects/src/hasOwnProperty.ts';
import type { InterpolateOptions } from './interpolate.ts';
import { createDelimitedMatcher, interpolate } from './interpolate.ts';
import type { StringMapping } from './strings.types.ts';
import { validateDelimiters } from './validateDelimiters.ts';

export class Interpolable {
  adaptCase = false;
  ifMissing: InterpolateOptions['ifMissing'] = 'IGNORE';
  template: string;

  constructor(template: string, options: InterpolateOptions = {}) {
    this.template = template;
    this.setOptions(options);
  }

  classifyPlaceholders<T>(mapping: StringMapping<T>): Classification {
    const matched = new Set<string>();
    const unmatched = new Set<string>();
    for (const placeholder of this.getPlaceholders()) {
      if (hasOwnProperty(mapping, placeholder) && mapping[placeholder] !== undefined) {
        matched.add(placeholder);
      } else {
        unmatched.add(placeholder);
      }
    }
    return { matched: Array.from(matched), unmatched: Array.from(unmatched) };
  }

  getPlaceholders(): string[] {
    const matcher = createDelimitedMatcher(/([^}]+)/);
    const placeholderMatches = this.template.matchAll(matcher);
    const placeholderSet = new Set<string>();
    for (const [_, placeholder] of placeholderMatches) {
      placeholderSet.add(placeholder);
    }
    return Array.from(placeholderSet);
  }

  interpolate<T>(dictionary: StringMapping<T>, options: InterpolateOptions = {}): string {
    const mergedOptions = {
      adaptCase: this.adaptCase,
      ifMissing: this.ifMissing,
      ...options,
    };
    return interpolate(this.template, dictionary, mergedOptions);
  }

  setOptions(options: InterpolateOptions = {}): this {
    const { adaptCase, ifMissing } = options;
    if (adaptCase !== undefined) this.adaptCase = adaptCase;
    if (ifMissing !== undefined) this.ifMissing = ifMissing;
    return this;
  }

  validate() {
    return validateDelimiters(this.template, { opening: '{', closing: '}', disallowNested: true });
  }
}

interface Classification {
  matched: string[];
  unmatched: string[];
}
