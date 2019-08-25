import { apiRequestHeaders, euAddress } from './utils'
import _ from 'lodash'

Cypress.Commands.add('get_access_token', () => {
  cy.request({
    url: Cypress.env('API_BASE_URL') + '/oauth/token',
    method: 'POST',
    body: {
      grant_type: 'client_credentials',
      client_id: Cypress.env('API_CLIENT_ID'),
      client_secret: Cypress.env('API_CLIENT_SECRET')
    },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }).its('body.access_token')
})

Cypress.Commands.add('create_order', options => {
  cy.get_access_token().then(accessToken => {
    cy.request({
      url: Cypress.env('API_BASE_URL') + '/api/orders',
      method: 'POST',
      body: {
        data: {
          type: 'orders',
          relationships: {
            market: {
              data: {
                type: 'markets',
                id: options.market_id
              }
            }
          }
        }
      },
      headers: apiRequestHeaders(accessToken)
    }).its('body.data')
  })
})

Cypress.Commands.add('get_order', options => {
  let url = Cypress.env('API_BASE_URL') + '/api/orders/' + options.order_id
  if (options.include) url = url + '?include=' + options.include
  cy.get_access_token().then(accessToken => {
    cy.request({
      url: url,
      method: 'GET',
      headers: apiRequestHeaders(accessToken)
    }).its('body')
  })
})

Cypress.Commands.add('create_line_item', options => {
  cy.get_access_token().then(accessToken => {
    cy.request({
      url: Cypress.env('API_BASE_URL') + '/api/line_items',
      method: 'POST',
      body: {
        data: {
          type: 'line_items',
          attributes: {
            sku_code: options.sku_code,
            quantity: options.quantity
          },
          relationships: {
            order: {
              data: {
                type: 'orders',
                id: options.order_id
              }
            }
          }
        }
      },
      headers: apiRequestHeaders(accessToken)
    }).its('body.data')
  })
})

Cypress.Commands.add('update_stock_item', options => {
  cy.get_access_token().then(accessToken => {
    cy.request({
      url:
        Cypress.env('API_BASE_URL') +
        '/api/stock_items/' +
        options.stock_item_id,
      method: 'PATCH',
      body: {
        data: {
          type: 'stock_items',
          id: options.stock_item_id,
          attributes: {
            quantity: options.quantity
          }
        }
      },
      headers: apiRequestHeaders(accessToken)
    }).its('body.data')
  })
})

Cypress.Commands.add('update_price', options => {
  cy.get_access_token().then(accessToken => {
    cy.request({
      url: Cypress.env('API_BASE_URL') + '/api/prices/' + options.price_id,
      method: 'PATCH',
      body: {
        data: {
          type: 'prices',
          id: options.price_id,
          attributes: {
            amount_cents: options.amount_cents
          }
        }
      },
      headers: apiRequestHeaders(accessToken)
    }).its('body.data')
  })
})

Cypress.Commands.add('update_order', options => {
  cy.get_access_token().then(accessToken => {
    cy.request({
      url: Cypress.env('API_BASE_URL') + '/api/orders/' + options.order_id,
      method: 'PATCH',
      body: {
        data: {
          type: 'orders',
          id: options.order_id,
          attributes: options.attributes,
          relationships: options.relationships
        }
      },
      headers: apiRequestHeaders(accessToken)
    }).its('body.data')
  })
})

Cypress.Commands.add('create_address', options => {
  cy.get_access_token().then(accessToken => {
    cy.request({
      url: Cypress.env('API_BASE_URL') + '/api/addresses',
      method: 'POST',
      body: {
        data: {
          type: 'addresses',
          attributes: options.attributes
        }
      },
      headers: apiRequestHeaders(accessToken)
    }).its('body.data')
  })
})

