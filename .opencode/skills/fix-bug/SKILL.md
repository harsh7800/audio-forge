---
name: fix-bug
description: "You are a senior backend developer and QA engineer for the AudioForge project. Your job is to investigate a bug, fix it, identify the testing gap that allowed it through, and close that gap across all test layers."
---
# Fix Bug

You are a senior backend developer and QA engineer for the AudioForge project. Your job is to investigate a bug, fix it, identify the testing gap that allowed it through, and close that gap across all test layers.

## Input

Arguments: $ARGUMENTS

Format: `<bug description> [--module <module>]`

- **Bug description** (required): A free-text description of the bug. Can include symptoms, error messages, or observed behavior.
- **--module** (optional): The module name to narrow the search (e.g., `jobs`, `files`, `audio`, `workers`). Maps to `src/modules/{module}/`.

Examples:
- `/fix-bug job status not updating after processing --module jobs`
- `/fix-bug audio file not uploading to storage --module files`
- `/fix-bug TTS failing silently without error --module audio`

---

## Process

### Step 1: Understand the bug

1. Parse the bug description and module (if provided)
2. Read `README.md` for project context and conventions
3. Read `docs/implementation-plan.md` for current phase info
4. If module is specified, read relevant files in parallel:
   - Module SPEC: `src/modules/{module}/SPEC.md` (if exists)
   - Database schema: `src/database/schema/{module}*.ts`
   - Service: `src/modules/{module}/services/{module}.service.ts`
   - Controller: `src/modules/{module}/controllers/{module}.controller.ts`
   - Business rules: `docs/implementation-plan.md` (relevant sections)

Print summary:
> **Bug**: {concise restatement}
> **Module**: {module or "unknown — investigating"}

### Step 2: Investigate root cause

Trace the bug from symptom to source. Work backwards:

1. **Controller layer**: Find the endpoint that handles the request. Check request validation, service call, response shape.
2. **Service layer**: Find the service function. Check business logic, database queries, calculations.
3. **Schema layer**: Check Drizzle schema for incorrect column types, defaults, constraints.
4. **Worker/Pipeline layer**: If async, check BullMQ processor and pipeline steps.
5. **Utility layer**: Check shared helpers in `src/common/` or service utilities.

Use grep/glob to find relevant code:
```
grep -r "functionName" src/modules/{module}/
grep -r "status" src/modules/{module}/services/
glob src/modules/{module}/**/*.ts
```

Document investigation:
> **Traced**: Controller ({file}) → Service ({file}) → Root cause in {file}:{line}

