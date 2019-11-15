import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

import Layout from '@/Layout.vue'
import Checkout from '@/views/Checkout.vue'
import Confirmation from '@/views/Confirmation.vue'

import NProgress from 'nprogress'

import store from '@/store'

import i18n from '@/plugins/i18n'
import _ from 'lodash'

Vue.use(Router)
Vue.use(Meta)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/:order_id',
      component: Layout,
      props: true,
      beforeEnter (routeTo, routeFrom, next) {
        if (routeTo.query.access_token) {
          store.commit('updateAuthAccessToken', routeTo.query.access_token)
        }
        if (routeTo.query.refresh_token) {
          store.commit('updateAuthRefreshToken', routeTo.query.refresh_token)
        }

        store
          .dispatch('setOrder', routeTo.params.order_id)
          .then(order => {
            i18n.locale = _.lowerCase(order.language_code)
            if (store.state.auth.has_customer) {
              store.dispatch('setCustomer').then(() => {
                next()
              })
            } else {
              next()
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      children: [
        {
          path: '',
          name: 'checkout',
          component: Checkout
        },
        {
          path: 'paypal',
          beforeEnter (routeTo, routeFrom, next) {
            let paymentSourceAttributes = {
              paypal_payer_id: routeTo.query.PayerID
            }
            store
              .dispatch('updateOrderPaymentSource', paymentSourceAttributes)
              .then(() => {
                store.dispatch('placeOrder')
              })
              .catch(error => {
                console.log(error)

                next({
                  name: 'checkout'
                })
              })
          }
        },
        {
          path: 'confirmation',
          name: 'confirmation',
          component: Confirmation
        }
      ]
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((routeTo, routeFrom, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
