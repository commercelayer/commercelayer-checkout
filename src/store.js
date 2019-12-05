import Vue from 'vue'
import Vuex from 'vuex'
import { getField, updateField } from 'vuex-map-fields'
import APIService from '@/services/APIService'
import NProgress from 'nprogress'
import router from '@/router'
import i18n from '@/plugins/i18n'
import {
  getCurrentStep,
  getGiftCardOrCouponApplied,
  getRequiresDelivery,
  getRequiresPayment
} from '@/utils/functions'
import { trackPurchase } from '@/utils/gtm'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auth: {
      has_customer: false,
      access_token: null,
      refresh_token: null
    },
    current_step: 1,
    requires_delivery: true,
    requires_payment: true,
    notifications: {
      gift_card_or_coupon_applied: false
    },
    buttons: {
      loading_customer: false,
      loading_delivery: false,
      loading_payment: false
    },
    validations: {
      invalid_customer: false,
      invalid_billing_address: false,
      invalid_shipping_address: false,
      invalid_shipments: false,
      invalid_payment_method: false
    },
    errors: {
      apply_gift_card_or_coupon: null,
      set_addresses: null,
      place_order: null
    },
    selected_payment_option_component: null,
    order: {},
    customer_subscription: {
      id: null,
      checked: false
    },
    customer: {
      addresses: [],
      payment_sources: []
    }
  },
  getters: {
    getField
  },
  mutations: {
    updateOrder (state, order) {
      state.order = order
    },
    updateCurrentStep (state, value) {
      state.current_step = value
    },
    updateRequiresDelivery (state, value) {
      state.requires_delivery = value
    },
    updateRequiresPayment (state, value) {
      state.requires_payment = value
    },
    updateOrderPaymentSource (state, paymentSource) {
      state.order.payment_source = paymentSource
    },
    updateButtonLoadingCustomer (state, value) {
      state.buttons.loading_customer = value
    },
    updateButtonLoadingDelivery (state, value) {
      state.buttons.loading_delivery = value
    },
    updateButtonLoadingPayment (state, value) {
      state.buttons.loading_payment = value
    },
    updateApplyCouponError (state, value) {
      state.errors.apply_gift_card_or_coupon = value
    },
    updateGiftCardOrCouponApplied (state, value) {
      state.notifications.gift_card_or_coupon_applied = value
    },
    updateSetAddressesError (state, value) {
      state.errors.set_addresses = value
    },
    updatePlaceOrderError (state, value) {
      state.errors.place_order = value
    },
    updateAuthHasCustomer (state, value) {
      state.auth.has_customer = value
    },
    updateAuthAccessToken (state, value) {
      state.auth.access_token = value
    },
    clearAuthAccessToken (state) {
      state.auth.access_token = null
    },
    updateAuthRefreshToken (state, value) {
      state.auth.refresh_token = value
    },
    updateCustomerAddresses (state, value) {
      state.customer.addresses = value
    },
    updateCustomerSubscriptionId (state, value) {
      state.customer_subscription.id = value
    },
    disableCustomerSubscription (state) {
      state.customer_subscription.disabled = true
    },
    updateField
  },
  actions: {
    setOrder ({ commit }, orderId) {
      return APIService.getOrder(orderId).then(order => {
        commit('updateOrder', order)
        commit('updateCurrentStep', getCurrentStep(order))
        commit('updateRequiresDelivery', getRequiresDelivery(order))
        commit('updateRequiresPayment', getRequiresPayment(order))
        commit(
          'updateGiftCardOrCouponApplied',
          getGiftCardOrCouponApplied(order)
        )
        return order
      })
    },
    setCustomer ({ commit }) {
      APIService.getCustomerAddresses()
        .then(customerAddresses => {
          commit('updateCustomerAddresses', customerAddresses)
          return customerAddresses
        })
        .catch(response => console.log(response))

      APIService.getCustomerPaymentSources()
        .then(customerPaymentSources => {})
        .catch(response => console.log(response))
    },
    setOrderCustomerEmail ({ commit, state }) {
      NProgress.start()
      console.log(state.order.customer_email)
      return APIService.updateOrder(state.order, {
        customer_email: state.order.customer_email
      })
        .then(order => {
          commit('updateOrder', order)
          return order
        })
        .finally(() => {
          NProgress.done()
        })
    },
    handleCustomerSubscription ({ commit, state }) {
      NProgress.start()
      return APIService.handleCustomerSubscription(
        state.order.customer_email,
        state.customer_subscription
      )
        .then(customerSubscription => {
          commit('updateCustomerSubscriptionId', customerSubscription.id)
        })
        .catch(_ => {
          commit('disableCustomerSubscription')
        })
        .finally(() => {
          NProgress.done()
        })
    },
    setOrderGiftCardOrCouponCode ({ commit, state }) {
      NProgress.start()
      return APIService.updateOrder(state.order, {
        gift_card_or_coupon_code: state.order.gift_card_or_coupon_code
      })
        .then(order => {
          commit('updateOrder', order)
          commit('updateRequiresPayment', getRequiresPayment(order))
          commit('updateApplyCouponError', null)
          commit('updateGiftCardOrCouponApplied', true)
          return order
        })
        .catch(response => {
          commit(
            'updateApplyCouponError',
            i18n.t('errors.' + response.data.errors[0].meta.error)
          )
        })
        .finally(() => {
          NProgress.done()
        })
    },
    setOrderAddresses ({ commit, state }) {
      return APIService.updateOrderAddresses(state.order)
        .then(order => {
          commit('updateOrder', order)
          return order
        })
        .catch(response => {
          commit('updateSetAddressesError', response.data.errors[0].meta.error)
        })
        .finally(() => {
          commit('updateButtonLoadingCustomer', false)
        })
    },
    setShipmentShippingMethod ({ commit, dispatch }, payload) {
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
    setOrderPaymentMethod ({ commit }, payload) {
      return APIService.updateOrderPaymentMethod(
        payload.order,
        payload.paymentMethod
      ).then(order => {
        commit('updateOrder', order)
        return order
      })
    },
    setOrderPaymentSource ({ commit }, payload) {
      return APIService.createOrderPaymentSource(
        payload.order,
        payload.paymentMethod,
        payload.paymentSourceAttributes
      ).then(paymentSource => {
        commit('updateOrderPaymentSource', paymentSource)
        return paymentSource
      })
    },
    updateOrderPaymentSource ({ commit, state }, paymentSourceAttributes) {
      return APIService.updateOrderPaymentSource(
        state.order,
        paymentSourceAttributes
      ).then(paymentSource => {
        commit('updateOrderPaymentSource', paymentSource)
        return paymentSource
      })
    },
    placeOrder ({ commit, state }) {
      commit('updatePlaceOrderError', null)
      commit('updateButtonLoadingPayment', true)

      return APIService.placeOrder(state.order)
        .then(order => {
          commit('updateOrder', order)
          trackPurchase(order)

          router.push({
            name: 'confirmation',
            params: {
              order_id: order.id
            }
          })
        })
        .catch(response => {
          commit(
            'updatePlaceOrderError',
            i18n.t('errors.' + response.data.errors[0].meta.error)
          )
        })
        .finally(() => {
          commit('updateButtonLoadingPayment', false)
        })
    }
  }
})
