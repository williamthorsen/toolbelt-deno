import { segmentByDelimited } from './segmentByDelimited.ts';
import { splitDelimited } from './splitDelimited.ts';
import { IntSeededRng, pickInteger, Seed } from '../../numbers/mod.ts';
import { validateDelimiters } from './validateDelimiters.ts';

const DELIMIT = {
  opening: '[',
  closing: ']',
  separator: '|',
};

/**
 * Class for building an abstract syntax tree (AST) of static text nodes (tokens) and variants.
 * @experimental
 */
export abstract class TextNode {
  content: string;
  variantIndexCount = 0;

  protected constructor(content: string) {
    this.content = content;
  }

  static create(content: string): TextNode {
    if (TokenNode.hasDelimited(content)) {
      validateDelimiters(content, { ...DELIMIT, throwOnError: true });
    }
    if (TokenNode.isDelimited(content)) {
      return new VariantNode(content);
    } else {
      return new TokenNode(content);
    }
  }

  static decodeIndices(encodedIndices: string | VariantIndices): Integer[] {
    if (typeof encodedIndices !== 'string') {
      if (isNumberArray(encodedIndices)) return encodedIndices;
      return flatten(encodedIndices);
    }

    const regex = /\d+/g;
    let match;
    const indices = [];

    while ((match = regex.exec(encodedIndices)) !== null) {
      indices.push(Number(match[0]));
    }

    return indices;
  }

  static delimit(content: string): string {
    return enclose(content, DELIMIT);
  }

  static encodeIndices(arr: VariantIndices, depth = 0): string {
    let result = '';

    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      if (typeof element === 'number') {
        result += element.toString();
      } else if (Array.isArray(element)) {
        let encodedIndices = TextNode.encodeIndices(element, depth + 1);
        if (depth) encodedIndices = TextNode.delimit(encodedIndices);
        result += encodedIndices;
      }
      const isNotLastElement = i < arr.length - 1;
      const separator = depth === 0 ? enclose(DELIMIT.separator, { opening: ' ', closing: ' ' }) : DELIMIT.separator;
      if (isNotLastElement && (!(Array.isArray(arr[i + 1])) || depth === 0)) result += separator;
    }

    return result;
  }

  static fromContent(content: string): TextNode | string {
    if (TokenNode.isDelimited(content)) return new VariantNode(content);
    else if (TokenNode.hasDelimited(content)) return new TokenNode(content);
    return content;
  }

  static hasDelimited(text: string): boolean {
    return text.includes(DELIMIT.opening) || text.includes(DELIMIT.closing);
  }

  static isDelimited(text: string): boolean {
    return text.startsWith(DELIMIT.opening) && text.endsWith(DELIMIT.closing);
  }

  assertAllIndicesConsumed(indices: number[], depth: number): void | never {
    if (depth === 0 && indices.length > 0) {
      throw new Error(`Unused variant indices. Received ${this.variantIndexCount}, leaving ${indices.length} unused.`);
    }
  }

  decodeIndices(encodedIndices: string | VariantIndices, depth: Integer = 0): Integer[] {
    const decodedIndices = TextNode.decodeIndices(encodedIndices);

    // Store the initial length of the indices array for later use in an error message
    if (depth === 0) this.variantIndexCount = decodedIndices.length;

    return decodedIndices;
  }

  abstract pick(options?: { seed?: Seed | undefined }): string;

  abstract pickIndices(
    options?: { depth?: Integer; indices?: VariantIndices | undefined; seed?: Seed | undefined },
  ): VariantIndices;

  abstract selectVariants(indices: string | VariantIndices, options?: { depth?: Integer }): string;

  abstract toString(): string;
}

class TokenNode extends TextNode {
  children?: (TextNode | string)[];

  constructor(content: string) {
    super(content);
    if (TextNode.hasDelimited(content)) {
      this.children = segmentByDelimited(content, DELIMIT).map((segment) => TextNode.fromContent(segment));
    }
  }

  pick(options: { seed?: Seed | undefined } = {}): string {
    const seed = IntSeededRng.spawn(options.seed);
    if (this.children) {
      return this.children.map((child) => typeof child === 'string' ? child : child.pick({ seed })).join('');
    }
    return this.content;
  }