Print root cause:
> **Root cause**: {What's wrong and why. Include specific code.}

### Step 3: Fix the bug

Apply the minimal fix needed:

1. **Fix at the right layer**. If service should compute something, fix there — don't patch controller only.
2. **Defense in depth**. Add validation at multiple layers where appropriate.
3. **Don't over-fix**. Only change what's needed for THIS bug.
4. **Respect existing patterns**. Match code style of surrounding code.
5. **Check both create and update paths**. Bug in create likely exists in update too.

After fixing, verify TypeScript compiles:
```bash
pnpm build
# or
npx tsc --noEmit
```

Print what was fixed:
> **Fixed**: {files changed and what was changed}

### Step 4: Identify the testing gap

Analyze why existing tests didn't catch this bug:

1. **Find existing tests** for the module:
   - Unit: `src/modules/{module}/**/*.spec.ts`
   - Service: `src/modules/{module}/__tests__/*.service.spec.ts`
   - Integration: `src/modules/{module}/__tests__/*.controller.spec.ts`
   - E2E: `tests/e2e/{module}*.e2e-spec.ts`

2. **Read test files** and identify the gap:
   - Tests used pre-computed correct values instead of testing computation
   - Tests mocked the layer where bug lived
   - No test for this edge case / input combination
   - Happy-path-only testing — no negative cases
   - Test assertions too loose

3. **Check spec coverage** (if SPEC.md and TEST-CASES.md exist):
   - Is buggy behavior described in spec?
   - Is there a test case for it?
   - Why didn't the test catch it?

Print gap analysis:
> **Testing gap**: {What was missing}
> **Affected layers**: {Which test layers need updates}

### Step 5: Write tests to close the gap

Write tests at EVERY layer where coverage was missing:

#### Unit tests
- File: `src/modules/{module}/__tests__/{module}.spec.ts`
- Test the specific computation/logic that was broken
- Include exact input that triggered bug (regression test)
- Add edge case variants

#### Service tests
- File: `src/modules/{module}/__tests__/{module}.service.spec.ts`
- Test service correctly computes/validates data
- Don't pass pre-computed values — verify raw inputs → outputs
- Test both create and update paths if both affected

#### Integration tests (Controller)
- File: `src/modules/{module}/__tests__/{module}.controller.spec.ts`
- Test API endpoint with input that triggered bug
- Verify response contains correctly computed values
- Use supertest for HTTP testing

#### E2E tests
- File: `tests/e2e/{module}.e2e-spec.ts`
- Test full flow: request → processing → response
- Assert specific computed values
- Follow existing E2E patterns in project

**Test naming**: Include "regression" in test name for traceability.

After writing tests, run them:
```bash
# Unit/Integration tests
pnpm test -- --testPathPattern={module}

# Or specific file
pnpm test -- src/modules/{module}/__tests__/{file}.spec.ts
```

Fix any failures until all pass. Then run full module tests:
```bash
pnpm test -- --testPathPattern={module}
```

Print results:
> **Tests added**: {count per layer}
> **All passing**: YES / NO

### Step 6: Check docs and specs

Check if bug reveals documentation gap:

1. **SPEC.md**: Does spec describe correct behavior? Update if wrong.
2. **implementation-plan.md**: Does plan description match fix?
3. **api-routes.md**: Does API doc match fixed behavior?
4. **TEST-CASES.md**: Add missing test cases that would have caught this.

Print findings:
> **Docs status**: {No changes needed / Updated {files}}

### Step 7: Summary

Print final summary:

```
## Bug Fix Summary

### Bug
{One-line description}

### Root Cause
{What was wrong in which file/line}

### Fix
{What was changed and why}
- {file1}: {change description}
- {file2}: {change description}

### Testing Gap
{Why existing tests didn't catch this}

### Tests Added
| Layer | File | Tests Added |
|-------|------|-------------|
| Unit | {path} | {count} |
| Service | {path} | {count} |
| Integration | {path} | {count} |
| E2E | {path} | {count} |

### Docs Updated
- {file}: {change} (or "None — docs correct")

### Files Changed
- {list of all files modified/created}
```

Do NOT commit. Leave changes for user to review.

---

## Rules

- **Investigate before fixing**. Never guess at root cause — trace data flow and prove it.
- **Fix at the source**. Don't mask bugs with workarounds. Fix the layer that's wrong.
- **Test what broke**. New tests must fail if you revert the fix — regression test guarantee.
- **Check all paths**. If create is broken, update is probably broken too.
- **Don't touch unrelated code**. Stay focused on the bug. Flag other issues but don't fix them.
- **Run tests before declaring done**. Every new test must pass, no existing test broken.
- **E2E tests are mandatory**. Every bug fix needs at least one integration test reproducing the bug.
- **Match existing patterns**. Read nearby test files before writing new ones.
- **Don't commit**. Leave changes staged for user review.

---

## NestJS Testing Patterns

### Controller test with supertest
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { {Module}Service } from '../services/{module}.service';
import { {Module}Controller } from '../controllers/{module}.controller';

describe('{Module}Controller', () => {
  let app: INestApplication;
  let mockService: any;

  beforeAll(async () => {
    mockService = { /* mock methods */ };
    const module = await Test.createTestingModule({
      controllers: [{Module}Controller],
      providers: [{ provide: {Module}Service, useValue: mockService }],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should handle bug scenario', async () => {
    mockService.find.mockResolvedValue(expectedResult);
    const response = await request(app.getHttpServer())
      .get('/api/{module}')
      .expect(200);
    expect(response.body).toEqual(expectedResult);
  });
});
```

### Service test with mocked dependencies
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { {Module}Service } from './{module}.service';

describe('{Module}Service', () => {
  let service: {Module}Service;
  let mockDb: any;

  beforeEach(async () => {
    mockDb = { select: jest.fn(), insert: jest.fn() };
    const module = await Test.createTestingModule({
      providers: [
        {Module}Service,
        { provide: 'DRIZZLE', useValue: mockDb },
      ],
    }).compile();

    service = module.get<{Module}Service>({Module}Service);
  });

  it('should catch regression: {bug description}', async () => {
    // Test with exact input that caused bug
    const result = await service.processInput(buggyInput);
    expect(result).toEqual(correctOutput);
  });
});
```
