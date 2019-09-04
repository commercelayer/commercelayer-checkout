import axios from 'axios'
import AuthService from '@/services/AuthService'
import normalize from 'json-api-normalize'
import _ from 'lodash'
import {
  orderIncludes,
  orderAttributes,
  addressAttributes,
  shipmentIncludes,
  shipmentAttributes,
  paymentSourceAttributesMap,
  orderDefaults
} from '@/utils/attributes'

const normalizedOrder = (order, response) => {
  let nOrder = normalize(response.data).get(orderAttributes)
  return _.defaults(nOrder, orderDefaults(order))
}

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL + '/api',
  headers: {
    Accept: 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json'
  }
})

apiClient.interceptors.request.use(
  config => {
    return AuthService.getAccessToken().then(accessToken => {
      config.headers['Authorization'] = `Bearer ${accessToken}`
      return config
    })
  },
  error => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (
      error.response.status === 401 &&
      error.response.data.errors &&
      error.response.data.errors[0].code === 'INVALID_TOKEN'
    ) {
      return AuthService.updateAccessToken().then(accessToken => {
        error.config.headers['Authorization'] = `Bearer ${accessToken}`
        return apiClient.request(error.config)
      })
    }
    return Promise.reject(error)
  }
)

const getOrder = orderId => {
  return apiClient
    .get('/orders/' + orderId + '?include=' + orderIncludes.join(','))
    .then(response => {
      return normalizedOrder(response.data, response)
    })
    .catch(error => {
      return Promise.reject(error.response)
    })
}

const getCustomerAddresses = () => {
  return apiClient
    .get('/customer_addresses?include=address')
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      return Promise.reject(error.response)
    })
}

const getCustomerPaymentSources = () => {
  return apiClient
    .get('/customer_payment_sources?include=payment_source')
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      return Promise.reject(error.response)
    })
}

const updateShipmentShippingMethod = (shipment, shippingMethod) => {
  return apiClient
    .patch(
      '/shipments/' + shipment.id + '?include=' + shipmentIncludes.join(','),
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
      }
    )
    .then(response => {
      return normalize(response.data).get(shipmentAttributes)
    })
    .catch(error => {
      return Promise.reject(error.response)
    })
}

const updateOrderCustomerEmail = order => {
  return apiClient
    .patch('/orders/' + order.id + '?include=' + orderIncludes.join(','), {
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
    .catch(error => {
      return Promise.reject(error.response)
    })
}

const updateOrderCouponCode = order => {
  return apiClient
    .patch('/orders/' + order.id + '?include=' + orderIncludes.join(','), {
      data: {
        type: 'orders',
        id: order.id,
        attributes: {
          coupon_code: order.coupon_code
        }
      }
    })
    .then(response => {
      return normalizedOrder(order, response)
    })
    .catch(error => {
      return Promise.reject(error.response)
    })
}

const createAddress = address => {
  return apiClient
    .post(`/addresses`, {
      data: {
        type: 'addresses',
        attributes: _.omit(address, ['id'])
      }
    })
    .then(response => {
      return normalize(response.data).get(addressAttributes)
    })
    .catch(error => {
      return Promise.reject(error.response)
    })
}

const updateAddress = address => {
  return apiClient
    .patch(`/addresses/${address.id}`, {
      data: {
        type: 'addresses',
        id: address.id,
        attributes: _.omit(address, ['id'])
      }
    })
    .then(response => {
      return normalize(response.data).get(addressAttributes)
    })
    .catch(error => {
      return Promise.reject(error.response)
    })
}

const updateOrCreateAddress = address => {
  return address.id ? updateAddress(address) : createAddress(address)
}

const updateBillingAddressFields = (order, billingAddress) => {
  return apiClient
    .patch('/orders/' + order.id + '?include=' + orderIncludes.join(','), {
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
    .catch(error => {
      return Promise.reject(error.response)
    })
}

const updateShippingAddressFields = (order, shippingAddress) => {
  return apiClient
    .patch('/orders/' + order.id + '?include=' + orderIncludes.join(','), {
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
    .catch(error => {
      return Promise.reject(error.response)
    })
}

const updateOrderAddresses = order => {
  return updateOrCreateAddress(order.billing_address)
    .then(billingAddress => {
      return updateBillingAddressFields(order, billingAddress).then(
        updatedOrder => {
          if (order.ship_to_different_address) {
            return updateOrCreateAddress(order.shipping_address).then(
              shippingAddress => {
                return updateShippingAddressFields(order, shippingAddress).then(
                  updatedOrder => {
                    return _.defaults(updatedOrder, orderDefaults(updatedOrder))
                  }
                )
              }
            )
          } else {
            return _.defaults(updatedOrder, orderDefaults(updatedOrder))
          }
        }
      )
    })
    .catch(error => {
      return Promise.reject(error.response)
    })
}

const updateOrderPaymentMethod = (order, paymentMethod) => {
  return apiClient
    .patch('/orders/' + order.id + '?include=' + orderIncludes.join(','), {
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
    .catch(error => {
      return Promise.reject(error.response)
    })
}

const createOrderPaymentSource = (
  order,
  paymentMethod,
  paymentSourceAttributes
) => {
  return apiClient
    .post(`/${paymentMethod.payment_source_type}`, {
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
      let attributes =
        paymentSourceAttributesMap[paymentMethod.payment_source_type]
      let normalizedPaymentSource = normalize(response.data).get(attributes)
      return normalizedPaymentSource
    })
    .catch(error => {
      return Promise.reject(error.response)
    })
}

const updateOrderPaymentSource = (order, paymentSourceAttributes) => {
  return apiClient
    .patch(
      `/${order.payment_method.payment_source_type}/${order.payment_source.id}`,
      {
        data: {
          type: order.payment_method.payment_source_type,
          id: order.payment_source.id,
          attributes: paymentSourceAttributes
        }
      }
    )
    .then(response => {
      let attributes =
        paymentSourceAttributesMap[order.payment_method.payment_source_type]
      let normalizedPaymentSource = normalize(response.data).get(attributes)
      return normalizedPaymentSource
    })
    .catch(error => {
      return Promise.reject(error.response)
    })
}

const placeOrder = order => {
  return apiClient
    .patch('/orders/' + order.id + '?include=' + orderIncludes.join(','), {
      data: {
        type: 'orders',
        id: order.id,
        attributes: {
          _place: 1
        }
      }
    })
    .then(response => {
      return normalizedOrder(order, response)
    })
    .catch(error => {
      return Promise.reject(error.response)
    })
}

export default {
  getOrder,
  getCustomerAddresses,
  getCustomerPaymentSources,
  updateOrderCustomerEmail,
  updateOrderCouponCode,
  updateOrderAddresses,
  updateShipmentShippingMethod,
  updateOrderPaymentMethod,
  createOrderPaymentSource,
  updateOrderPaymentSource,
  placeOrder
}
