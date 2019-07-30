import Vue from 'vue'
import Vuex from 'vuex'
import OrderService from '@/services/OrderService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    order: {}
  },
  mutations: {
    GET_ORDER (state, order) {
      state.order = order
    }
  },
  actions: {
    getOrder ({ commit }, orderId) {
      OrderService.getOrder(orderId)
        .then(response => {
          commit('GET_ORDER', response.data)
        })
        .catch(error => {
          console.log('Get order error:', error.response)
        })  
    }
  }
})
