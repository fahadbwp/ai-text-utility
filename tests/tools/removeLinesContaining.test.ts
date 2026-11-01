import test from "node:test";
import assert from "node:assert/strict";
import { removeLinesContaining } from "../../lib/tools/removeLinesContaining.ts";

test("removeLinesContaining - removes matching lines case-insensitively by default", () => {
  const input = "Apple\nBanana\nOrange\nPineapple\nGrape";
  const { result, removedCount, remainingCount } = removeLinesContaining(input, {
    query: "apple",
  });

  assert.equal(removedCount, 2);
  assert.equal(remainingCount, 3);
  assert.equal(result, "Banana\nOrange\nGrape");
});

test("removeLinesContaining - respects case sensitivity", () => {
  const input = "Error in line 1\nerror in line 2\nSUCCESS in line 3";
  const { result, removedCount } = removeLinesContaining(input, {
    query: "Error",
    caseSensitive: true,
  });

  assert.equal(removedCount, 1);
  assert.equal(result, "error in line 2\nSUCCESS in line 3");
});

test("removeLinesContaining - keep mode retains only matching lines", () => {
  const input = "DEBUG init\nERROR db timeout\nINFO ready\nERROR port closed";
  const { result, removedCount, remainingCount } = removeLinesContaining(input, {
    query: "ERROR",
    mode: "keep",
  });

  assert.equal(removedCount, 2);
  assert.equal(remainingCount, 2);
  assert.equal(result, "ERROR db timeout\nERROR port closed");
});

test("removeLinesContaining - supports regex pattern matching", () => {
  const input = "user_1@test.com\nuser_2@demo.org\nadmin@gov.us\nguest_99@test.com";
  const { result, removedCount } = removeLinesContaining(input, {
    query: "@test\\.com$",
    useRegex: true,
    mode: "remove",
  });

  assert.equal(removedCount, 2);
  assert.equal(result, "user_2@demo.org\nadmin@gov.us");
});

test("removeLinesContaining - strips blank lines when requested", () => {
  const input = "line 1\n\nline 2 (bad)\n   \nline 3";
  const { result } = removeLinesContaining(input, {
    query: "bad",
    mode: "remove",
    removeEmptyLines: true,
    trimLines: true,
  });

  assert.equal(result, "line 1\nline 3");
});

test("removeLinesContaining - handles empty input and invalid regex gracefully", () => {
  assert.equal(removeLinesContaining("").result, "");

  const invalid = removeLinesContaining("line 1\nline 2", {
    query: "[unclosed",
    useRegex: true,
  });
  assert.ok(invalid.error?.includes("Invalid Regular Expression"));
  assert.equal(invalid.result, "line 1\nline 2");
});
