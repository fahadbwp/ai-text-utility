import test from "node:test";
import assert from "node:assert/strict";
import { convertJsonToTypescript } from "../../lib/tools/jsonToTypescript.ts";

test("jsonToTypescript - Basic Object to TypeScript Interface", () => {
  const json = JSON.stringify({
    id: 1,
    name: "John Doe",
    isAdmin: true,
  });

  const res = convertJsonToTypescript(json, { rootName: "User" });
  assert.equal(res.error, undefined);
  assert.ok(res.code.includes("export interface User {"));
  assert.ok(res.code.includes("id: number;"));
  assert.ok(res.code.includes("name: string;"));
  assert.ok(res.code.includes("isAdmin: boolean;"));
  assert.equal(res.interfaceCount, 1);
});

test("jsonToTypescript - Nested Objects Extraction", () => {
  const json = JSON.stringify({
    user: "alice",
    location: {
      city: "London",
      country: "UK",
    },
  });

  const res = convertJsonToTypescript(json, { rootName: "Account" });
  assert.equal(res.error, undefined);
  assert.ok(res.code.includes("export interface Location {"));
  assert.ok(res.code.includes("export interface Account {"));
  assert.ok(res.code.includes("location: Location;"));
  assert.equal(res.interfaceCount, 2);
});

test("jsonToTypescript - Array of Objects Merging & Optional Fields", () => {
  const json = JSON.stringify([
    { id: 1, name: "Item 1", price: 10 },
    { id: 2, name: "Item 2", discount: 5 }, // price is missing, discount is new
  ]);

  const res = convertJsonToTypescript(json, { rootName: "Products" });
  assert.equal(res.error, undefined);
  assert.ok(res.code.includes("id: number;"));
  assert.ok(res.code.includes("name: string;"));
  assert.ok(res.code.includes("price?: number;"));
  assert.ok(res.code.includes("discount?: number;"));
  assert.ok(res.code.includes("export type Products = Product[];"));
});

test("jsonToTypescript - Type Alias Mode", () => {
  const json = JSON.stringify({ title: "Hello", count: 42 });
  const res = convertJsonToTypescript(json, { outputMode: "type", rootName: "Post" });
  assert.equal(res.error, undefined);
  assert.ok(res.code.includes("export type Post = {"));
  assert.ok(res.code.includes("title: string;"));
  assert.ok(res.code.includes("count: number;"));
});

test("jsonToTypescript - Zod Schema Mode", () => {
  const json = JSON.stringify({
    title: "TypeScript Guide",
    views: 1200,
    tags: ["tech", "coding"],
  });

  const res = convertJsonToTypescript(json, { outputMode: "zod", rootName: "Article" });
  assert.equal(res.error, undefined);
  assert.ok(res.code.includes('import { z } from "zod";'));
  assert.ok(res.code.includes("const articleSchema = z.object({"));
  assert.ok(res.code.includes("title: z.string(),"));
  assert.ok(res.code.includes("views: z.number(),"));
  assert.ok(res.code.includes("tags: z.array(z.string()),"));
  assert.ok(res.code.includes("export type Article = z.infer<typeof articleSchema>;"));
});

test("jsonToTypescript - Readonly & Export Modifiers", () => {
  const json = JSON.stringify({ key: "val" });

  const res = convertJsonToTypescript(json, {
    useReadonly: true,
    useExport: false,
    rootName: "Config",
  });
  assert.equal(res.error, undefined);
  assert.ok(!res.code.includes("export interface"));
  assert.ok(res.code.includes("interface Config {"));
  assert.ok(res.code.includes("readonly key: string;"));
});

test("jsonToTypescript - Error Handling for Malformed JSON", () => {
  const badJson = '{ name: "invalid json", missing_quotes: true ';
  const res = convertJsonToTypescript(badJson);
  assert.ok(res.error !== undefined);
  assert.equal(res.code, "");
  assert.equal(res.interfaceCount, 0);
});

test("jsonToTypescript - Empty & Primitive Input", () => {
  const emptyRes = convertJsonToTypescript("");
  assert.equal(emptyRes.code, "");
  assert.equal(emptyRes.error, undefined);

  const numRes = convertJsonToTypescript("123", { rootName: "Age" });
  assert.equal(numRes.code, "export type Age = number;");
});
