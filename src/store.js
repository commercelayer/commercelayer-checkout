import Vue from 'vue'
import Vuex from 'vuex'
import { getField, updateField } from 'vuex-map-fields'
import APIService from '@/services/APIService'
import NProgress from 'nprogress'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    current_step: 1,
    validations: {
      invalid_customer: false,
      invalid_billing_address: false,
      invalid_shipping_address: false,
      invalid_shipments: false,
      invalid_payment_method: false
    },
    buttons: {
      loading_customer: false,
      loading_delivery: false,
      loading_payment: false
    },
    order: {}
  },
  getters: {
    getField
  },
  mutations: {
    updateOrder (state, order) {
      state.order = order
    },
    updateOrderPaymentSource (state, paymentSource) {
      state.order.payment_source = paymentSource
    },
    updateField
  },
  actions: {
    setOrder ({ commit }, orderId) {
      return APIService.getOrder(orderId).then(order => {
        commit('updateOrder', order)
        return order
      })
    },
    setOrderCustomerEmail ({ commit, state }) {
      NProgress.start()
      return APIService.updateOrderCustomerEmail(state.order)
        .then(order => {
          commit('updateOrder', order)
          return order
        })
        .finally(() => {
          NProgress.done()
        })
    },
    setOrderAddresses ({ commit, state }) {
      NProgress.start()
      return APIService.updateOrderAddresses(state.order)
        .then(order => {
          commit('updateOrder', order)
          return order
        })
        .finally(() => {
          NProgress.done()
        })
    },
    setShipmentShippingMethod ({ dispatch }, payload) {
      NProgress.start()
      return APIService.updateShipmentShippingMethod(
        payload.shipment,
        payload.shippingMethod
      )
        .then(() => {
          return dispatch('setOrder', payload.order.id).then(order => {
            return order
          })
        })
        .finally(() => {
          NProgress.done()
        })
    },
    setOrderPaymentMethod ({ commit }, payload) {
      NProgress.start()
      return APIService.updateOrderPaymentMethod(
        payload.order,
        payload.paymentMethod
      )
        .then(order => {
          commit('updateOrder', order)
          return order
        })
        .finally(() => {
          NProgress.done()
        })
    },
    setOrderPaymentSource ({ commit }, payload) {
      NProgress.start()
      return APIService.createOrderPaymentSource(
        payload.order,
        payload.paymentMethod,
        payload.paymentSourceAttributes
      )
        .then(paymentSource => {
          commit('updateOrderPaymentSource', paymentSource)
          return paymentSource
        })
        .finally(() => {
          NProgress.done()
        })
    },
    updateOrderPaymentSource ({ commit, state }, paymentSourceAttributes) {
      NProgress.start()
      return APIService.updateOrderPaymentSource(
        state.order,
        paymentSourceAttributes
      )
        .then(paymentSource => {
          commit('updateOrderPaymentSource', paymentSource)
          return paymentSource
        })
        .finally(() => {
          NProgress.done()
        })
    },
    placeOrder ({ commit, state }) {
      NProgress.start()
      return APIService.placeOrder(state.order)
        .then(order => {
          commit('updateOrder', order)
          return order
        })
        .finally(() => {
          NProgress.done()
        })
    }
  }
})
