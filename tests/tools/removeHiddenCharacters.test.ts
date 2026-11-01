import test from "node:test";
import assert from "node:assert/strict";
import {
  removeHiddenCharacters,
  detectHiddenCharacters,
} from "../../lib/tools/removeHiddenCharacters.ts";

test("removeHiddenCharacters - removes zero-width spaces and joiners", () => {
  const input = "Hello\u200BWorld\u200Cwith\u200Dhidden\uFEFFchars\u00ADhyphen";
  const output = removeHiddenCharacters(input);
  assert.equal(output, "HelloWorldwithhiddencharshyphen");
});

test("removeHiddenCharacters - preserves standard spaces and punctuation", () => {
  const input = "This is a normal sentence, with punctuation!";
  const output = removeHiddenCharacters(input);
  assert.equal(output, input);
});

test("removeHiddenCharacters - normalizes non-breaking spaces when requested", () => {
  const input = "Hello\u00A0World\u202FTest";
  const output = removeHiddenCharacters(input, { normalizeNonBreakingSpaces: true });
  assert.equal(output, "Hello World Test");
});

test("removeHiddenCharacters - strips directional markers", () => {
  const input = "LTR \u200E and RTL \u200F markers";
  const output = removeHiddenCharacters(input, { stripDirectionalMarkers: true });
  assert.equal(output, "LTR  and RTL  markers");
});

test("detectHiddenCharacters - counts zero-width and hidden characters accurately", () => {
  const input = "A\u200BB\u200BC\uFEFFD\u00ADE";
  const detection = detectHiddenCharacters(input);
  assert.equal(detection.total, 4);
  assert.equal(detection.zeroWidthSpaces, 2);
  assert.equal(detection.zeroWidthNoBreak, 1);
  assert.equal(detection.softHyphens, 1);
});
