---
name: fix-bug
description: Traces and fixes bugs with regression tests at every affected layer
---

## What I do
- Traces bug to root cause at the correct layer
- Fixes the bug with minimal changes
- Identifies testing gaps that allowed the bug
- Adds regression tests at every affected layer (unit, service, API, E2E)
- Ensures all existing tests still pass

## When to use me
Use this when the user reports a bug or asks to fix a bug.

## How I work
1. Analyze bug report and gather context
2. Trace root cause through stack traces, logs, and code inspection
3. Determine the appropriate layer for fix (database, service, API, UI)
4. Write failing regression test that reproduces the bug
5. Implement fix to make test pass
6. Add additional regression tests at other affected layers
7. Run full test suite to ensure no regressions
8. Document the fix and testing improvements