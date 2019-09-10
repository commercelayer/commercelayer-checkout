import Vue from 'vue'
import VueGtm from 'vue-gtm'
import router from '@/router'

Vue.use(VueGtm, {
  id: process.env.VUE_APP_GTM_CONTAINER_ID,
  queryParams: {
    gtm_auth: process.env.VUE_APP_GTM_AUTH,
    gtm_preview: process.env.VUE_APP_GTM_PREVIEW,
    gtm_cookies_win: process.env.VUE_APP_GTM_COOKIES_WIN
  },
  enabled: process.env.VUE_APP_GTM_ENABLED === 'TRUE',
  debug: process.env.VUE_APP_GTM_DEBUG === 'TRUE',
  loadScript: process.env.VUE_APP_GTM_LOAD_SCRIPT === 'TRUE',
  vueRouter: router,
  ignoredViews: []
})