Cypress.Commands.add('update_shipment', options => {
  cy.get_access_token().then(accessToken => {
    cy.request({
      url:
        Cypress.env('API_BASE_URL') + '/api/shipments/' + options.shipment_id,
      method: 'PATCH',
      body: {
        data: {
          type: 'shipments',
          id: options.shipment_id,
          attributes: options.attributes,
          relationships: options.relationships
        }
      },
      headers: apiRequestHeaders(accessToken)
    }).its('body.data')
  })
})

Cypress.Commands.add('set_default_shipping_methods', options => {
  cy.get_access_token().then(accessToken => {
    cy.request({
      url:
        Cypress.env('API_BASE_URL') +
        '/api/orders/' +
        options.order_id +
        '/shipments?include=available_shipping_methods',
      method: 'GET',
      headers: apiRequestHeaders(accessToken)
    }).then(response => {
      let shipments = JSON.parse(response.body)
      _.each(shipments.data, shipment => {
        let shippingMethod = _.first(
          shipment.relationships.available_shipping_methods.data
        )
        cy.update_shipment({
          shipment_id: shipment.id,
          relationships: {
            shipping_method: {
              data: {
                type: 'shipping_methods',
                id: shippingMethod.id
              }
            }
          }
        })
      })
    })
  })
})

Cypress.Commands.add('get_available_payment_methods', options => {
  cy.get_access_token().then(accessToken => {
    cy.get_order({
      order_id: options.order_id,
      include: 'available_payment_methods'
    }).then(order => {
      return _.filter(JSON.parse(order).included, { type: 'payment_methods' })
    })
  })
})

Cypress.Commands.add('setup_payment_step', () => {
  cy.create_order({
    market_id: Cypress.env('EU_MARKET_ID')
  }).then(order => {
    cy.update_stock_item({
      stock_item_id: Cypress.env('EU_STOCK_ITEM_ID'),
      quantity: 10
    })

    cy.create_line_item({
      order_id: order.id,
      sku_code: Cypress.env('SKU_CODE'),
      quantity: 1
    })

    cy.create_address({
      attributes: {
        first_name: euAddress.first_name,
        last_name: euAddress.last_name,
        line_1: euAddress.line_1,
        city: euAddress.city,
        country_code: euAddress.country_code,
        state_code: euAddress.state_code,
        zip_code: euAddress.zip_code,
        phone: euAddress.phone
      }
    }).then(address => {
      cy.update_order({
        order_id: order.id,
        attributes: {
          customer_email: 'filippo@example.com',
          _shipping_address_same_as_billing: 1
        },
        relationships: {
          billing_address: {
            data: {
              type: 'addresses',
              id: address.id
            }
          }
        }
      })

      cy.set_default_shipping_methods({
        order_id: order.id
      })

      cy.visit(`${Cypress.env('BASE_URL')}/${order.id}`)
      cy.get('#customer-step-submit').click()
      cy.get('#delivery-step-submit').click()
    })

    cy.then(() => {
      return order
    })
  })
})

Cypress.Commands.add('check_payment_method', options => {
  cy.get_available_payment_methods({
    order_id: options.order_id
  }).then(paymentMethods => {
    let paymentMethodAvailable = _.find(paymentMethods, paymentMethod => {
      return (
        paymentMethod.attributes.payment_source_type ===
        options.payment_source_type
      )
    })
    if (!paymentMethodAvailable) Cypress.stop()
  })
})

Cypress.Commands.add('check_stripe_card_element', () => {
  cy.get('.__PrivateStripeElement > iframe').should(
    $iframe => expect($iframe.contents().find('input[name=cardnumber')).to.exist
  )
})

Cypress.Commands.add('enter_stripe_card', options => {
  cy.get('.__PrivateStripeElement > iframe').then($iframe => {
    const $body = $iframe.contents().find('body')
    cy.wrap($body)
      .find('input[name=cardnumber]')
      .type(options.card_number)
    cy.wrap($body)
      .find('input[name=exp-date]')
      .type(options.exp_date)
    cy.wrap($body)
      .find('input[name=cvc]')
      .type(options.cvc)
  })
})

