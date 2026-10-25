import { COVER_ASPECT_RATIO, REEL_WIDTH_SHARE } from '@/config/projects'

// How far (in % of its own height) the centred reel box drops so its bottom edge sits on the
// cover's bottom edge, where it starts lying flat
export const getReelDropPercent = (reelAspectRatio: number) => {
  const heightShare = (REEL_WIDTH_SHARE * COVER_ASPECT_RATIO) / reelAspectRatio
  return ((1 / heightShare - 1) / 2) * 100
}