  pickIndices(options: { depth?: Integer; seed?: Seed | undefined } = {}): VariantIndices {
    const { depth = 0 } = options;
    const seed = IntSeededRng.spawn(options.seed);

    const indices: VariantIndices = [];

    (this.children || [])
      .filter((child): child is VariantNode => child instanceof VariantNode)
      .forEach((variant) => {
        const childIndices = variant.pickIndices({ depth: depth + 1, seed });
        indices.push(
          childIndices.length === 1 ? childIndices[0] : childIndices,
        );
      });

    // Avoid unnecessary nesting
    return (indices.length === 1 && Array.isArray(indices[0])) ? indices[0] : indices;
  }

  selectVariants(indices: string | VariantIndices, options: { depth?: Integer } = {}): string {
    const { depth = 0 } = options;

    const decodedIndices = this.decodeIndices(indices, depth);
    const resolvedContent = (() => {
      if (!this.children) {
        return '';
      }

      const childContents = this.children.map((child) => {
        if (typeof child === 'string') return child;
        return child.selectVariants(decodedIndices, { depth: depth + 1 });
      });
      return childContents.join('');
    })();

    this.assertAllIndicesConsumed(decodedIndices, depth);
    return resolvedContent;
  }

  toString(): string {
    if (this.children) {
      return this.children.map((child) => child.toString()).join('');
    }
    return this.content;
  }
}

export class VariantNode extends TextNode {
  variants: (TextNode | string)[] = [];

  constructor(content: string) {
    super(content);
    this.variants = splitDelimited(content, DELIMIT).map((variant) => TextNode.fromContent(variant));
  }

  // Choose a variant at random
  pick(options: { seed?: Seed | undefined } = {}): string {
    const seed = IntSeededRng.spawn(options.seed);

    const index = pickInteger({ max: this.variants.length - 1, seed });

    const variant = this.variants[index];
    if (typeof variant === 'string') return variant;
    return variant.pick({ seed });
  }

  pickIndices(options: { depth?: Integer; seed?: Seed | undefined } = {}): VariantIndices {
    const { depth = 0 } = options;
    const seed = IntSeededRng.spawn(options.seed);

    const index = pickInteger({ max: this.variants.length - 1, seed });
    const nodeOrString = this.variants[index];

    const indices: VariantIndices = [index]; // index of the picked variant

    if (nodeOrString instanceof TextNode) {
      const childIndices = nodeOrString.pickIndices({ depth: depth + 1, seed });
      if (childIndices.length > 0) indices.push(childIndices);
    }

    return indices;
  }

  selectVariants(indices: VariantIndices, options: { depth?: Integer } = {}): string {
    const { depth = 0 } = options;
    const decodedIndices = this.decodeIndices(indices, depth);
    const variantIndex = decodedIndices.shift();

    if (variantIndex === undefined) throw new Error('Not enough indices to resolve all variants.');

    const selectedVariant = this.variants[variantIndex];
    if (selectedVariant === undefined) {
      throw new RangeError(
        `Variant index exceeds maximum index. Expected maximum of ${this.variants.length - 1}, got ${variantIndex}.`,
      );
    }

    const resolvedContent = (() => {
      if (typeof selectedVariant === 'string') return selectedVariant;
      return selectedVariant.selectVariants(decodedIndices, { depth: depth + 1 });
    })();

    this.assertAllIndicesConsumed(decodedIndices, depth);
    return resolvedContent;
  }

  toString(): string {
    return TextNode.delimit(this.variants.map((variant) => variant.toString()).join(DELIMIT.separator));
  }
}

function enclose(content: string, options: { opening: string; closing: string }): string {
  const { opening, closing } = options;
  return opening + content + closing;
}

function flatten(indices: VariantIndices): number[] {
  let flatIndices: number[] = [];
  for (const index of indices) {
    if (Array.isArray(index)) {
      flatIndices = flatIndices.concat(flatten(index));
    } else {
      flatIndices.push(index);
    }
  }
  return flatIndices;
}

function isNumberArray(items: unknown[]): items is number[] {
  return Array.isArray(items) && items.every((item) => typeof item === 'number');
}

type Integer = number;

type VariantIndices = (Integer | VariantIndices)[];
