import {
  LEGAL_DATA_LIST,
  LEGAL_OPERATOR,
  LEGAL_OPERATOR_LINE,
  LEGAL_TELEGRAM_RECIPIENT,
  type LegalSection
} from './legal'
import { SITE_CONFIG } from './site'

const SITE_HOST = new URL(SITE_CONFIG.url).host

export const CONSENT_TITLE = 'Согласие на обработку персональных данных'

// The elements part 4 of article 9 of 152-FZ requires in a written consent
export const CONSENT_SECTIONS: LegalSection[] = [
  {
    id: 'consent',
    title: '',
    paragraphs: [
      `Отмечая согласие в чате на сайте ${SITE_HOST} перед отправкой заявки, я свободно, своей волей и в своём интересе даю согласие оператору ${LEGAL_OPERATOR_LINE} на обработку моих персональных данных на следующих условиях.`
    ]
  },
  {
    id: 'data',
    title: 'Персональные данные',
    paragraphs: [`${LEGAL_DATA_LIST}.`]
  },
  {
    id: 'purpose',
    title: 'Цель обработки',
    paragraphs: [
      'Рассмотрение моей заявки, связь со мной по моему обращению и подготовка предложения о сотрудничестве.'
    ]
  },
  {
    id: 'actions',
    title: 'Действия с данными',
    paragraphs: [
      'Сбор, запись, систематизация, накопление, хранение, уточнение, извлечение, использование, передача (предоставление, доступ), блокирование, удаление и уничтожение, с использованием средств автоматизации.',
      `Я согласен на трансграничную передачу данных в мессенджер ${LEGAL_TELEGRAM_RECIPIENT}.`
    ]
  },
  {
    id: 'term',
    title: 'Срок и отзыв согласия',
    paragraphs: [
      'Согласие действует до достижения цели обработки, но не дольше 3 лет с момента его получения.',
      `Я могу отозвать согласие в любой момент, написав оператору на ${LEGAL_OPERATOR.email}. После отзыва оператор прекращает обработку и уничтожает данные в течение 30 дней, если иное не предусмотрено законом.`
    ]
  }
]
