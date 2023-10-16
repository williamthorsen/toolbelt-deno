import { assertEquals, describe, it } from '../../dev_deps.ts';

import { enclose } from '../enclose.ts';

describe('enclose()', () => {
  const content = 'content';

  it('encloses the string in the delimiters', () => {
    const opening = '[';
    const closing = ']';
    const expected = '[content]';

    const actual = enclose(opening, closing)(content);

    assertEquals(actual, expected);
  });

  it('if only the opening string is given, also uses it as the closing string', () => {
    const opening = '|';
    const expected = '|content|';

    const actual = enclose(opening)(content);

    assertEquals(actual, expected);
  });
});
