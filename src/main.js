import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

import vuetify from '@/plugins/vuetify'
import i18n from '@/plugins/i18n'
import gtm from '@/plugins/gtm'

import 'nprogress/nprogress.css'
import '@/scss/nprogress.scss'

Vue.use(Vuelidate)

Vue.config.productionTip = false

Vue.filter('capitalize', value => {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

new Vue({
  router,
  store,
  vuetify,
  i18n,
  gtm,
  render: h => h(App)
}).$mount('#app')
