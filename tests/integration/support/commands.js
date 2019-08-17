Cypress.Commands.add('get_access_token', options => {
  if (options.access_token) return options.access_token
  cy.request({
    url: Cypress.env('API_BASE_URL') + '/oauth/token',
    method: 'POST',
    body: {
      grant_type: 'client_credentials',
      client_id: Cypress.env('API_CLIENT_ID'),
      scope: 'market:' + options.market_number
    },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(response => {
    return response.body.access_token
  })
})

Cypress.Commands.add('create_order', options => {
  cy.get_access_token(options).then(accessToken => {
    cy.request({
      url: Cypress.env('API_BASE_URL') + '/api/orders',
      method: 'POST',
      body: {
        data: {
          type: 'orders'
        }
      },
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        Authorization: 'Bearer ' + accessToken
      }
    }).then(response => {
      return response.body.data.id
    })
  })
})

Cypress.Commands.add('create_order_with_line_item', options => {
  cy.get_access_token(options).then(accessToken => {
    options.access_token = accessToken
    cy.create_order(options).then(orderId => {
      cy.request({
        url: Cypress.env('API_BASE_URL') + '/api/line_items',
        method: 'POST',
        body: {
          data: {
            type: 'line_items',
            attributes: {
              sku_code: options.sku_code,
              quantity: 1
            },
            relationships: {
              order: {
                data: {
                  type: 'orders',
                  id: orderId
                }
              }
            }
          }
        },
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          Authorization: 'Bearer ' + accessToken
        }
      }).then(() => {
        return orderId
      })
    })
  })
})

Cypress.Commands.add('get_order', options => {
  cy.get_access_token(options).then(accessToken => {
    cy.request({
      url: Cypress.env('API_BASE_URL') + '/api/orders/' + options.order_id,
      method: 'GET',
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        Authorization: 'Bearer ' + accessToken
      }
    }).then(response => {
      return JSON.parse(response.body)
    })
  })
})

Cypress.Commands.add('fill_in_customer_email', options => {
  cy.server()
  cy.route('PATCH', '/api/orders/*').as('patchOrder')
  cy.get('#customer-email')
    .type(options.customer_email)
    .blur()
  cy.wait('@patchOrder')
})

Cypress.Commands.add('fill_in_address', options => {
  cy.get(`#${options.type}-address-first-name`).type(options.first_name)
  cy.get(`#${options.type}-address-last-name`).type(options.last_name)
  cy.get(`#${options.type}-address-line-1`).type(options.line_1)
  cy.get(`#${options.type}-address-city`).type(options.city)
  cy.get(`#${options.type}-address-country-code`).type(options.country)
  cy.contains(options.country).click()
  cy.get(`#${options.type}-address-state-code`).type(options.state_code)
  cy.get(`#${options.type}-address-zip-code`).type(options.zip_code)
  cy.get(`#${options.type}-address-phone`).type(options.phone)
})

Cypress.Commands.add('ship_to_different_address', options => {
  cy.get('#ship-to-different-address-checkbox').click({ force: true })
})
