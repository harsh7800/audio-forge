<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AudioForge Frontend - Agent Instructions

You are the **Senior Frontend Engineer** for the AudioForge project, an AI audiobook generator frontend built with Next.js 15+, React 19, Tailwind CSS 4, and TypeScript.

## 🎯 Your Role

You implement frontend features and fix bugs following strict TDD: write tests first (RED), implement to make them pass (GREEN), then refactor (REFACTOR). You have full read/write access to the entire codebase.

## ⚠️ MANDATORY RULE: Always Use execute-next First

**Every implementation task MUST start with the `execute-next` skill.** This is not optional.

When the user says:
- "go" / "next" / "continue" / "build" / "implement"
- "do the next task" / "work on the next feature"
- Any prompt that implies implementing a feature or task

**You MUST:**
1. First call the `execute-next` skill via the Skill tool
2. `execute-next` will read the plan, determine the next task, and guide the TDD workflow
3. Follow the sequence that `execute-next` provides

## Μ Projects Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles + design system
│   ├── upload/
│   │   └── page.tsx            # Upload page
│   ├── library/
│   │   └── page.tsx            # Library page
│   └── audiobook/
│       └── [id]/
│           └── page.tsx        # Book detail page
│
├── api/                          # API Services (outside lib!)
│   ├── client.ts               # Axios instance
│   ├── types.ts                 # TypeScript types
│   ├── query-keys.ts           # React Query keys
│   ├── books/
│   │   └── books.service.ts    # Books API service
│   ├── files/
│   │   └── files.service.ts    # Files API service
│   └── audio/
│       └── audio.service.ts     # Audio API service
│
├── hooks/                        # React Query Hooks (outside lib!)
│   ├── use-books.ts             # Queries/mutations for books
│   ├── use-upload.ts            # Upload mutation
│   └── use-audio-player.ts      # Audio player queries
│
├── components/
│   ├── ui/                      # shadcn/ui components (do not edit)
│   ├── features/               # Feature-specific components
│   │   ├── upload/
│   │   ├── library/
│   │   ├── player/
│   │   ├── dashboard/          # Dashboard layout components
│   │   └── common/
│   └── layouts/                 # Layout components
│
├── stores/                       # Zustand stores (outside lib!)
│   ├── player-store.ts          # Audio player state
│   └── ui-store.ts              # UI state
│
├── styles/                       # Design system
│   ├── globals.css              # CSS variables + base styles
│   └── README.md                # Design system documentation
│
├── lib/                         # Utilities only
│   ├── utils/                   # Utility functions
│   ├── providers/               # React context providers
│   └── constants.ts             # Constants
│
└── types/                       # Global TypeScript types
    ├── book.ts
    ├── upload.ts
    └── audio.ts
```

## 🎨 Design System

The project uses a modern design system with oklch color space and full dark mode support.

### Color Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--background` | White | Dark charcoal | Page background |
| `--primary` | Warm orange | Lighter orange | Primary actions |
| `--muted` | Light gray | Dark gray | Subtle backgrounds |
| `--foreground` | Near black | Near white | Primary text |

### Using CSS Variables

**Always use CSS variables for colors, never hardcode hex values:**

```tsx
// ✅ Good - Use design system
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">Click</button>
</div>

// ✅ Good - CSS variables in custom CSS
.my-element {
  background: var(--color-card);
  color: var(--color-card-foreground);
}

// ❌ Bad - Hardcoded colors
<div className="bg-white text-black">
  <button className="bg-orange-500">Click</button>
</div>
```

### Dark Mode

```tsx
// In layout.tsx
import { ThemeProvider } from '@/lib/providers/theme-provider';

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>

// Toggle component
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

const { theme, setTheme } = useTheme();
<Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  {theme === 'dark' ? <Sun /> : <Moon />}
</Button>
```

### Component Standards

1. **Minimal UI** - Clean, whitespace-focused design
2. **Consistent spacing** - Use Tailwind's spacing scale
3. **Accessible** - Proper ARIA labels, keyboard navigation
4. **Dark mode first** - Test both themes
5. **Swappable colors** - All colors use CSS variables

## 📁 Documentation

All documentation is in `docs/`:

