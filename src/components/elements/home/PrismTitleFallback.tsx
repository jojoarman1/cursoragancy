import { SITE_CONFIG } from '@/config/site'

// CSS approximation of the prism title for browsers without WebGL; the real heading is sr-only
export const PrismTitleFallback = () => (
  <div
    aria-hidden='true'
    data-text={SITE_CONFIG.name}
    className='prism-title absolute inset-0 m-auto h-fit w-fit text-[195rem] leading-[0.9] font-bold tracking-[-0.05em] max-[480px]:text-[150rem]'
  >
    <span>{SITE_CONFIG.name}</span>
  </div>
)
