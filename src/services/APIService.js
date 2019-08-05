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
  'id',
  'number',
  'skus_count',
  'customer_email',
  'coupon_code',
  'shipping_country_code_lock',
  'formatted_subtotal_amount',
  'formatted_shipping_amount',
  'formatted_payment_method_amount',
  'formatted_discount_amount',
  'formatted_total_tax_amount',
  'formatted_total_amount_with_taxes',
  'line_items.item_type',
  'line_items.id',
  'line_items.name',
  'line_items.sku_code',
  'line_items.image_url',
  'line_items.formatted_unit_amount',
  'line_items.quantity',
  'line_items.formatted_total_amount',
  'billing_address.id',
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
  'shipping_address.id',
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
  'shipments.id',
  'shipments.number',
  'shipments.skus_count',
  'shipments.shipment_line_items.line_item.item_type',
  'shipments.shipment_line_items.line_item.name',
  'shipments.shipment_line_items.line_item.sku_code',
  'shipments.shipment_line_items.line_item.image_url',
  'shipments.shipment_line_items.quantity',
  'shipments.available_shipping_methods.id',
  'shipments.available_shipping_methods.name',
  'shipments.available_shipping_methods.formatted_price_amount',
  'shipments.available_shipping_methods.price_amount_cents',
  'shipments.shipping_method.id',
  'shipments.shipping_method.name',
  'shipments.shipping_method.formatted_price_amount',
  'shipments.shipping_method.price_amount_cents',
  'available_payment_methods.id',
  'available_payment_methods.name',
  'available_payment_methods.payment_source_type',
  'payment_method.id',
  'payment_method.name',
  'payment_method.payment_source_type',
  'payment_source.id'
]

const addressAttributes = [
  'id',
  'first_name',
  'last_name',
  'line_1',
  'line_2',
  'city',
  'zip_code',
  'state_code',
  'country_code',
  'phone',
  'billing_info',
  'notes'
]

const shipmentIncludes = [
  'shipment_line_items.line_item',
  'available_shipping_methods',
  'shipping_method'
]

const shipmentAttributes = [
  'id',
  'number',
  'skus_count',
  'shipment_line_items.line_item.item_type',
  'shipment_line_items.line_item.name',
  'shipment_line_items.line_item.sku_code',
  'shipment_line_items.line_item.image_url',
  'shipment_line_items.quantity',
  'available_shipping_methods.id',
  'available_shipping_methods.name',
  'available_shipping_methods.formatted_price_amount',
  'available_shipping_methods.price_amount_cents',
  'shipping_method.id',
  'shipping_method.name',
  'shipping_method.formatted_price_amount',
  'shipping_method.price_amount_cents'
]

const paymentSourceAttributesMap = {
  stripe_payments: [
    'id',
    'client_secret'
  ],
  adyen_payments: [
    'id',
    'payment_methods'
  ],
  braintree_payments: [
    'id',
    'client_token'
  ],
  paypal_payments: [
    'id',
    'approval_url'
  ],
  wire_transfers: [
    'id'
  ]
}

const orderDefaults = (order) => {
  return {
    billing_address: addressDefaults(order),
    shipping_address: addressDefaults(order),
    ship_to_different_address: order.ship_to_different_address || false,
    ship_to_different_address_required: order.ship_to_different_address_required || false,
    shipments: [],
    payment_method: {},
    payment_source: {}
  }
}

const addressDefaults = (order) => {
  return {
    first_name: '',
    last_name: '',
    line_1: '',
    line_2: '',
    city: '',
    zip_code: '',
    state_code: '',
    country_code: order.shipping_country_code_lock || '',
    phone: ''
  }
}

const normalizedOrder = (order, response) => {
  let nOrder = normalize(response.data).get(orderAttributes)
  return _.defaults(nOrder, orderDefaults(order))
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
      return normalizedOrder(response.data, response)
    })
}

const updateShipmentShippingMethod = (shipment, shippingMethod) => {
  return apiClient.patch('/shipments/' + shipment.id + '?include=' + shipmentIncludes.join(','),
    {
      data: {
        type: 'shipments',
        id: shipment.id,
        relationships: {
          shipping_method: {
            data: {
              type: 'shipping_methods',
              id: shippingMethod.id
            }
          }
        }
      }
    })
    .then(response => {
      return normalize(response.data).get(shipmentAttributes)
    })
}

