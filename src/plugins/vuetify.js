import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    themes: {
      light: {
        primary: process.env.VUE_APP_BRAND_COLOR,
        success: process.env.VUE_APP_SUCCESS_COLOR,
        error: process.env.VUE_APP_ERROR_COLOR
      }
    }
  }
})
