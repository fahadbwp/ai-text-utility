import test from "node:test";
import assert from "node:assert/strict";
import { findAndReplace } from "../../lib/tools/findAndReplace.ts";

test("findAndReplace - basic case-insensitive replacement", () => {
  const input = "The quick brown Fox jumps over the lazy Dog. The fox was quick.";
  const { result, count } = findAndReplace(input, {
    find: "fox",
    replace: "cat",
    matchCase: false,
  });
  assert.equal(count, 2);
  assert.equal(
    result,
    "The quick brown cat jumps over the lazy Dog. The cat was quick."
  );
});

test("findAndReplace - case sensitive replacement", () => {
  const input = "The Fox and the fox.";
  const { result, count } = findAndReplace(input, {
    find: "Fox",
    replace: "Wolf",
    matchCase: true,
  });
  assert.equal(count, 1);
  assert.equal(result, "The Wolf and the fox.");
});

test("findAndReplace - whole word matching protects substrings", () => {
  const input = "cat category bobcat cat.";
  const { result, count } = findAndReplace(input, {
    find: "cat",
    replace: "dog",
    matchWholeWord: true,
  });
  assert.equal(count, 2);
  assert.equal(result, "dog category bobcat dog.");
});

test("findAndReplace - regex mode with capture groups", () => {
  const input = "John Doe, Jane Smith";
  const { result, count } = findAndReplace(input, {
    find: "(\\w+)\\s+(\\w+)",
    replace: "$2, $1",
    useRegex: true,
  });
  assert.equal(count, 2);
  assert.equal(result, "Doe, John, Smith, Jane");
});

test("findAndReplace - invalid regex handles gracefully", () => {
  const input = "Sample text";
  const { result, count } = findAndReplace(input, {
    find: "(unclosed",
    replace: "error",
    useRegex: true,
  });
  assert.equal(count, 0);
  assert.equal(result, input);
});
