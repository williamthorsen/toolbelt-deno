import { END_OF_LINE, unindent } from "../unindent.ts";
import { assertEquals, assertThrows, describe, it } from "./test.deps.ts";

describe("unindent``", () => {
  it("if the first and last line are empty, discards them", () => {
    const expected = [
      "first line",
      "second line",
    ].join(END_OF_LINE);

    const unindented = unindent`
      first line
      second line
    `;

    assertEquals(unindented, expected);
  });

  it("if a line other than the first or last is empty, ignores it for purposes of computing the final indent", () => {
    const expected = [
      "",
      "previous line is empty but ignored",
    ].join(END_OF_LINE);

    const unindented = unindent`

      previous line is empty but ignored
    `;

    assertEquals(unindented, expected);
  });

  it("if all lines are empty, returns only the line breaks between them", () => {
    const unindented = unindent`


    `;
    // Expect one END_OF_LINE because there are two empty lines with a line break between them.
    assertEquals(unindented, END_OF_LINE);
  });

  it("if the last line is not empty, unindents that line along with the others", () => {
    const expected = [
      "first line",
      "last line",
    ].join(END_OF_LINE);

    const unindented = unindent`
      first line
      last line`;

    assertEquals(unindented, expected);
  });

  it("if the smallest indent is 6 spaces, removes 6 spaces from every line", () => {
    const expected = [
      "indent 6",
      "  indent 8",
      "indent 6",
    ].join(END_OF_LINE);

    const unindented = unindent`
      indent 6
        indent 8
      indent 6
    `;

    assertEquals(unindented, expected);
  });

  it("if the first line is not empty, throws an error", () => {
    const errorFn = () => unindent`not empty`;
    assertThrows(
      errorFn,
      Error,
      "The first line of the template string must be empty.",
    );
  });

  it("if the string contains embedded expressions, replaces the expressions with the results of their evaluation", () => {
    const delimiter = "|";
    const value = "new value";
    const expected = "|new value|";

    const unindented = unindent`
      ${delimiter}${value}${delimiter}
    `;

    assertEquals(unindented, expected);
  });
});
