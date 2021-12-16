/**
 * @jest-environment node
 */
import formatDate from "./formatDate";
describe("format-date", () => {
  it("returns error if non-string is passed in", () => {
    expect(formatDate(2020 as any)).toEqual(
      new Error("Can only format strings or dates")
    );
  });

  it("returns error if non-date string passed in", () => {
    expect(formatDate("Not a Date")).toEqual(
      new Error("String could not be converted to date")
    );
  });

  it("returns correct format if a date string is passed in", () => {
    expect(formatDate("Jan 25 2015")).toEqual("2015-01-25");
  });
});