Cypress.Commands.add('check_stripe_challenge_frame', () => {
  cy.get('iframe[name=__privateStripeFrame7]').should(
    $iframe =>
      expect($iframe.contents().find('iframe[name=stripe-challenge-frame]')).to
        .exist
  )
})

Cypress.Commands.add('check_braintree_card_hosted_fields', () => {
  cy.get('iframe[name=braintree-hosted-field-number]').should(
    $iframe =>
      expect($iframe.contents().find('input[name=credit-card-number]')).to.exist
  )
  cy.get('iframe[name=braintree-hosted-field-expirationDate]').should(
    $iframe =>
      expect($iframe.contents().find('input[name=expiration]')).to.exist
  )
  cy.get('iframe[name=braintree-hosted-field-cvv]').should(
    $iframe => expect($iframe.contents().find('input[name=cvv]')).to.exist
  )
})

Cypress.Commands.add('enter_braintree_card', options => {
  cy.get('iframe[name=braintree-hosted-field-number]').then($iframe => {
    const $body = $iframe.contents().find('body')
    cy.wrap($body)
      .find('input[name=credit-card-number]')
      .type(options.card_number)
  })

  cy.get('iframe[name=braintree-hosted-field-expirationDate]').then($iframe => {
    const $body = $iframe.contents().find('body')
    cy.wrap($body)
      .find('input[name=expiration]')
      .type(options.exp_date)
  })

  cy.get('iframe[name=braintree-hosted-field-cvv]').then($iframe => {
    const $body = $iframe.contents().find('body')
    cy.wrap($body)
      .find('input[name=cvv]')
      .type(options.cvc)
  })
})

Cypress.Commands.add('check_braintree_challenge_frame', () => {
  cy.get('iframe#Cardinal-CCA-IFrame')
})

Cypress.Commands.add('authorize_braintree_challenge_frame', () => {
  cy.get('iframe#Cardinal-CCA-IFrame').then($iframe => {
    const $body = $iframe.contents().find('body')
    cy.wrap($body)
      .find('input[name=challengeDataEntry]')
      .type('1234')

    cy.wrap($body)
      .find('input[value=SUBMIT]')
      .click()
  })
})

Cypress.Commands.add('cancel_braintree_challenge_frame', () => {
  cy.get('iframe#Cardinal-CCA-IFrame').then($iframe => {
    const $body = $iframe.contents().find('body')

    cy.wrap($body)
      .find('input[value=CANCEL]')
      .click()
  })
})

Cypress.Commands.add('check_adyen_card_component', () => {
  cy.get('iframe.js-iframe').should(
    $iframe => expect($iframe.contents().find('#encryptedCardNumber')).to.exist
  )
})

Cypress.Commands.add('enter_adyen_card', options => {
  cy.get('iframe.js-iframe')
    .eq(0)
    .then($iframe => {
      const $body = $iframe.contents().find('body')
      cy.wrap($body)
        .find('#encryptedCardNumber')
        .type(options.card_number)
    })
  cy.get('iframe.js-iframe')
    .eq(1)
    .then($iframe => {
      const $body = $iframe.contents().find('body')
      cy.wrap($body)
        .find('#encryptedExpiryDate')
        .type(options.exp_date)
    })
  cy.get('iframe.js-iframe')
    .eq(2)
    .then($iframe => {
      const $body = $iframe.contents().find('body')
      cy.wrap($body)
        .find('#encryptedSecurityCode')
        .type(options.cvc)
    })
})

Cypress.Commands.add('check_adyen_challenge_frame', () => {
  cy.get('iframe[name=threeDSIframe]').should(
    $iframe => expect($iframe.contents().find('input[name=answer]')).to.exist
  )
})

Cypress.Commands.add('authorize_adyen_challenge_frame', () => {
  cy.get('iframe[name=threeDSIframe]').then($iframe => {
    const $body = $iframe.contents().find('body')
    cy.wrap($body)
      .find('input[name=answer]')
      .type('password')

    cy.wrap($body)
      .find('input[value=Submit]')
      .click()
  })
})
