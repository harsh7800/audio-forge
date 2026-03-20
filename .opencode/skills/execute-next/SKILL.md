---
name: execute-next
description: Implements the next task from the implementation plan using TDD
---

## What I do
- Reads `docs/implementation-phases.md` to find the next unchecked task
- Ensures a SPEC.md exists for the task (creates one if missing)
- Writes tests first (RED phase)
- Implements code to make tests pass (GREEN phase)
- Refactors while keeping tests green (REFACTOR phase)
- Updates the implementation plan
- Invokes sub-skills as needed: `create-spec`, `spec-to-test-case`, `spec-test-case-analyzer`, `test-case-to-test`, `plan-check`

## When to use me
Use this when the user says to build something, "go", "next", or wants to implement the next task in the plan.

## How I work
1. Parse implementation phases to find next unchecked task
2. Check if SPEC.md exists for that task
3. If not, call `create-spec` skill
4. If SPEC.md exists but no TEST-CASES.md, call `spec-to-test-case`
5. If both exist, analyze coverage with `spec-test-case-analyzer`
6. Generate tests with `test-case-to-test`
7. Implement code following TDD
8. Update plan with `plan-check` after completing batch