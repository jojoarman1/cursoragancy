# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Required skills

Before writing or reviewing code, load and follow the project skills in `.claude/skills/`: `juniors-best-practice`, `react-hooks-best-practices`, `vercel-react-best-practices`, and `reactuse` (prefer a `@siberiacancode/reactuse` hook over custom hook code when one fits).

## Project state

Agency landing site (brand: **dialog**). The home page (`src/app/(main)/page.tsx`) is a full-screen hero with the word "dialog" drawn by a WebGL prism shader; there is no test framework, database, or API layer yet.

- **Prism title**: `src/components/elements/home/` — `HeroIntro` (`useHeroIntro`) lazy-loads `PrismTitleScene` (a plain `<canvas>` with raw WebGL, no three.js: `src/lib/prismGl.ts` sets up one full-canvas quad, `usePrismRenderer` draws it, `ssr: false`), completes its loading task on the first frame; the word then fades in plain dark (`opacity`) and the effect grows in after it (`aberration` from 0); GSAP tweens the plain numbers in `src/lib/prismState.ts`, which become the shader uniforms. The canvas texture is sized to the WebGL buffer exactly, otherwise fractional pixel ratios blur the edges. `usePrismTitle` draws the word with the page's Geist into a canvas texture (plus a blurred copy), and `src/lib/prismShader.ts` reproduces Figma's "Lens distortion" (lateral, aberration 0.83, centre 50%/60% of the text box): crisp glyph outlines, a colour-split smear inside the letters that grows with the distance from the centre, which drifts slightly towards the pointer. The real `h1` is `sr-only`; `PrismTitleFallback` + `.prism-title` in `globals.css` is a CSS approximation for browsers without WebGL.
- **Loading**: there is no preloader screen. Content that must be ready before the intro registers a task with `useLoadingTask()` and calls `complete()`; `useIsLoadingFinished()` from `src/stores/loading.ts` turns true once the last task completes and stays true (the title fades in, then the hero caption and chat button appear).
- **Header**: the fixed, transparent `Header` (`src/components/layout/`, rendered by the `src/app/(main)/layout.tsx` route group, so the root `not-found` page has none). From 1024px wide it shows the tagline, the section links and Telegram inline (`HeaderNav`); narrower screens get the "Меню" button that morphs into `MenuPanel`.
- **Chat** (`src/components/layout/Chat.tsx`, in the `(main)` layout): `useChat` runs the panel: the dark "Начать проект" button expands into it by tweening the inner layer's `clip-path` inset and radius (from the button's radius to the panel's, which is set on the outer `section` that also carries the drop shadow), and the button's arrow tile travels with the corner and crossfades into the minus close tile; on the home page the button waits for loading to finish (`useChatButtonIntro`). Conversation markup is in `src/components/layout/chat/`, `useChatForm` runs the conversation. Steps and branches live in `src/config/chat.ts`; each new step's line is typed by fading in per-character spans that the hook creates inside a span React renders empty (so layout is reserved and words never jump lines), answers can be clicked to edit (later answers are dropped), and "Отправить" opens a `mailto:` with the answers (no backend yet).
- **The prism title renders on demand**: nothing draws unless something calls `requestRender()` from `usePrismRenderer` (coalesced to one draw per animation frame), so anything that changes `PrismState` must call it. The pointer follow draws synchronously in its own animation frame (a requested render would land a frame late and judder) and stops once the centre settles. Don't call `loseContext()` on unmount: the canvas hands the dead context back on the next `getContext()`, which breaks Strict Mode's second effect run.
- **Zoom is disabled** like on snp: viewport `userScalable: false`, `touch-action: pan-x pan-y` on `html`.
- **Projects** (`Projects` → `ProjectCard` → `ProjectCover`, data in `src/config/projects.ts`, media in `public/projects/<slug>/`): the cover is a `next/image` (AVIF, quality 90, allowed in `next.config.ts`); `useFlowDistortion` redraws it through a cursor flowmap (raw WebGL, `src/lib/flow*.ts`) only while the mouse stirs it. `useReelPlayback` (in `ProjectArticle`) sets `data-active` on the whole project, photo and text, on mouse hover, or while it crosses the middle of the screen on touch screens: the reel video (`preload="none"`, poster first) rises, grows and plays, and the photo dims (`.project-reel*` in `globals.css`).
- **Film grain**: `GrainOverlay` (root layout) is a fixed layer above everything, tiled with `public/grain.png` and jumped between six offsets twice a second (`.grain-overlay` in `globals.css`), the technique supersolid.agency / bymonolog.com use. The tile is generated: every pixel one of 7 greys at ~7% alpha, about half near-black, so it reads on light and dark. Nothing else adds its own grain.
- **Animations use GSAP** (`gsap` + `useGSAP` from `@gsap/react`, registered in the hook module). DOM animations tween CSS variables or styles directly instead of React state (e.g. the chat panel's `clip-path` inset).
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
- **React Compiler is enabled** (`reactCompiler: true` in `next.config.ts`). Don't add manual `useMemo`/`useCallback`/`React.memo` for performance; the compiler handles memoization. Don't call store hooks as `store.use()` (e.g. reactuse `createStore`): the compiler treats a method named `use` like React's conditional `use()` and may skip it, breaking the hook order — wrap it in a named hook (`useIsOverLogo` in `src/stores/cursor.ts`).
- **Typed route helpers**: layouts/pages use Next's global generated types (e.g. `LayoutProps<"/">` in `src/app/layout.tsx`, generated into `.next/types`) rather than hand-written prop types.
- **Biome, not ESLint/Prettier.** Config in `biome.json`: single quotes, no semicolons, no trailing commas, 2-space indent, line width 100; recommended rules plus the `next` and `react` domains. Import groups: packages → `@/` aliases → relative paths → styles (side-effect CSS imports are not moved automatically, keep them last by hand).
- **Barrel packages** (`@siberiacancode/reactuse`) are listed in `experimental.optimizePackageImports` in `next.config.ts`; add new barrel-style packages there.
- **Tailwind CSS v4** via `@tailwindcss/postcss`. There is no `tailwind.config.*`; theme tokens live in `src/app/globals.css` under `@theme`. The site is light (`color-scheme: light`, background `#e8e8e3`, text `#080807`, tokens `--background`/`--foreground`); `font-sans` is Geist, `font-mono` is IBM Plex Mono, loaded in weight 400 only (add weights in `layout.tsx` if a new place needs them).
- **1rem = 1px of the design artboard.** `html` font-size is `min(100vw / W, 100vh / H)` for artboards 1920×1080 (desktop), 1024×768 (<1024px), 480×667 (<480px), the same edges as Tailwind's `max-[1024px]` / `max-[480px]`, so the whole layout scales like the Figma frame. Tailwind's rem scales (spacing, text, radius, container) are redefined in artboard px, so `p-4` = 16px and `text-sm` = 14px at artboard size; xs–base text has a 12px floor. Write Figma pixel values as `rem` (`w-[320rem]`, `text-[42rem]`); use `px` only for things that must not scale (hairlines, minimum sizes). Media queries are unaffected (they use the browser default 16px).
- **Text selection** inverts the page colours (global `::selection`).
- **CSS transitions** default to the `--ease-smooth` token (`cubic-bezier(0.22, 1, 0.36, 1)`, 500ms); GSAP timings live in `src/config/animation.ts`.
- **Structure**: source lives under `src/`, import alias `@/*` → `./src/*`. Custom hooks go in `src/hooks/` (named `use<Feature>`, params type `Use<Feature>Params`, grouped return like `{ state, refs }`); page sections in `src/components/elements/<page>/`; global layout pieces in `src/components/layout/`; icons as SVG React components in `src/components/icon/`; shared stores in `src/stores/`; non-React helpers in `src/lib/`; constants in `src/config/`; conditional classes via `clsx`.
