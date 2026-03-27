# AudioForge Design System

This folder contains the design system and styles for AudioForge.

## Color System

We use oklch color space for better perceptual uniformity and easier color manipulation.

### Light Mode Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `oklch(1 0 0)` | Page background |
| `--foreground` | `oklch(0.145 0 0)` | Primary text |
| `--primary` | `oklch(0.696 0.196 32.321)` | Primary actions, buttons |
| `--secondary` | `oklch(0.97 0 0)` | Secondary backgrounds |
| `--muted` | `oklch(0.97 0 0)` | Subtle backgrounds |
| `--accent` | `oklch(0.97 0 0)` | Accent backgrounds |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Error states |
| `--border` | `oklch(0.922 0 0)` | Borders |

### Dark Mode Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `oklch(0.145 0 0)` | Dark background |
| `--foreground` | `oklch(0.985 0 0)` | Light text |
| `--primary` | `oklch(0.75 0.183 55.361)` | Primary in dark mode |
| `--secondary` | `oklch(0.269 0 0)` | Secondary dark |
| `--muted` | `oklch(0.269 0 0)` | Subtle dark |
| `--border` | `oklch(1 0 0 / 10%)` | Subtle white border |

## Typography

### Font Families

```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas;
```

### Font Sizes (Tailwind)

| Class | Size | Usage |
|-------|------|-------|
| `text-xs` | 0.75rem | Labels, hints |
| `text-sm` | 0.875rem | Body small, secondary |
| `text-base` | 1rem | Body text |
| `text-lg` | 1.125rem | Large body |
| `text-xl` | 1.25rem | Headings |
| `text-2xl` | 1.5rem | Section headings |
| `text-3xl` | 1.875rem | Page headings |
| `text-4xl` | 2.25rem | Hero headings |

## Spacing

Uses Tailwind's spacing scale:

| Class | Value |
|-------|-------|
| `p-1` | 0.25rem (4px) |
| `p-2` | 0.5rem (8px) |
| `p-3` | 0.75rem (12px) |
| `p-4` | 1rem (16px) |
| `p-6` | 1.5rem (24px) |
| `p-8` | 2rem (32px) |

## Border Radius

```css
--radius: 0.625rem; /* 10px */
--radius-sm: calc(var(--radius) - 4px); /* 6px */
--radius-md: calc(var(--radius) - 2px); /* 8px */
--radius-lg: var(--radius); /* 10px */
--radius-xl: calc(var(--radius) + 4px); /* 14px */
```

## Shadows

Use Tailwind's shadow utilities:

- `shadow-sm` - Subtle elevation
- `shadow` - Default elevation
- `shadow-md` - Medium elevation
- `shadow-lg` - High elevation

## Animations

### Fade In

```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
```

### Slide In

```css
@keyframes slide-in {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
```

## Using the Design System

### In Components

```tsx
// Use Tailwind classes
<div className="bg-background text-foreground">
  <h1 className="text-3xl font-bold">Title</h1>
  <p className="text-muted-foreground">Description</p>
  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
    Click me
  </button>
</div>
```

### In CSS

```css
.my-element {
  background: var(--color-card);
  color: var(--color-card-foreground);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}
```

### Dark Mode

```tsx
// In layout.tsx
import { ThemeProvider } from '@/lib/providers/theme-provider';

<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
>
  {children}
</ThemeProvider>

// Toggle component
import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();
<Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  Toggle theme
</Button>
```

## Best Practices

1. **Always use CSS variables** for colors, never hardcode hex values in components
2. **Use Tailwind utilities** for spacing, typography, and layout
3. **Use `var(--radius-*)`** for consistent border radius
4. **Test in both light and dark modes** before merging
5. **Use semantic color names** (primary, secondary, muted) not visual descriptions (blue, gray)