# AudioForge Frontend Documentation

> **Tech Stack**: Next.js 15 + React 19 + Tailwind CSS + TypeScript  
> **Backend API**: AudioForge Backend (NestJS)  
> **Authentication**: None (MVP)

## Quick Links

| Document | Description |
|----------|-------------|
| [Implementation Plan](./implementation-plan.md) | Phased development roadmap |
| [API Integration](./api-integration.md) | Backend API endpoints and usage |
| [Project Structure](./project-structure.md) | Directory structure and conventions |
| [Component Architecture](./component-architecture.md) | UI components and patterns |
| [State Management](./state-management.md) | Data flow and state handling |
| [Testing Strategy](./testing-strategy.md) | Unit, integration, and E2E tests |
| [Environment Setup](./environment-setup.md) | Local development configuration |

## Overview

AudioForge Frontend is a Next.js application that provides a user interface for:

1. **Upload** - Upload PDF/eBook files for audiobook conversion
2. **Process** - Monitor real-time processing progress
3. **Listen** - Stream generated audiobook audio
4. **Manage** - View and manage audiobook library

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Frontend                         │
├─────────────────────────────────────────────────────────────┤
│  Pages/                      │  Components/                  │
│  ├── upload/                 │  ├── ui/ (shadcn)           │
│  ├── library/                │  ├── features/               │
│  └── audiobook/[id]/         │  └── layouts/                │
├────────────────────────────┬────────────────────────────────┤
│  State Management          │  API Layer                    │
│  ├── React Query (server)  │  ├── /api/client.ts          │
│  └── React Context (local) │  └── /api/endpoints.ts       │
└────────────────────────────┴────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   AudioForge Backend API                     │
│                   (NestJS on port 3000)                     │
└─────────────────────────────────────────────────────────────┘
```

## Getting Started

```bash
# Copy this docs folder into your frontend project
cp -r frontend-docs/. /path/to/your/frontend/docs/

# Follow environment-setup.md for configuration
pnpm install
pnpm dev
```

## Development Phases

| Phase | Description | Est. Time |
|-------|-------------|-----------|
| Phase 1 | Project Setup & Core UI | 1-2 days |
| Phase 2 | File Upload Flow | 2-3 days |
| Phase 3 | Library & Progress Tracking | 2-3 days |
| Phase 4 | Audio Player & Streaming | 2-3 days |
| Phase 5 | Polish & Testing | 2-3 days |

See [implementation-plan.md](./implementation-plan.md) for detailed tasks.