# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Required skills

Before writing or reviewing code, load and follow the project skills in `.claude/skills/`: `juniors-best-practice`, `react-hooks-best-practices`, `vercel-react-best-practices`, and `reactuse` (prefer a `@siberiacancode/reactuse` hook over custom hook code when one fits).

## Project state

Agency landing site. The home page (`src/app/page.tsx`) is a full-screen hero with a 3D glass logo; there is no test framework, database, or API layer yet.

- **3D hero**: `src/components/elements/home/` — `GlassLogo` lazy-loads `GlassLogoScene` (three.js via `@react-three/fiber` + `drei`, `ssr: false`) and runs `Preloader`; the scene reports ready after its first frame, the preloader counts to 100%, then the logo scales in.
- **SEO**: all site data (name, title, description, lang, theme color, URL) lives in `src/config/site.ts` and feeds `layout.tsx` metadata, JSON-LD in `page.tsx`, `sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx`, `apple-icon.tsx`. The production domain comes from `NEXT_PUBLIC_SITE_URL`.

## Commands

Package manager is **Bun** (`packageManager: bun@1.3.11`, `bun.lock`). Use `bun`, not npm/yarn/pnpm.

- `bun install` — install dependencies
- `bun dev` — dev server at http://localhost:3000 (also regenerates `AGENTS.md`)
- `bun run build` / `bun start` — production build / serve
- `bun run lint` — `biome check` (lint + formatting + import sorting); `bunx biome check --write` to auto-fix
- `bun run format` — `biome format --write`
- `bunx tsc --noEmit` — typecheck (no script defined)

There are no tests yet.

## Stack and conventions

- **Next.js 16 (App Router) + React 19.** Per `AGENTS.md`, check `node_modules/next/dist/docs/` (`01-app/`, `03-architecture/`, …) before using Next APIs — don't rely on memory of older versions.
- **React Compiler is enabled** (`reactCompiler: true` in `next.config.ts`). Don't add manual `useMemo`/`useCallback`/`React.memo` for performance; the compiler handles memoization.
- **Typed route helpers**: layouts/pages use Next's global generated types (e.g. `LayoutProps<"/">` in `src/app/layout.tsx`, generated into `.next/types`) rather than hand-written prop types.
- **Biome, not ESLint/Prettier.** Config in `biome.json`: single quotes, no semicolons, no trailing commas, 2-space indent, line width 100; recommended rules plus the `next` and `react` domains. Import groups: packages → `@/` aliases → relative paths → styles (side-effect CSS imports are not moved automatically, keep them last by hand).
- **Barrel packages** (`@siberiacancode/reactuse`, `@react-three/drei`) are listed in `experimental.optimizePackageImports` in `next.config.ts`; add new barrel-style packages there.
- **Tailwind CSS v4** via `@tailwindcss/postcss`. There is no `tailwind.config.*`; theme tokens live in `src/app/globals.css` under `@theme inline`. The site is dark-only (`color-scheme: dark`); `font-sans` is Geist, `font-mono` is IBM Plex Mono.
- **Structure**: source lives under `src/`, import alias `@/*` → `./src/*`. Custom hooks go in `src/hooks/` (named `use<Feature>`, params type `Use<Feature>Params`, grouped return like `{ state, refs }`); page sections in `src/components/elements/<page>/`; icons as SVG React components in `src/components/icon/`; conditional classes via `clsx`.
