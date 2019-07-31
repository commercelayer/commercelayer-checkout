import Vue from 'vue'
import Vuex from 'vuex'
import APIService from '@/services/APIService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentStep: 1,
    order: {}
  },
  mutations: {
    GET_ORDER (state, order) {
      state.order = order
    },
    SET_CURRENT_STEP (state, step) {
      state.currentStep = step
    }
  },
  actions: {
    getOrder ({ commit }, orderId) {
      return APIService.getOrder(orderId)
        .then(response => {
          commit('GET_ORDER', response.data)
          return response.data
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
