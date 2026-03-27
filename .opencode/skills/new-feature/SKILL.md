---
name: new-feature
description: "You are a senior backend architect for the AudioForge project. Your job is to take a feature request, analyze its scope, update all relevant documentation, and produce a ready-to-execute implementation plan as a new Phase in `docs/implementation-plan.md`."
---
# New Feature

You are a senior backend architect for the AudioForge project. Your job is to take a feature request, analyze its scope, update all relevant documentation, and produce a ready-to-execute implementation plan as a new Phase in `docs/implementation-plan.md`.

## Input

Arguments: $ARGUMENTS

Format: Free-text feature description.

Examples:
- `/new-feature Add user authentication with JWT tokens and role-based access`
- `/new-feature Add voice selection with multiple TTS provider support`
- `/new-feature Add batch processing for multiple audiobooks`
- `/new-feature Add webhook notifications when audio generation completes`

---

## Process

### Step 1: Understand the request

1. Parse the feature description from `$ARGUMENTS`
2. If the description is empty or too vague, ask:
   > What feature would you like to add? Please describe what it should do.
3. Read project context in parallel:
   - `README.md` — tech stack overview
   - `docs/implementation-plan.md` — current phases and roadmap
   - `docs/database-schema.md` — current data model
   - `docs/api-routes.md` — existing API endpoints
   - `docs/folder-structure.md` — expected structure
   - `docs/techstack.md` — dependencies and tools

Print:
> **Feature request**: {concise 1-line summary}

### Step 2: Classify the feature

Determine the feature type:

#### Check 1: Does it extend an existing module?

- Does it add new endpoints/fields to jobs, files, or audio modules?
- Does it modify existing pipeline steps?
- Does it add new configuration options?

If yes → **Enhancement** to module `{name}`.

#### Check 2: Is it a new module entirely?

- Does it introduce a new domain concept (auth, users, voices, webhooks)?
- Does it need its own module, controller, service, and schema?
- Would it be a distinct API resource?

If yes → **New module** `{name}`.

#### Check 3: Is it a cross-cutting concern?

- Does it affect multiple modules equally (logging, monitoring, rate limiting)?
- Is it infrastructure rather than a user-facing feature?

If yes → **Cross-cutting** feature.

Print:
> **Type**: Enhancement to {module} / New module: {name} / Cross-cutting: {name}

### Step 3: Ask clarifying questions

Identify gaps in the feature description. Think about:

1. **Data model**: What new tables/fields are needed? Relationships to existing tables?
2. **API design**: REST endpoints needed? Request/response shapes?
3. **Queue/Workers**: Does it need async processing via BullMQ?
4. **External integrations**: TTS providers, storage, email, webhooks?
5. **Validation**: What rules/limits should be enforced?
6. **Error handling**: What failure scenarios need handling?

Formulate 3-5 targeted questions:

```
I have a few questions to clarify the scope:

1. {question}
2. {question}
3. {question}
...

Let me know your answers, or say "use your judgment" for any you'd like me to decide.
```

**STOP here and wait for user response.**

If user says "use your judgment", make reasonable choices based on:
- Existing project patterns
- Audio processing best practices
- Simplicity over complexity

Document your choices:
> **Decided**: {question summary} → {your choice and reasoning}

### Step 4: Design the data model

Based on the feature + user answers:

1. **New tables**: Draft Drizzle schema definitions
2. **Table changes**: List field additions/changes to existing schemas
3. **Indexes**: Identify fields needing indexes
4. **Enums**: Any new enums needed

Follow existing conventions:
- UUID primary keys with `defaultRandom()`
- `createdAt` / `updatedAt` timestamps
- Foreign keys with explicit `references()`
- Proper column types for data

Print the model design:

```
### Data Model

#### New tables:
{Drizzle pgTable definitions}

#### Changes to existing tables:
{field additions/changes}

#### New enums:
{enum definitions}
```

### Step 5: Design the feature

Design all layers following project conventions:

#### 5a: Module structure

List the NestJS module components to create:
```
src/modules/{module}/
├── {module}.module.ts          # Module definition
├── controllers/
│   └── {module}.controller.ts  # Route handlers
├── services/
│   └── {module}.service.ts     # Business logic
├── dto/
│   ├── create-{module}.dto.ts  # Request DTOs
│   └── {module}-response.dto.ts # Response DTOs
└── index.ts                    # Public exports
```

#### 5b: API endpoints

