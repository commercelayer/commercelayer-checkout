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
    return apiClient.get('/orders/' + orderId + '?include=line_items&fields[orders]=number,skus_count,formatted_subtotal_amount,formatted_discount_amount,formatted_shipping_amount,formatted_total_tax_amount,formatted_total_amount_with_taxes&fields[line_items]=item_type,image_url,name,sku_code,formatted_unit_amount,quantity,formatted_total_amount')
  })
  .catch(error => {
    console.log('Get order service error:', error.response)
  })  
}

export default {
  getOrder
}