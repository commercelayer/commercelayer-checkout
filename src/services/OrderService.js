import axios from 'axios'
import AuthService from '@/services/AuthService'

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL + '/api',
  headers: {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
  }
})

const getOrder = (orderId) => {
  return AuthService.getAccessToken()
  .then( _ => {
    return apiClient.get('/orders/' + orderId + '?include=line_items,available_payment_methods')
  })
  .catch(error => {
    console.log('Get order service error:', error.response)
  })  
}

export default {
  getOrder
}