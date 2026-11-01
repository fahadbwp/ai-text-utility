import test from "node:test";
import assert from "node:assert/strict";
import { addPrefixSuffix } from "../../lib/tools/addPrefixSuffix.ts";

test("addPrefixSuffix - adds both prefix and suffix to lines", () => {
  const input = "apple\nbanana\norange";
  const result = addPrefixSuffix(input, { prefix: "'", suffix: "'," });
  assert.equal(result, "'apple',\n'banana',\n'orange',");
});

test("addPrefixSuffix - adds prefix only", () => {
  const input = "task 1\ntask 2";
  const result = addPrefixSuffix(input, { prefix: "- " });
  assert.equal(result, "- task 1\n- task 2");
});

test("addPrefixSuffix - adds suffix only", () => {
  const input = "item1\nitem2";
  const result = addPrefixSuffix(input, { suffix: ";" });
  assert.equal(result, "item1;\nitem2;");
});

test("addPrefixSuffix - skips empty lines by default", () => {
  const input = "first\n\nsecond\n   \nthird";
  const result = addPrefixSuffix(input, { prefix: "[", suffix: "]" });
  assert.equal(result, "[first]\n\n[second]\n\n[third]");
});

test("addPrefixSuffix - trims original lines when requested", () => {
  const input = "  padded 1  \n   padded 2   ";
  const result = addPrefixSuffix(input, {
    prefix: "<li>",
    suffix: "</li>",
    trimOriginalLines: true,
  });
  assert.equal(result, "<li>padded 1</li>\n<li>padded 2</li>");
});

test("addPrefixSuffix - handles empty string input", () => {
  assert.equal(addPrefixSuffix(""), "");
});
