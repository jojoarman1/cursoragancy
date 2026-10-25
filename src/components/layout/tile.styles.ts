export const TILE_VARIANTS = ['dark', 'light'] as const
export type TileVariant = (typeof TILE_VARIANTS)[number]

// Pressing squeezes the tile quickly; letting go springs it back with a small overshoot. Uses the
// separate scale property, so it never fights GSAP, which animates transform/opacity on these
export const TILE_CLASS_NAME =
  'transition-[scale] duration-600 ease-spring active:scale-[0.94] active:duration-100 active:ease-out flex cursor-pointer items-center gap-2 rounded-[2.4rem] py-[4.5rem] pr-[4.5rem] pl-2 text-[20rem] leading-5 tracking-[-0.2rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current'

export const TILE_VARIANT_CLASS_NAMES: Record<TileVariant, { root: string; tile: string }> = {
  dark: { root: 'bg-foreground text-background', tile: 'bg-background/30' },
  light: { root: 'bg-background text-foreground', tile: 'bg-foreground text-background' }
}
