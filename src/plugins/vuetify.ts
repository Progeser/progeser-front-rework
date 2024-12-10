import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import myCustomLightTheme from "@/styles/theme";
import { VDateInput } from 'vuetify/labs/VDateInput'

export default createVuetify({
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
    }
  },
  components: {
    VDateInput,
  },
  date: {
    locale: {
      en: 'fr',
    }
  }
})
