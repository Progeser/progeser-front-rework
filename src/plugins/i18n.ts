// src/plugins/i18n.ts
import { createI18n } from 'vue-i18n'
import fr from '@/local/fr'

export default createI18n({
  legacy: false,
  locale: 'fr',
  messages: {
    fr
  },
  datetimeFormats: {
    'fr': {
      short: {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      },
      long: {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    }
  }
})
