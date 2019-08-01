import axios from 'axios'
import AuthService from '@/services/AuthService'
import normalize from 'json-api-normalize'
import _ from 'lodash'

const orderIncludes = [
  'line_items',
  'billing_address',
  'shipping_address',
  'shipments.shipment_line_items.line_item',
  'shipments.available_shipping_methods',
  'shipments.shipping_method',
  'available_payment_methods',
  'payment_method',
  'payment_source'
]

const orderAttributes = [
  'number',
  'skus_count',
  'customer_email',
  'coupon_code',
  'formatted_subtotal_amount',
  'formatted_shipping_amount',
  'formatted_payment_method_amount',
  'formatted_discount_amount',
  'formatted_total_tax_amount',
  'formatted_total_amount_with_taxes',
  'line_items.item_type',
  'line_items.name',
  'line_items.sku_code',
  'line_items.image_url',
  'line_items.formatted_unit_amount',
  'line_items.quantity',
  'line_items.formatted_total_amount',
  'billing_address.first_name',
  'billing_address.last_name',
  'billing_address.line_1',
  'billing_address.line_2',
  'billing_address.city',
  'billing_address.zip_code',
  'billing_address.state_code',
  'billing_address.country_code',
  'billing_address.phone',
  'billing_address.billing_info',
  'billing_address.notes',
  'shipping_address.first_name',
  'shipping_address.last_name',
  'shipping_address.line_1',
  'shipping_address.line_2',
  'shipping_address.city',
  'shipping_address.zip_code',
  'shipping_address.state_code',
  'shipping_address.country_code',
  'shipping_address.phone',
  'shipping_address.notes',
  'available_payment_methods.id',
  'available_payment_methods.name',
  'available_payment_methods.payment_source_type',
  'shipments.id',
  'shipments.number',
  'shipments.shipment_line_items.line_item.item_type',
  'shipments.shipment_line_items.line_item.name',
  'shipments.shipment_line_items.line_item.sku_code',
  'shipments.shipment_line_items.line_item.image_url',
  'shipments.shipment_line_items.quantity',
  'shipments.available_shipping_methods.id',
  'shipments.available_shipping_methods.name',
  'shipments.shipping_method.id',
  'payment_method.id',
  'payment_source.id',
  'payment_source.name'
]

const billingAddressDefaults = {
  first_name: '',
  last_name: '',
  line_1: '',
  line_2: '',
  city: '',
  zip_code: '',
  state_code: '',
  country_code: '',
  phone: ''
}

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
  return apiClient.get('/orders/' + orderId + '?include=' + orderIncludes.join(','))
    .then(response => {
      var normalizedOrder = normalize(response.data).get(orderAttributes)
      return _.defaults(normalizedOrder, {
        billing_address: billingAddressDefaults,
        shipments: []
      })
    })
}

export default {
  getOrder
}
