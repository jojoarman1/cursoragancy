# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Required skills

Before writing or reviewing code, load and follow the project skills in `.claude/skills/`: `juniors-best-practice`, `react-hooks-best-practices`, `vercel-react-best-practices`, and `reactuse` (prefer a `@siberiacancode/reactuse` hook over custom hook code when one fits).

## Project state

Agency landing site. The home page (`src/app/page.tsx`) is a full-screen hero with a 3D glass logo; there is no test framework, database, or API layer yet.

- **3D hero**: `src/components/elements/home/` — `GlassLogo` lazy-loads `GlassLogoScene` (three.js via `@react-three/fiber` + `drei`, `ssr: false`) and runs `Preloader`; the scene reports ready after its first frame, the preloader counts to 100%, then the logo scales in.
- **Animations use GSAP** (`gsap` + `useGSAP` from `@gsap/react`, registered in the hook module). DOM animations tween CSS variables or styles directly instead of React state (e.g. the preloader tweens `--progress`, the markup derives position/opacity from it); per-frame 3D work stays in R3F `useFrame`.
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
- **Tailwind CSS v4** via `@tailwindcss/postcss`. There is no `tailwind.config.*`; theme tokens live in `src/app/globals.css` under `@theme`. The site is dark-only (`color-scheme: dark`); `font-sans` is Geist, `font-mono` is IBM Plex Mono.
- **1rem = 1px of the design artboard.** `html` font-size is `min(100vw / W, 100vh / H)` for artboards 1920×1080 (desktop), 1024×768 (≤1024px), 480×667 (≤480px), so the whole layout scales like the Figma frame. Tailwind's rem scales (spacing, text, radius, container) are redefined in artboard px, so `p-4` = 16px and `text-sm` = 14px at artboard size; xs–base text has a 12px floor. Write Figma pixel values as `rem` (`w-[320rem]`, `text-[42rem]`); use `px` only for things that must not scale (hairlines, minimum sizes). Media queries are unaffected (they use the browser default 16px).
- **CSS transitions** default to the `--ease-smooth` token (`cubic-bezier(0.22, 1, 0.36, 1)`, 500ms); GSAP timings live in `src/config/animation.ts`.
- **Structure**: source lives under `src/`, import alias `@/*` → `./src/*`. Custom hooks go in `src/hooks/` (named `use<Feature>`, params type `Use<Feature>Params`, grouped return like `{ state, refs }`); page sections in `src/components/elements/<page>/`; icons as SVG React components in `src/components/icon/`; conditional classes via `clsx`.
