import { assertEquals, describe, it } from '../../dev_deps.ts';
import { deriveCaseTransformer } from '../deriveCaseTransformer.ts';

describe('deriveCaseTransformer()', () => {
  it('if the sourge and target are identical, returns an identity function', () => {
    const source = 'abCde';

    const transform = deriveCaseTransformer(source, source);

    assertIsTruthy(transform);
    assertEquals(transform('ABcDE'), 'ABcDE');
  });

  it('if the source and the target are not identical when case is ignored, returns null', () => {
    const source = 'abc';
    const target = 'def';

    const transform = deriveCaseTransformer(source, target);

    assertEquals(transform, null);
  });

  for (const source of ['TEXT', 'Text', 'TeXt']) {
    it('if the source is not lowercase and does not match the target, returns null', () => {
      const target = 'texT';

      const transform = deriveCaseTransformer(source, target);

      assertEquals(transform, null);
    });
  }

  it('if uppercase(source) is identical to the target, returns a toUpperCase function', () => {
    const source = 'text';
    const target = 'TEXT';

    const transform = deriveCaseTransformer(source, target);

    assertIsTruthy(transform);
    assertEquals(transform('abc'), 'ABC');
  });

  it('if capitalize(source) is identical to the target, returns a toCapitalized function', () => {
    const source = 'text';
    const target = 'Text';

    const transform = deriveCaseTransformer(source, target);

    assertIsTruthy(transform);
    assertEquals(transform('abc'), 'Abc');
  });

  it('if neither uppercase nor capitalize makes the source identical to the target, returns null', () => {
    const source = 'text';
    const target = 'tExt';

    const transform = deriveCaseTransformer(source, target);

    assertEquals(transform, null);
  });
});

/** Type guard to assure TypeScript that null won't be invoked. */
function assertIsTruthy(value: unknown): asserts value {
  if (!value) {
    throw new Error(`Expected ${value} to be truthy`);
  }
}