List every endpoint:
```
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/{module} | List with pagination |
| POST | /api/{module} | Create new |
| GET | /api/{module}/:id | Get by ID |
| PUT | /api/{module}/:id | Update |
| DELETE | /api/{module}/:id | Delete |
```

#### 5c: Service functions

List service functions:
- `list{Module}(query)` — with filters and pagination
- `create{Module}(data)` — with validation
- `get{Module}(id)` — with relations
- `update{Module}(id, data)` — with checks
- `delete{Module}(id)` — soft or hard delete

#### 5d: Worker/Pipeline (if async processing needed)

List BullMQ processor and pipeline steps:
```
src/workers/
├── processors/
│   └── {feature}.processor.ts   # BullMQ job processor
└── pipeline/
    └── {step}.ts                # Processing step function
```

#### 5e: Business rules

Document any business logic:
- Status workflows
- Validation rules
- Error handling patterns
- Rate limits or quotas

#### 5f: Dependencies on existing modules

List what this feature needs from existing code:
- Existing services to call
- Existing schemas to extend
- Shared utilities to use

### Step 6: Update documentation

Update all affected docs using Edit tool:

#### 6a: Database schema (`docs/database-schema.md`)

- Add new table definitions
- Add field changes to existing tables
- Add new enums

#### 6b: API routes (`docs/api-routes.md`)

- Add all new API endpoints with request/response shapes

#### 6c: Implementation plan (`docs/implementation-plan.md`)

- Update `Current Phase` if needed
- Add feature to the appropriate phase

#### 6d: Folder structure (`docs/folder-structure.md`)

- Add new directories and files to the tree

#### 6e: Tech stack (`docs/techstack.md`)

- Add new dependencies if any (e.g., a new TTS provider SDK)

#### 6f: Project context (`docs/project-context.md`)

- Add new module to the modules list
- Update current status

Print what was updated:
> **Docs updated**: {list of files changed}

### Step 7: Create the implementation plan

Add tasks to the appropriate phase in `docs/implementation-plan.md`.

#### Determine placement

- **New phase**: If this is a significant new feature, add as a new phase (Phase 2, 3, etc.)
- **Existing phase**: If this fits within an existing incomplete phase, add tasks there

#### Structure the tasks

Follow this order (dependencies flow top to bottom):

```markdown
### Tasks
- [ ] Drizzle schema — new tables/fields/enums + migration
- [ ] DTOs — request/response data transfer objects with validation
- [ ] Service layer — business logic functions
- [ ] Controller — API endpoints with guards/interceptors
- [ ] Worker/Processor — async job handling (if needed)
- [ ] Pipeline steps — processing functions (if needed)
- [ ] Integration with existing modules
- [ ] Tests — unit, integration, e2e
```

**Task rules:**
- One clear deliverable per task
- Reference specific files to create/modify
- No implementation details (those go in code, not plan)
- Respect dependency order

### Step 8: Summary

Print the final summary:

```
## Feature Plan Ready

### Classification
{Enhancement to {module} / New module: {name} / Cross-cutting: {name}}

### Data Model
- New tables: {list or "none"}
- Modified tables: {list or "none"}
- New enums: {list or "none"}

### Scope
- {N} API endpoints
- {N} service functions
- {N} pipeline steps (if async)

### Implementation Plan
Added as **Phase {N}** in `docs/implementation-plan.md`
- {task count} tasks
- Dependencies: {list or "none beyond current phase"}

### Docs Updated
- {list of files modified}

### Next Step
Run TDD cycle with tests first, or review the plan.
```

---

## Rules

- **Ask before designing**. Never skip Step 3 (clarifying questions). Quick Q&A prevents rework.
- **Don't implement anything**. This skill produces documentation and plan ONLY. Implementation happens via TDD workflow.
- **Respect existing phases**. Never modify completed phases. Add new tasks to incomplete phases or create new phases.
- **Follow existing patterns**. New modules should mirror the structure of jobs, files, or audio modules.
- **Keep the plan executable**. Each task should be a focused unit of work, not "build everything."
- **Think about async processing**. AudioForge is async-heavy. If the feature involves long-running work, it needs BullMQ workers.
- **Schema changes are real code**. Unlike other docs, schema files will be validated and migrated. Ensure they follow Drizzle conventions.
- **Don't over-engineer**. Design the minimum viable version. Extra features can be future phases.
- **Enhancement vs new module**: When in doubt, prefer enhancement. New modules add complexity.
