import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: process.env.VUE_APP_BRAND_COLOR,
    error: process.env.VUE_APP_ERROR_COLOR
  }
})
