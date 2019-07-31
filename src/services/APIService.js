import axios from 'axios'
import AuthService from '@/services/AuthService'

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL + '/api',
  headers: {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json'
  }
})

apiClient.interceptors.request.use(config => {
  return AuthService.getAccessToken()
    .then(accessToken => {
      config.headers['Authorization'] = `Bearer ${accessToken}`
      return config
    })
}, error => {
  return Promise.reject(error)
})

const getOrder = (orderId) => {
  return apiClient.get('/orders/' + orderId + '?include=line_items,available_payment_methods')
}

export default {
  getOrder
}
