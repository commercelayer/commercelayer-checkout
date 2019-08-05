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
      return APIService.getOrder(orderId)
        .then(order => {
          commit('updateOrder', order)
          return order
        })
        .catch(error => {
          console.log('Set order error:', error.response)
        })
    },
    setOrderCustomerEmail ({ commit, state }) {
      NProgress.start()
      return APIService.updateOrderCustomerEmail(state.order)
        .then(order => {
          commit('updateOrder', order)
          NProgress.done()
          return order
        })
        .catch(error => {
          console.log('Set order customer email error:', error.response)
        })
    },
    setOrderAddresses ({ commit, state }) {
      NProgress.start()
      return APIService.updateOrderAddresses(state.order)
        .then(order => {
          commit('updateOrder', order)
          NProgress.done()
          return order
        })
        .catch(error => {
          console.log('Set order addresses error:', error.response)
        })
    },
    setShipmentShippingMethod ({ dispatch }, payload) {
      NProgress.start()
      return APIService.updateShipmentShippingMethod(payload.shipment, payload.shippingMethod)
        .then(() => {
          return dispatch('setOrder', payload.order.id)
            .then(order => {
              NProgress.done()
              return order
            })
        })
        .catch(error => {
          console.log('Set shipment shipping method error:', error.response)
        })
    },
    setOrderPaymentMethod ({ commit }, payload) {
      NProgress.start()
      return APIService.updateOrderPaymentMethod(payload.order, payload.paymentMethod)
        .then(order => {
          commit('updateOrder', order)
          NProgress.done()
          return order
        })
        .catch(error => {
          console.log('Set order payment method error:', error.response)
        })
    },
    setOrderPaymentSource ({ commit }, payload) {
      NProgress.start()
      return APIService.createOrderPaymentSource(payload.order, payload.paymentMethod, payload.paymentSourceAttributes)
        .then(paymentSource => {
          commit('updateOrderPaymentSource', paymentSource)
          NProgress.done()
          return paymentSource
        })
        .catch(error => {
          console.log('Set order payment source error:', error.response)
        })
    }
  }
})
