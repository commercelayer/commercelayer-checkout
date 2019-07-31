import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

import '@/plugins/vuetify'
import i18n from '@/plugins/i18n'

import 'nprogress/nprogress.css'

Vue.use(Vuelidate)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
