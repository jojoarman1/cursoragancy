// High enough that the shots keep their texture after compression; listed in next.config images
export const COVER_IMAGE_QUALITY = 90
// The cover box (875×576 in the design) and the reel's share of its width before it grows
export const COVER_ASPECT_RATIO = 875 / 576
export const REEL_WIDTH_SHARE = 0.45

export interface ProjectMetric {
  value: string
  label: string
}

// The hover video: 1280px wide, 30 fps, no sound (ffmpeg -crf 26–30, +faststart), and its first
// frame as a poster so the box isn't empty while the video loads
export interface ProjectReel {
  video: string
  poster: string
  // The video's own width / height, so the box shows all of it without cropping
  aspectRatio: number
}

export interface Project {
  slug: string
  title: string
  description: string
  url?: string
  metric?: ProjectMetric
  // In public/projects/<slug>/; 875×576 in the design, so ~1750px wide stays sharp on retina
  cover: string
  reel: ProjectReel
}

export const PROJECTS: Project[] = [
  {
    slug: 'viceseason-undercover',
    title: 'Viceseason Undercover',
    description:
      'Комплексная разработка нового сайта для VICESEASON UNDERCOVER — авангардного белорусского бренда уличной одежды. Создали полноценную e-commerce платформу с собственной серверной частью, административной панелью, CRM-системой, складским учётом и интеграцией онлайн-оплаты.',
    url: 'https://viceseason.com',
    metric: { value: '42%', label: 'Увеличение кол-ва клиентов и продаж' },
    cover: '/projects/viceseason-undercover/cover.png',
    reel: {
      video: '/projects/viceseason-undercover/reel.mp4',
      poster: '/projects/viceseason-undercover/reel-poster.jpg',
      aspectRatio: 1280 / 696
    }
  },
  {
    slug: 'saliystudio',
    title: 'Saliystudio',
    description:
      'Создание уникальной визуальной айдентики для личного бренда популярного видеоблогера Глеба Сайлия',
    url: 'https://saliyclothes.com',
    cover: '/projects/saliystudio/cover.png',
    reel: {
      video: '/projects/saliystudio/reel.mp4',
      poster: '/projects/saliystudio/reel-poster.jpg',
      aspectRatio: 1280 / 696
    }
  }
]
