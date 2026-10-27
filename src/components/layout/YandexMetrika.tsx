import Script from 'next/script'

import { YANDEX_METRIKA } from '@/config/analytics'
import { SITE_CONFIG } from '@/config/site'

const TAG_URL = `https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA.id}`
const PRODUCTION_HOST = new URL(SITE_CONFIG.url).hostname

// Metrika's own loader. It only starts on the production domain: local runs and test screenshots
// would otherwise land in the stats and the Webvisor recordings
const SNIPPET = `if (location.hostname === ${JSON.stringify(PRODUCTION_HOST)}) {
  (function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
  })(window, document, 'script', ${JSON.stringify(TAG_URL)}, 'ym');
  ym(${YANDEX_METRIKA.id}, 'init', Object.assign(${JSON.stringify(YANDEX_METRIKA.options)}, {
    referrer: document.referrer,
    url: location.href
  }));
}`

// Loads after hydration, so it never holds up the first paint
export const YandexMetrika = () => (
  <>
    <Script id='yandex-metrika' strategy='afterInteractive'>
      {SNIPPET}
    </Script>
    <noscript>
      <div>
        {/* biome-ignore lint/performance/noImgElement: a tracking pixel for visitors without JS, not content */}
        <img
          src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA.id}`}
          style={{ position: 'absolute', left: '-9999px' }}
          alt=''
        />
      </div>
    </noscript>
  </>
)
