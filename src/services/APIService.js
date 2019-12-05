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
  orderDefaults,
  customerAddressAttributes
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

const createCustomerSubscription = (customerEmail, customerSubscription) => {
  return apiClient
    .post('/customer_subscriptions', {
      data: {
        type: 'customer_subscriptions',
        attributes: {
          customer_email: customerEmail,
          reference: process.env.VUE_APP_SUBSCRIPTION_REF
        }
      }
    })
    .then(response => {
      return normalize(response.data).get(['id'])
    })
    .catch(error => {
      return Promise.reject(error.response)
    })
}

const updateCustomerSubscription = (customerEmail, customerSubscription) => {
  return apiClient
    .patch('/customer_subscriptions/' + customerSubscription.id, {
      data: {
        type: 'customer_subscriptions',
        id: customerSubscription.id,
        attributes: {
          customer_email: customerEmail,
          reference: process.env.VUE_APP_SUBSCRIPTION_REF
        }
      }
    })
    .then(response => {
      return normalize(response.data).get(['id'])
    })
    .catch(error => {
      return Promise.reject(error.response)
    })
}

const deleteCustomerSubscription = customerSubscription => {
  return apiClient
    .delete('/customer_subscriptions/' + customerSubscription.id)
    .then(_ => {
      return Promise.resolve({})
    })
    .catch(error => {
      return Promise.reject(error.response)
    })
}

const handleCustomerSubscription = (customerEmail, customerSubscription) => {
  if (customerSubscription.checked) {
    if (customerSubscription.id) {
      return updateCustomerSubscription(customerEmail, customerSubscription)
    } else {
      return createCustomerSubscription(customerEmail, customerSubscription)
    }
  } else if (customerSubscription.id) {
    return deleteCustomerSubscription(customerSubscription)
  } else {
    return Promise.resolve({})
  }
}

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
      return normalize(response.data).get(customerAddressAttributes)
    })
    .catch(error => {
      return Promise.reject(error.response)
    })
}

const getCustomerPaymentSources = () => {
  return apiClient
    .get('/customer_payment_sources?include=payment_source')
    .then(response => {})
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

const updateOrder = (order, attributes) => {
  return apiClient
    .patch('/orders/' + order.id + '?include=' + orderIncludes.join(','), {
      data: {
        type: 'orders',
        id: order.id,
        attributes: attributes
      }
    })
    .then(response => {
      return normalizedOrder(order, response)
    })
    .catch(error => {
      return Promise.reject(error.response)
    })
}

const createAddress = attributes => {
  return apiClient
    .post(`/addresses`, {
      data: {
        type: 'addresses',
        attributes: _.omit(attributes, ['id'])
      }
    })
    .then(response => {
      return normalize(response.data).get(addressAttributes)
    })
    .catch(error => {
      return Promise.reject(error.response)
    })
}

const updateAddress = attributes => {
  return apiClient
    .patch(`/addresses/${attributes.id}`, {
      data: {
        type: 'addresses',
        id: attributes.id,
        attributes: _.omit(attributes, ['id'])
      }
    })
    .then(response => {
      return normalize(response.data).get(addressAttributes)
    })
    .catch(error => {
      return Promise.reject(error.response)
    })
}

const saveBillingAddress = order => {
  return order._save_billing_address_to_customer_address_book
    ? updateOrder(order, {
        _save_billing_address_to_customer_address_book:
          order._save_billing_address_to_customer_address_book
      })
    : order
}

const saveShippingAddress = order => {
  return order._save_shipping_address_to_customer_address_book
    ? updateOrder(order, {
        _save_shipping_address_to_customer_address_book:
          order._save_shipping_address_to_customer_address_book
      })
    : order
}

const updateOrCreateBillingAddress = order => {
  if (order._billing_address_clone_id) {
    return updateOrder(order, {
      _billing_address_clone_id: order._billing_address_clone_id
    }).then(order => {
      return order.billing_address
    })
  } else {
    return order.billing_address.id
      ? updateAddress(order.billing_address).then(address => {
          saveBillingAddress(order)
          return address
        })
      : createAddress(order.billing_address).then(address => {
          saveBillingAddress(order)
          return address
        })
  }
}

const updateOrCreateShippingAddress = order => {
  if (order._shipping_address_clone_id) {
    return updateOrder(order, {
      _shipping_address_clone_id: order._shipping_address_clone_id
    }).then(order => {
      return order.shipping_address
    })
  } else {
    return order.shipping_address.id
      ? updateAddress(order.shipping_address).then(address => {
          saveShippingAddress(order)
          return address
        })
      : createAddress(order.shipping_address).then(address => {
          saveShippingAddress(order)
          return address
        })
  }
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
}

const updateOrderAddresses = order => {
  return updateOrCreateBillingAddress(order)
    .then(billingAddress => {
      return updateBillingAddressFields(order, billingAddress)
        .then(updatedOrder => {
          if (order.ship_to_different_address) {
            return updateOrCreateShippingAddress(order).then(
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
        })
        .catch(error => {
          return Promise.reject(error)
        })
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
  handleCustomerSubscription,
  getOrder,
  getCustomerAddresses,
  getCustomerPaymentSources,
  updateOrder,
  updateOrderAddresses,
  updateShipmentShippingMethod,
  updateOrderPaymentMethod,
  createOrderPaymentSource,
  updateOrderPaymentSource,
  placeOrder
}