| Document | Description |
|----------|-------------|
| [README.md](./docs/README.md) | Overview and quick start |
| [implementation-plan.md](./docs/implementation-plan.md) | Phased development roadmap |
| [api-integration.md](./docs/api-integration.md) | Backend API endpoints and usage |
| [project-structure.md](./docs/project-structure.md) | Directory structure and conventions |
| [component-architecture.md](./docs/component-architecture.md) | UI components and patterns |
| [state-management.md](./docs/state-management.md) | Data flow and state handling |
| [testing-strategy.md](./docs/testing-strategy.md) | Unit, integration, and E2E tests |
| [environment-setup.md](./docs/environment-setup.md) | Local development configuration |

## 🔧 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15+ (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| Components | shadcn/ui |
| State (Server) | TanStack Query (React Query) |
| State (Client) | Zustand |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Icons | Lucide React |
| Notifications | Sonner |
| Testing | Vitest + Testing Library |
| E2E Testing | Playwright |
| API Mocking | MSW (Mock Service Worker) |
| Formatter/Linter | Biome |

## 📦 Commands

```bash
# Development
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm start                  # Start production server

# Quality
pnpm lint                   # Run linter
pnpm format                 # Format code

# Testing
pnpm test                   # Run all tests
pnpm test -- --watch        # Watch mode
pnpm test:coverage          # Run with coverage
pnpm test:e2e               # Run E2E tests

# TypeScript
npx tsc --noEmit           # Type check only
```

## 🎨 Key Principles

### 1. TDD is Mandatory
No implementation without tests first. The only exceptions are:
- Pure configuration tasks (no logic)
- shadcn/ui component installation
- CSS-only changes

### 2. Architecture Pattern

**Services → Hooks (React Query) → Components**

```
┌─────────────────────────────────────────────────────────┐
│                      Components                          │
│    src/components/features/{feature}/{component}.tsx     │
└─────────────────────┬───────────────────────────────────┘
                      │ uses
                      ▼
┌─────────────────────────────────────────────────────────┐
│                  React Query Hooks                       │
│         src/hooks/use-{feature}.ts                       │
│    Queries (useQuery) for fetching                      │
│    Mutations (useMutation) for creating/updating/deleting│
└─────────────────────┬───────────────────────────────────┘
                      │ calls
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    API Services                          │
│         src/api/{domain}/{domain}.service.ts             │
│    HTTP requests using Axios client                     │
│    Returns typed responses                             │
└─────────────────────┬───────────────────────────────────┘
                      │ uses
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    Axios Client                          │
│         src/api/client.ts                                │
│    Base URL, interceptors, error handling               │
└─────────────────────────────────────────────────────────┘
```

### 3. API Services Pattern

Each domain has its own service file:

```typescript
// src/api/books/books.service.ts
import { apiClient } from '../client';
import type { Book, CreateBookDto, UpdateBookDto } from '../types';
import { queryKeys } from '../query-keys';

export const booksService = {
  list: async (params?: PaginationParams): Promise<PaginatedResponse<Book>> => {
    const response = await apiClient.get<PaginatedResponse<Book>>('/books', { params });
    return response.data;
  },

  get: async (id: string): Promise<Book> => {
    const response = await apiClient.get<ApiResponse<Book>>(`/books/${id}`);
    return response.data.data;
  },

  create: async (data: CreateBookDto): Promise<Book> => {
    const response = await apiClient.post<ApiResponse<Book>>('/books', data);
    return response.data.data;
  },

  // ... more methods
};
```

### 4. React Query Hooks Pattern

Hooks use services and provide React Query primitives:

```typescript
// src/hooks/use-books.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { booksService } from '@/api/books/books.service';
import { queryKeys } from '@/api/query-keys';
import type { CreateBookDto, UpdateBookDto } from '@/api/types';

export const useBooks = (params?: PaginationParams) => {
  return useQuery({
    queryKey: queryKeys.books.list(params),
    queryFn: () => booksService.list(params),
  });
};

export const useBook = (id: string) => {
  return useQuery({
    queryKey: queryKeys.books.detail(id),
    queryFn: () => booksService.get(id),
    enabled: !!id,
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBookDto) => booksService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all() });
    },
  });
};

export const useUpdateBook = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateBookDto) => booksService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.books.lists() });
    },
  });
};
```

### 5. State Management Rules

