# Environment Setup

> Local development configuration for AudioForge Frontend

---

## Prerequisites

| Software | Version | Required |
|----------|---------|----------|
| Node.js | >= 18.17 | ✅ |
| pnpm | >= 8.0 | ✅ |
| Git | >= 2.0 | ✅ |
| VS Code | Latest | Recommended |

---

## Initial Setup

### 1. Clone and Install

```bash
# Clone your frontend repo
git clone https://github.com/your-org/audioforge-frontend.git
cd audioforge-frontend

# Install dependencies
pnpm install
```

### 2. Environment Variables

Create `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Optional: Analytics (future)
# NEXT_PUBLIC_ANALYTICS_ID=

# Optional: Error tracking (future)
# NEXT_PUBLIC_SENTRY_DSN=
```

Create `.env.example` for reference:

```env
# API URL (required)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Copy this file to .env.local and update values
```

### 3. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Initialization

### Create Next.js App

```bash
npx create-next-app@latest audioforge-frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd audioforge-frontend
```

### Install Dependencies

```bash
# Core dependencies
pnpm add @tanstack/react-query axios zustand clsx tailwind-merge lucide-react sonner

# Dev dependencies
pnpm add -D @types/node @types/react @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest @vitest/ui playwright msw
```

### Initialize shadcn/ui

```bash
npx shadcn@latest init

# Add components
npx shadcn@latest add button card input progress toast dialog dropdown-menu skeleton badge tabs alert
```

---

## Directory Structure Creation

```bash
# Create directories
mkdir -p src/app/{upload,library,audiobook/[id]}
mkdir -p src/components/{ui,features/{upload,library,player,common},layouts}
mkdir -p src/lib/{api,hooks,stores,utils,providers}
mkdir -p src/types
mkdir -p tests/{unit,e2e}
mkdir -p public/images

# Create files
touch src/app/layout.tsx
touch src/app/page.tsx
touch src/app/globals.css
touch src/app/upload/page.tsx
touch src/app/library/page.tsx
touch src/app/audiobook/[id]/page.tsx

touch src/lib/api/client.ts
touch src/lib/api/endpoints.ts
touch src/lib/api/types.ts
touch src/lib/api/errors.ts
touch src/lib/api/query-keys.ts

touch src/lib/hooks/use-books.ts
touch src/lib/hooks/use-upload.ts
touch src/lib/hooks/use-audio-player.ts

touch src/lib/stores/player-store.ts
touch src/lib/stores/ui-store.ts

touch src/lib/utils/format.ts
touch src/lib/utils/validation.ts
touch src/lib/utils/constants.ts

touch src/lib/providers/query-provider.tsx
touch src/lib/providers/theme-provider.tsx
```

---

## Configuration Files

### `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.your-storage-domain.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

### `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### `.eslintrc.json`

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "react/no-unescaped-entities": "off",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

## VS Code Configuration

### `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]+)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### `.vscode/extensions.json`

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-playwright.playwright"
  ]
}
```

---

## Package.json Scripts

```json
{
  "name": "audioforge-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

## Development Workflow

### Daily Development

```bash
# Start development server
pnpm dev

# In another terminal, start tests
pnpm test:watch

# Format code
pnpm format

# Check types
pnpm typecheck

# Lint
pnpm lint
```

### Before Committing

```bash
# Run all checks
pnpm lint && pnpm typecheck && pnpm test:coverage

# Fix issues
pnpm lint:fix && pnpm format
```

### Build for Production

```bash
# Create production build
pnpm build

# Run production build locally
pnpm start
```

---

## IDE Setup

### VS Code Extensions

1. **ESLint** - `dbaeumer.vscode-eslint`
2. **Prettier** - `esbenp.prettier-vscode`
3. **Tailwind CSS IntelliSense** - `bradlc.vscode-tailwindcss`
4. **Playwright** - `ms-playwright.playwright`
5. **Error Lens** - `usernamehw.errorlens`
6. **Path Intellisense** - `christian-kohler.path-intellisense`

### VS Code Settings

```json
// Automatically add imports
"typescript.suggest.autoImports": true,

// Organize imports on save
"editor.codeActionsOnSave": {
  "source.organizeImports": true
}
```

---

## Environment Checklist

| Task | Command | Status |
|------|---------|--------|
| Node.js installed | `node -v` | >= 18.17 |
| pnpm installed | `pnpm -v` | >= 8.0 |
| Dependencies installed | `pnpm install` | ✅ |
| Environment vars set | `.env.local` | ✅ |
| Development server runs | `pnpm dev` | ✅ |
| Tests pass | `pnpm test` | ✅ |
| Lint passes | `pnpm lint` | ✅ |
| Build succeeds | `pnpm build` | ✅ |

---

## Troubleshooting

### Module Not Found

```bash
# Clear Next.js cache
rm -rf .next
pnpm dev
```

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 pnpm dev
```

### Type Errors

```bash
# Regenerate Next.js types
rm -rf .next
pnpm dev
```

### pnpm Lock Issues

```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## Connecting to Backend

1. Ensure backend is running on `http://localhost:3000`
2. Set `NEXT_PUBLIC_API_URL=http://localhost:3000/api` in `.env.local`
3. Restart frontend: `pnpm dev`
4. Test connection: visit `http://localhost:3000/api/books`