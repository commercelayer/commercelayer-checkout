import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/Layout.vue'
import Checkout from '@/views/Checkout.vue'
import Confirmation from '@/views/Confirmation.vue'

import NProgress from 'nprogress'

import store from '@/store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/:order_id',
      component: Layout,
      props: true,
      beforeEnter (routeTo, routeFrom, next) {
        store.dispatch('setOrder', routeTo.params.order_id).then(order => {
          routeTo.params.order = order
          next()
        })
      },
      children: [
        {
          path: '',
          name: 'checkout',
          component: Checkout
        },
        {
          path: 'thankyou',
          name: 'confirmation',
          component: Confirmation
        }
      ]
    }
  ]
})

router.beforeEach((routeTo, routeFrom, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
