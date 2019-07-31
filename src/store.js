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
    GET_ORDER (state, order) {
      state.order = order
    },
    SET_CURRENT_STEP (state, step) {
      state.currentStep = step
    },
    updateField
  },
  actions: {
    getOrder ({ commit }, orderId) {
      return APIService.getOrder(orderId)
        .then(order => {
          commit('GET_ORDER', order)
          return order
        })
        .catch(error => {
          console.log('Get order error:', error.response)
        })
    },
    setCurrentStep ({ commit }, step) {
      commit('SET_CURRENT_STEP', step)
    }
  }
})
