import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: process.env.VUE_APP_PRIMARY_COLOR,
    secondary: process.env.VUE_APP_SECONDARY_COLOR,
    accent: process.env.VUE_APP_ACCENT_COLOR,
    error: process.env.VUE_APP_ERROR_COLOR,
    info: process.env.VUE_APP_INFO_COLOR,
    success: process.env.VUE_APP_SUCCESS_COLOR,
    warning: process.env.VUE_APP_WARNING_COLOR
  }
})
