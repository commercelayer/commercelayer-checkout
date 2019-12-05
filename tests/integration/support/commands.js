import { apiRequestHeaders, euAddress } from './utils'
import _ from 'lodash'

Cypress.Commands.add('iframe', { prevSubject: 'element' }, $iframe => {
  return new Cypress.Promise(resolve => {
    $iframe.ready(function() {
      resolve($iframe.contents().find('body'))
    })
  })
})

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

Cypress.Commands.add('get_customer_access_token', credentials => {
  cy.request({
    url: Cypress.env('API_BASE_URL') + '/oauth/token',
    method: 'POST',
    body: {
      grant_type: 'password',
      client_id: Cypress.env('API_CLIENT_ID'),
      client_secret: Cypress.env('API_CLIENT_SECRET'),
      username: credentials.username,
      password: credentials.password
    },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }).its('body')
})

Cypress.Commands.add('create_order', options => {
  cy.get_access_token().then(accessToken => {
    cy.request({
      url: Cypress.env('API_BASE_URL') + '/api/orders',
      method: 'POST',
      body: {
        data: {
          type: 'orders',
          attributes: {
            language_code: options.language_code,
            terms_url: 'https://example.com/terms',
            privacy_url: 'https://example.com/privacy',
            cart_url: 'https://example.com/cart',
            return_url: 'https://example.com/return'
          },
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

Cypress.Commands.add('create_sku_line_item', options => {
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

Cypress.Commands.add('create_gift_card', options => {
  cy.get_access_token().then(accessToken => {
    cy.request({
      url: Cypress.env('API_BASE_URL') + '/api/gift_cards',
      method: 'POST',
      body: {
        data: {
          type: 'gift_cards',
          attributes: options.attributes
        }
      },
      headers: apiRequestHeaders(accessToken)
    }).its('body.data')
  })
})

Cypress.Commands.add('purchase_gift_card', options => {
  cy.get_access_token().then(accessToken => {
    cy.request({
      url:
        Cypress.env('API_BASE_URL') + '/api/gift_cards/' + options.gift_card_id,
      method: 'PATCH',
      body: {
        data: {
          type: 'gift_cards',
          id: options.gift_card_id,
          attributes: {
            _purchase: true
          }
        }
      },
      headers: apiRequestHeaders(accessToken)
    }).its('body.data')
  })
})

Cypress.Commands.add('activate_gift_card', options => {
  cy.get_access_token().then(accessToken => {
    cy.request({
      url:
        Cypress.env('API_BASE_URL') + '/api/gift_cards/' + options.gift_card_id,
      method: 'PATCH',
      body: {
        data: {
          type: 'gift_cards',
          id: options.gift_card_id,
          attributes: {
            _activate: true
          }
        }
      },
      headers: apiRequestHeaders(accessToken)
    }).its('body.data')
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
            quantity: options.quantity
          },
          relationships: {
            order: {
              data: {
                type: 'orders',
                id: options.order_id
              }
            },
            item: {
              data: {
                type: options.item_type,
                id: options.item_id
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
      console.log(response)

      let shipments = response.body.data
      _.each(shipments, shipment => {
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
      return _.filter(order.included, { type: 'payment_methods' })
    })
  })
})

Cypress.Commands.add('get_billing_info_validation_rules', options => {
  cy.get_access_token().then(accessToken => {
    cy.request({
      url: Cypress.env('API_BASE_URL') + '/api/billing_info_validation_rules',
      method: 'GET',
      headers: apiRequestHeaders(accessToken)
    }).its('body')
  })
})

Cypress.Commands.add('delete_billing_info_validation_rules', options => {
  cy.get_billing_info_validation_rules().then(response => {
    _.each(response.data, resource => {
      cy.get_access_token().then(accessToken => {
        cy.request({
          url:
            Cypress.env('API_BASE_URL') +
            '/api/billing_info_validation_rules/' +
            resource.id,
          method: 'DELETE',
          headers: apiRequestHeaders(accessToken)
        })
      })
    })
  })
})

Cypress.Commands.add('create_billing_info_validation_rule', options => {
  cy.get_access_token().then(accessToken => {
    cy.request({
      url: Cypress.env('API_BASE_URL') + '/api/billing_info_validation_rules',
      method: 'POST',
      body: {
        data: {
          type: 'billing_info_validation_rules',
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

Cypress.Commands.add('create_customer_address', options => {
  cy.create_address({ attributes: options.addressAttrbutes }).then(address => {
    cy.request({
      url: Cypress.env('API_BASE_URL') + '/api/customer_addresses',
      method: 'POST',
      body: {
        data: {
          type: 'customer_addresses',
          relationships: {
            address: {
              data: {
                type: 'addresses',
                id: address.id
              }
            }
          }
        }
      },
      headers: apiRequestHeaders(options.accessToken)
    }).its('body.data')
  })
})

Cypress.Commands.add('setup_payment_step', () => {
  cy.delete_billing_info_validation_rules()

  cy.create_order({
    market_id: Cypress.env('EU_MARKET_ID')
  }).then(order => {
    cy.update_stock_item({
      stock_item_id: Cypress.env('EU_STOCK_ITEM_ID'),
      quantity: 10
    })

    cy.create_sku_line_item({
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
    })

    cy.then(() => {
      return order
    })
  })
})

Cypress.Commands.add('apply_gift_card_or_coupon_code', options => {
  cy.get('#gift-card-or-coupon-code')
    .clear()
    .type(options.code)

  cy.wrap('.coupon')
    .get('i[role=button]')
    .click()
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
  cy.get('iframe#braintree-hosted-field-number').should(
    $iframe =>
      expect($iframe.contents().find('input[name=credit-card-number]')).to.exist
  )
  cy.get('iframe#braintree-hosted-field-expirationDate').should(
    $iframe =>
      expect($iframe.contents().find('input[name=expiration]')).to.exist
  )
  cy.get('iframe#braintree-hosted-field-cvv').should(
    $iframe => expect($iframe.contents().find('input[name=cvv]')).to.exist
  )
})

Cypress.Commands.add('enter_braintree_card', options => {
  cy.get('iframe#braintree-hosted-field-number')
    .iframe()
    .find('input[name=credit-card-number]')
    .type(options.card_number)

  cy.get('iframe#braintree-hosted-field-expirationDate')
    .iframe()
    .find('input[name=expiration]')
    .type(options.exp_date)

  cy.get('iframe#braintree-hosted-field-cvv')
    .iframe()
    .find('input[name=cvv]')
    .type(options.cvc)
})

Cypress.Commands.add('check_braintree_challenge_frame', () => {
  cy.get('iframe#Cardinal-CCA-IFrame')
})

Cypress.Commands.add('authorize_braintree_challenge_frame', () => {
  cy.get('iframe#Cardinal-CCA-IFrame')
    .iframe()
    // .find('iframe#authWindow')
    // .iframe()
    .find('input[name=challengeDataEntry]')
    .type('1234')

  cy.get('iframe#Cardinal-CCA-IFrame')
    .iframe()
    // .find('iframe#authWindow')
    // .iframe()
    .find('input[value=SUBMIT]')
    .click()

  cy.wait(5000) // better way?
})

Cypress.Commands.add('check_braintree_challenge_frame_cancel', () => {
  cy.get('iframe#Cardinal-CCA-IFrame')
    .iframe()
    .find('iframe#authWindow')
    .iframe()
    .contains('Exit')
})

Cypress.Commands.add('check_adyen_card_component', () => {
  cy.get('iframe.js-iframe').should(
    $iframe => expect($iframe.contents().find('#encryptedCardNumber')).to.exist
  )
})

Cypress.Commands.add('enter_adyen_card', options => {
  cy.get('iframe.js-iframe')
    .eq(0)
    .iframe()
    .find('#encryptedCardNumber')
    .type(options.card_number)

  cy.get('iframe.js-iframe')
    .eq(1)
    .iframe()
    .find('#encryptedExpiryDate')
    .type(options.exp_date)

  cy.get('iframe.js-iframe')
    .eq(2)
    .iframe()
    .find('#encryptedSecurityCode')
    .type(options.cvc)
})

Cypress.Commands.add('check_adyen_challenge_frame', () => {
  cy.get('iframe.adyen-checkout__iframe')
})

Cypress.Commands.add('authorize_adyen_challenge_frame', () => {
  cy.get('iframe.adyen-checkout__iframe')
    .iframe()
    .find('input[name=answer]')
    .type('password')

  cy.get('iframe.adyen-checkout__iframe')
    .iframe()
    .find('input[value=Submit]')
    .click()

  cy.wait(5000) // better way?
})

Cypress.Commands.add('place_order', () => {
  cy.get('#payment-step-submit').click()
  cy.wait(5000) // better way?
})

Cypress.Commands.add('check_order_confirmation_page', orderId => {
  cy.location().should(loc => {
    expect(loc.pathname).to.eq(`/${orderId}/confirmation`)
  })
})

Cypress.Commands.add('check_out_of_stock_message', () => {
  cy.contains('Some items have gone out of stock')
})

Cypress.Commands.add('check_card_declined_message', () => {
  cy.contains('Your card was declined')
})