const updateOrderCustomerEmail = (order) => {
  return apiClient.patch('/orders/' + order.id + '?include=' + orderIncludes.join(','),
    {
      data: {
        type: 'orders',
        id: order.id,
        attributes: {
          customer_email: order.customer_email
        }
      }
    })
    .then(response => {
      return normalizedOrder(order, response)
    })
}

const createAddress = (address) => {
  return apiClient.post(`/addresses`,
    {
      data: {
        type: 'addresses',
        attributes: _.omit(address, ['id'])
      }
    })
    .then(response => {
      return normalize(response.data).get(addressAttributes)
    })
}

const updateAddress = (address) => {
  return apiClient.patch(`/addresses/${address.id}`,
    {
      data: {
        type: 'addresses',
        id: address.id,
        attributes: _.omit(address, ['id'])
      }
    })
    .then(response => {
      return normalize(response.data).get(addressAttributes)
    })
}

const updateOrCreateAddress = (address) => {
  return address.id ? updateAddress(address) : createAddress(address)
}

const updateOrderBillingAddress = (order, billingAddress) => {
  return apiClient.patch('/orders/' + order.id + '?include=' + orderIncludes.join(','),
    {
      data: {
        type: 'orders',
        id: order.id,
        attributes: {
          _shipping_address_same_as_billing: !order.ship_to_different_address
        },
        relationships: {
          billing_address: {
            data: {
              type: 'addresses',
              id: billingAddress.id
            }
          }
        }
      }
    })
    .then(response => {
      return normalizedOrder(order, response)
    })
}

const updateOrderShippingAddress = (order, shippingAddress) => {
  return apiClient.patch('/orders/' + order.id + '?include=' + orderIncludes.join(','),
    {
      data: {
        type: 'orders',
        id: order.id,
        relationships: {
          shipping_address: {
            data: {
              type: 'addresses',
              id: shippingAddress.id
            }
          }
        }
      }
    })
    .then(response => {
      return normalizedOrder(order, response)
    })
}

const updateOrderAddresses = (order) => {
  return updateOrCreateAddress(order.billing_address)
    .then(billingAddress => {
      return updateOrderBillingAddress(order, billingAddress)
        .then((updatedOrder) => {
          if (order.ship_to_different_address) {
            return updateOrCreateAddress(order.shipping_address)
              .then(shippingAddress => {
                return updateOrderShippingAddress(order, shippingAddress)
                  .then(updatedOrder => {
                    return _.defaults(updatedOrder, orderDefaults(updatedOrder))
                  })
              })
          } else {
            return _.defaults(updatedOrder, orderDefaults(updatedOrder))
          }
        })
    })
}

const updateOrderPaymentMethod = (order, paymentMethod) => {
  return apiClient.patch('/orders/' + order.id + '?include=' + orderIncludes.join(','),
    {
      data: {
        type: 'orders',
        id: order.id,
        relationships: {
          payment_method: {
            data: {
              type: 'payment_methods',
              id: paymentMethod.id
            }
          }
        }
      }
    })
    .then(response => {
      return normalizedOrder(order, response)
    })
}

const createOrderPaymentSource = (order, paymentMethod, paymentSourceAttributes) => {
  return apiClient.post(`/${paymentMethod.payment_source_type}`,
    {
      data: {
        type: paymentMethod.payment_source_type,
        attributes: paymentSourceAttributes,
        relationships: {
          order: {
            data: {
              type: 'orders',
              id: order.id
            }
          }
        }
      }
    })
    .then(response => {
      let attributes = paymentSourceAttributesMap[paymentMethod.payment_source_type]
      let normalizedPaymentSource = normalize(response.data).get(attributes)
      return normalizedPaymentSource
    })
}

export default {
  getOrder,
  updateOrderCustomerEmail,
  updateOrderAddresses,
  updateShipmentShippingMethod,
  updateOrderPaymentMethod,
  createOrderPaymentSource
}
