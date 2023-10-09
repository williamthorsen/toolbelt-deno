import { segmentByDelimited } from './segmentByDelimited.ts';
import { splitDelimited } from './splitDelimited.ts';
import { IntSeededRng, pickInteger, Seed } from '../../numbers/mod.ts';

const DELIMIT = {
  opening: '[',
  closing: ']',
  separator: '|',
};

export abstract class TextNode {
  abstract kind: 'token' | 'variant';
  content: string;

  protected constructor(content: string) {
    this.content = content;
  }

  static create(content: string): TextNode {
    if (Token.isDelimited(content)) {
      return new Variant(content);
    } else {
      return new Token(content);
    }
  }

  static decodeIndices(encodedVariants: string | Integer[]): Integer[] {
    if (Array.isArray(encodedVariants)) return encodedVariants;

    const regex = /\d+/g;
    let match;
    const indices = [];

    while ((match = regex.exec(encodedVariants)) !== null) {
      indices.push(Number(match[0]));
    }

    return indices;
  }

  static delimit(content: string): string {
    return DELIMIT.opening + content + DELIMIT.closing;
  }

  static fromContent(content: string): TextNode | string {
    if (Token.isDelimited(content)) return new Variant(content);
    else if (Token.hasDelimited(content)) return new Token(content);
    return content;
  }

  static hasDelimited(text: string): boolean {
    return text.includes(DELIMIT.opening) && text.includes(DELIMIT.closing);
  }

  static isDelimited(text: string): boolean {
    return text.startsWith(DELIMIT.opening) && text.endsWith(DELIMIT.closing);
  }

  abstract pick(options?: { seed?: Seed | undefined }): string;

  abstract pickIndices(options?: { indices?: Integer[] | undefined; seed?: Seed | undefined }): Integer[];

  abstract pickIndices1(options?: { parentIndex?: string | undefined; seed?: Seed | undefined }): string[];

  abstract selectVariants(indices: Integer[] | string): string;

  abstract toString(): string;
}

class Token extends TextNode {
  children?: (TextNode | string)[];
  kind: 'token' = 'token';

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

  pickIndices(options: { indices?: Integer[] | undefined; seed?: Seed | undefined } = {}): Integer[] {
    const { indices = [] } = options;
    const seed = IntSeededRng.spawn(options.seed);

    (this.children || [])
      .filter((child): child is TextNode => typeof child !== 'string')
      .forEach((child) => {
        child.pickIndices({ indices, seed });
      });
    return indices;
  }

  pickIndices1(options: { parentIndex?: string | undefined; seed?: Seed | undefined } = {}): string[] {
    const { parentIndex = '' } = options;
    const seed = IntSeededRng.spawn(options.seed);

    return (this.children || [])
      .map((child) => typeof child === 'string' ? [] : child.pickIndices1({ parentIndex, seed }))
      .flat();
  }

  selectVariants(indices: Integer[] | string): string {
    const indicesArray = TextNode.decodeIndices(indices);
    return this.children?.map((child) => typeof child === 'string' ? child : child.selectVariants(indicesArray))?.join('') ?? '';
  }

  toString(): string {
    if (this.children) {
      return this.children.map((child) => child.toString()).join('');
    }
    return this.content;
  }
}

export class Variant extends TextNode {
  kind: 'variant' = 'variant';
  variants: (TextNode | string)[] = [];

  static buildIndex(parentIndex: number | string, childIndex: number | string): string {
    return [String(parentIndex ?? ''), String(childIndex)].filter(Boolean).join('.');
  }

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

  pickIndices(options: { indices?: Integer[] | undefined; seed?: Seed | undefined } = {}): Integer[] {
    const { indices = [] } = options;
    const seed = IntSeededRng.spawn(options.seed);

    const index = pickInteger({ max: this.variants.length - 1, seed });
    indices.push(index);
    const variant = this.variants[index];
    if (typeof variant === 'string') return indices;
    return variant.pickIndices({ indices, seed });
  }

  pickIndices1(options: { parentIndex?: string | undefined; seed?: Seed | undefined } = {}): string[] {
    const { parentIndex = '' } = options;
    const seed = IntSeededRng.spawn(options.seed);

    const index = pickInteger({ max: this.variants.length - 1, seed });
    const pickedIndex = Variant.buildIndex(parentIndex, index);

    const variant = this.variants[index];

    if (typeof variant === 'string') {
      return [pickedIndex];
    }
    return variant.pickIndices1({ parentIndex: pickedIndex, seed });
  }

  selectVariants(indices: Integer[] | string): string {
    const indicesArray = TextNode.decodeIndices(indices);

    const variantIndex = indicesArray.shift();
    if (variantIndex === undefined) throw new Error('No variant index provided');
    const selectedVariant = this.variants[variantIndex];
    if (typeof selectedVariant === 'string') return selectedVariant;
    return selectedVariant.selectVariants(indicesArray);
  }

  toString(): string {
    return TextNode.delimit(this.variants.map((variant) => variant.toString()).join(DELIMIT.separator));
  }
}

type Integer = number;
