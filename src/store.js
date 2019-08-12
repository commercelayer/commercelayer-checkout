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
    updateOrder(state, order) {
      state.order = order
    },
    updateOrderPaymentSource(state, paymentSource) {
      state.order.payment_source = paymentSource
    },
    updateButtonLoadingDelivery(state, value) {
      state.buttons.loading_delivery = value
    },
    updateField
  },
  actions: {
    setOrder({ commit }, orderId) {
      return APIService.getOrder(orderId).then(order => {
        commit('updateOrder', order)
        return order
      })
    },
    setOrderCustomerEmail({ commit, state }) {
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
    setOrderAddresses({ commit, state }) {
      return APIService.updateOrderAddresses(state.order).then(order => {
        commit('updateOrder', order)
        return order
      })
    },
    setShipmentShippingMethod({ commit, dispatch }, payload) {
      commit('updateButtonLoadingDelivery', true)
      return APIService.updateShipmentShippingMethod(
        payload.shipment,
        payload.shippingMethod
      ).then(() => {
        return dispatch('setOrder', payload.order.id).then(order => {
          commit('updateButtonLoadingDelivery', false)
          return order
        })
      })
    },
    setOrderPaymentMethod({ commit }, payload) {
      return APIService.updateOrderPaymentMethod(
        payload.order,
        payload.paymentMethod
      ).then(order => {
        commit('updateOrder', order)
        return order
      })
    },
    setOrderPaymentSource({ commit }, payload) {
      return APIService.createOrderPaymentSource(
        payload.order,
        payload.paymentMethod,
        payload.paymentSourceAttributes
      ).then(paymentSource => {
        commit('updateOrderPaymentSource', paymentSource)
        return paymentSource
      })
    },
    updateOrderPaymentSource({ commit, state }, paymentSourceAttributes) {
      return APIService.updateOrderPaymentSource(
        state.order,
        paymentSourceAttributes
      ).then(paymentSource => {
        commit('updateOrderPaymentSource', paymentSource)
        return paymentSource
      })
    },
    placeOrder({ commit, state }) {
      return APIService.placeOrder(state.order).then(order => {
        commit('updateOrder', order)
        return order
      })
    }
  }
})
