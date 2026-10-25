export const TILE_VARIANTS = ['dark', 'light', 'accent', 'difference'] as const
export type TileVariant = (typeof TILE_VARIANTS)[number]

export const TILE_SIZES = ['md', 'lg'] as const
export type TileSize = (typeof TILE_SIZES)[number]

// Pressing squeezes the tile quickly; letting go springs it back with a small overshoot. Uses the
// separate scale property, so it never fights GSAP, which animates transform/opacity on these
export const TILE_CLASS_NAME =
  'transition-[scale] duration-600 ease-spring active:scale-[0.94] active:duration-100 active:ease-out flex cursor-pointer items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current'

// md is the header / chat button; lg the bigger call to action
export const TILE_SIZE_CLASS_NAMES: Record<TileSize, { root: string; tile: string }> = {
  md: {
    root: 'gap-2 rounded-[2.4rem] py-[4.5rem] pr-[4.5rem] pl-2 text-[20rem] leading-5 tracking-[-0.2rem]',
    tile: 'size-6 rounded-[2.4rem]'
  },
  lg: {
    root: 'gap-3 rounded-[3.2rem] py-[6rem] pr-[6rem] pl-3 text-[28rem] leading-7 tracking-[-0.28rem]',
    tile: 'size-9 rounded-[3.2rem]'
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
