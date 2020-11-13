import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from '@/lang/en.json'
import it from '@/lang/it.json'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: process.env.VUE_APP_LOCALE || 'en',
  fallbackLocale: 'en',
  messages: { en, it },
})

export default i18n
