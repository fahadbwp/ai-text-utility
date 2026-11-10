# Task Assignment: E2E Test Writer (Track-E)

Working directory: d:\ai-text-tool\.agents\teamwork\e2e_test_writer_1
Authoritative request: d:\ai-text-tool\.agents\teamwork\ORIGINAL_REQUEST.md
Project plan: d:\ai-text-tool\PROJECT.md

## Mission
Design and implement a comprehensive opaque-box E2E test suite in `tests/e2e/geo-and-presets.test.ts` following the 4-tier methodology:
- Tier 1: Feature Coverage (>=5 test cases per feature for R1, R2, R3)
- Tier 2: Boundary & Corner Cases (>=5 test cases per feature)
- Tier 3: Cross-Feature Combinations (pairwise interactions, e.g. R1 answer blocks + R2 search guides/FAQs + R3 presets)
- Tier 4: Real-World Application Scenarios (multi-intent user queries like "condense a long paragraph into two paragraphs and remove line separators" with PDF/OCR/email artifacts)

## Write Ownership
You EXCLUSIVELY own:
- `tests/e2e/geo-and-presets.test.ts`
- `d:\ai-text-tool\TEST_INFRA.md`
- `d:\ai-text-tool\TEST_READY.md`
Do NOT edit any source code or implementation files.

## Guidelines
- Follow Node native test runner conventions (`import { test } from 'node:test'`, `import assert from 'node:assert/strict'`).
- In `TEST_READY.md`, document the runner command (`npm test -- tests/e2e/geo-and-presets.test.ts` or `npm test`), coverage breakdown across Tiers 1-4, and feature checklist.
- In `TEST_INFRA.md`, document the test architecture, methodology, and scenarios.
- Verify that your tests compile cleanly and can run via `npm test`.

## Completion
Write your completion handoff to `d:\ai-text-tool\.agents\teamwork\e2e_test_writer_1\handoff.md` and send a message when finished.

## 2026-11-10T03:44:49Z
You are e2e_test_writer_1.
Your working directory is d:\ai-text-tool\.agents\teamwork\e2e_test_writer_1.
Read your task instructions at d:\ai-text-tool\.agents\teamwork\e2e_test_writer_1\DISPATCH.md, the authoritative request at d:\ai-text-tool\.agents\teamwork\ORIGINAL_REQUEST.md, and the project plan at d:\ai-text-tool\PROJECT.md.
Design and implement the opaque-box E2E test suite in tests/e2e/geo-and-presets.test.ts covering Tiers 1-4.
Generate TEST_INFRA.md and TEST_READY.md at project root d:\ai-text-tool\.
Write your handoff report to d:\ai-text-tool\.agents\teamwork\e2e_test_writer_1\handoff.md.
Notify me via send_message when complete.
