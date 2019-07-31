import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: process.env.VUE_APP_PRIMARY_COLOR ? process.env.VUE_APP_PRIMARY_COLOR : '#000000',
    secondary: process.env.VUE_APP_SECONDARY_COLOR ? process.env.VUE_APP_SECONDARY_COLOR : '#000000',
    accent: process.env.VUE_APP_ACCENT_COLOR ? process.env.VUE_APP_ACCENT_COLOR : '#000000',
    error: process.env.VUE_APP_ERROR_COLOR ? process.env.VUE_APP_ERROR_COLOR : '#000000',
    info: process.env.VUE_APP_INFO_COLOR ? process.env.VUE_APP_INFO_COLOR : '#000000',
    success: process.env.VUE_APP_SUCCESS_COLOR ? process.env.VUE_APP_SUCCESS_COLOR : '#000000',
    warning: process.env.VUE_APP_WARNING_COLOR ? process.env.VUE_APP_WARNING_COLOR : '#000000'
  }
})
