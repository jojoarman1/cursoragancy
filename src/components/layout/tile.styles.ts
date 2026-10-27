export const TILE_VARIANTS = ['dark', 'light', 'accent', 'difference'] as const
export type TileVariant = (typeof TILE_VARIANTS)[number]

export const TILE_SIZES = ['md', 'lg', 'xl'] as const
export type TileSize = (typeof TILE_SIZES)[number]

// Pressing squeezes the tile quickly; letting go springs it back with a small overshoot. Uses the
// separate scale property, so it never fights GSAP, which animates transform/opacity on these
export const TILE_CLASS_NAME =
  'transition-[scale] duration-600 ease-spring active:scale-[0.94] active:duration-100 active:ease-out flex cursor-pointer items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current'

// md is the header / chat button; lg and xl the bigger calls to action
export const TILE_SIZE_CLASS_NAMES: Record<TileSize, { root: string; tile: string }> = {
  md: {
    root: 'gap-[calc(8*var(--text-unit))] rounded-[calc(2.4*var(--text-unit))] py-[calc(4.5*var(--text-unit))] pr-[calc(4.5*var(--text-unit))] pl-[calc(8*var(--text-unit))] text-[calc(20*var(--text-unit))] leading-[calc(20*var(--text-unit))] tracking-[calc(-0.2*var(--text-unit))]',
    tile: 'size-[calc(24*var(--text-unit))] rounded-[calc(2.4*var(--text-unit))]'
  },
  lg: {
    root: 'gap-[calc(12*var(--text-unit))] rounded-[calc(3.2*var(--text-unit))] py-[calc(6*var(--text-unit))] pr-[calc(6*var(--text-unit))] pl-[calc(12*var(--text-unit))] text-[calc(28*var(--text-unit))] leading-[calc(28*var(--text-unit))] tracking-[calc(-0.28*var(--text-unit))]',
    tile: 'size-[calc(36*var(--text-unit))] rounded-[calc(3.2*var(--text-unit))]'
  },
  xl: {
    root: 'gap-[calc(16*var(--text-unit))] rounded-[calc(4.4*var(--text-unit))] py-[calc(8*var(--text-unit))] pr-[calc(8*var(--text-unit))] pl-[calc(16*var(--text-unit))] text-[calc(40*var(--text-unit))] leading-[calc(40*var(--text-unit))] tracking-[calc(-0.4*var(--text-unit))]',
    tile: 'size-[calc(52*var(--text-unit))] rounded-[calc(4.4*var(--text-unit))]'
  }
}

export const TILE_VARIANT_CLASS_NAMES: Record<TileVariant, { root: string; tile: string }> = {
  dark: { root: 'bg-foreground text-background', tile: 'bg-background/30' },
  light: { root: 'bg-background text-foreground', tile: 'bg-foreground text-background' },
  // The light button with a green arrow tile, for the main call to action
  accent: { root: 'bg-background text-foreground', tile: 'bg-accent text-background' },
  // White and black blended as difference: reads like 'dark' over the light page and turns light
  // over dark sections. Only on a fixed element, which is its own stacking context
  difference: { root: 'bg-white text-black mix-blend-difference', tile: 'bg-black/30' }
}