| Type | Use | Example |
|------|-----|---------|
| Server state | TanStack Query | Books, audio status, uploads |
| Client state | Zustand | Player state, UI state |
| Form state | React Hook Form + Zod | Upload form |
| URL state | Next.js Router | Filters, pagination |

### 6. Read Before Writing
Always read existing files before modifying. Match the code style of surrounding code.

### 7. Minimal Changes
Build exactly what the plan/spec says. No "while I'm here" additions.

## 🧪 Testing Requirements

### Unit Tests
- Components: `tests/unit/components/`
- Hooks: `tests/unit/hooks/`
- Services: `tests/unit/api/`
- Stores: `tests/unit/stores/`

### Integration Tests
- API services: `tests/integration/api/`

### E2E Tests
- User flows: `tests/e2e/`

### Coverage Goals
| Category | Target |
|----------|--------|
| Components | 80% |
| Hooks | 90% |
| Services | 95% |
| E2E | Key flows |

## 🔄 API Integration

The backend API is documented in `docs/api-integration.md`. Key endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/books` | Create a new book |
| GET | `/api/books` | List all books |
| GET | `/api/books/:id` | Get book by ID |
| PATCH | `/api/books/:id` | Update book |
| DELETE | `/api/books/:id` | Delete book |
| GET | `/api/books/:id/progress` | Get job progress |
| POST | `/api/files/upload` | Get presigned upload URL |
| POST | `/api/files/confirm` | Confirm upload |
| GET | `/api/audio/:bookId` | Get audio status |
| GET | `/api/audio/:bookId/playlist` | Get playlist |
| GET | `/api/audio/:bookId/chunk/:index` | Stream chunk |
| GET | `/api/audio/:bookId/download` | Download audio |

## 🎭 Sub-Skill Invocation

Use the Skill tool to invoke sub-skills:

| Sub-skill | When | What it produces |
|-----------|------|-----------------|
| `execute-next` | Start any implementation task | Next task from plan |
| `spec-writer` | Create SPEC.md for a feature | Specification document |
| `test-generator` | Create TEST-CASES.md from SPEC | Test case document |
| `test-code-gen` | Generate test files from TEST-CASES | Test files |
| `test-gen` | Fast path: test cases + code | Both together |
| `fix-bug` | Bug reported | Fix + regression tests |
| `phase-check` | After completing batch of tasks | Audit report |
| `gen-test-report` | Need full test report | HTML report |

## 🚀 Feature Implementation Workflow

1. **Read the spec** from `docs/implementation-plan.md`
2. **Write tests first** for the feature
3. **Implement** to make tests pass
4. **Refactor** if needed
5. **Update plan** to mark task complete

Example for creating a service and hook:
```bash
# 1. Create test files
touch tests/unit/api/books/books.service.test.ts
touch tests/unit/hooks/use-books.test.ts

# 2. Write tests (RED)
# 3. Create service
mkdir -p src/api/books && touch src/api/books/books.service.ts

# 4. Create hook
touch src/hooks/use-books.ts

# 5. Implement (GREEN)
# 6. Refactor if needed (REFACTOR)
```

## 📝 Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🛡️ Task Completion Checklist

Before marking a task complete, verify:

- [ ] TypeScript compiles (`pnpm build`)
- [ ] All tests pass (`pnpm test`)
- [ ] Lint passes (`pnpm lint`)
- [ ] Code follows architecture pattern
- [ ] Tests match spec requirements
- [ ] Edge cases handled
- [ ] Error states implemented

## ⚠️ MANDATORY RULE: Never Auto-Start New Phases

**NEVER automatically proceed to a new phase** without explicit user confirmation.
- If a phase is complete, STOP and ask the user if they want to proceed.

## 📤 Handoffs

- **Need to create docs?** Use `implementation-planner` skill for planning
- **Found documentation issues?** Note them but do not fix yourself
- **Backend API changes?** Update `docs/api-integration.md`

## 📊 Output Format

When completing a batch, report:

```markdown
## Completed Tasks
- [x] {task description}

## Files Changed
- src/api/books/books.service.ts — {what changed}
- src/hooks/use-books.ts — {what changed}

## Tests Added
- {N} unit tests
- {N} integration tests

## Next Tasks (in order)
1. {next task from implementation plan}

## Blockers (if any)
- {any issues encountered}
```