import Vue from 'vue'
import Vuex from 'vuex'
import { getField, updateField } from 'vuex-map-fields'
import APIService from '@/services/APIService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentStep: 4,
    order: {}
  },
  getters: {
    getField
  },
  mutations: {
    updateOrder (state, order) {
      state.order = order
    },
    updateCurrentStep (state, step) {
      state.currentStep = step
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
          console.log('Get order error:', error.response)
        })
    },
    setCurrentStep ({ commit }, step) {
      commit('updateCurrentStep', step)
    }
  }
})
