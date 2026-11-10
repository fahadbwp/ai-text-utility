---
name: guardian
description: Codebase & Task Guardian. Ensures surgical changes, prevents accidental regressions, verifies existing features before and after edits, and enforces strict boundary isolation so that fixing one thing never breaks another.
user-invocable: true
metadata:
  version: "1.0.0"
  category: workflow-safety
---

# Codebase Guardian (`guardian`)

A protection and quality-assurance skill to ensure the AI operates with surgical precision without causing regressions.

---

## 🛡️ The 5 Golden Rules of Safe Execution

### 1. The Isolation Rule (Borders Defined)
- Before touching any file, verify its exact scope.
- Never modify unrelated files, configurations, or background tasks without explicit user instruction.
- If a task involves Project A, never alter or delete files belonging to Project B.

### 2. The Verification Before & After Rule (Zero Regressions)
- **Before Edit:** Take note of the current working state.
- **After Edit:** Verify that:
  1. The specific requested change is working.
  2. Previously working features, scripts, or components remain intact.
  3. No syntax, compilation, or runtime errors are introduced.

### 3. Surgical Edits Over Total Overwrites
- Always prefer targeted edits (`edit_file`) over blind whole-file replacements (`write_file` with overwrite) unless building a brand-new file from scratch.
- Preserve existing comments, configurations, environment flags, and unrelated functions.

### 4. Safe Recovery & Undo Policy
- If any change causes unexpected behavior or errors:
  1. Immediately diagnose the root cause.
  2. Restore the previous verified state if the change is non-viable.
  3. Never accumulate broken hacks on top of broken hacks.

### 5. Transparent Communication
- Always explain clearly in plain language:
  - **What** is being modified and **why**.
  - **What** was checked to ensure existing features did not break.
