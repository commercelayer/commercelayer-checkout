import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/Layout.vue'
import Checkout from '@/views/Checkout.vue'
import Confirmation from '@/views/Confirmation.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/:order_id',
      component: Layout,
      children: [
        {
          path: 'checkout',
          name: 'checkout',
          component: Checkout
        },
        {
          path: 'confirmation',
          name: 'confirmation',
          component: Confirmation
        }
      ]
    }
  ]
})
