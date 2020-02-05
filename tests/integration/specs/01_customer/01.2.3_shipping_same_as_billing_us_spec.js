import { usAddress } from '../../support/utils'

describe('[01.2.3] customer / shipping same as billing (US)', () => {
  before(() => {
    cy.delete_billing_info_validation_rules()

    cy.create_order({
      market_id: Cypress.env('EU_MARKET_ID')
    }).then(order => {
      cy.update_stock_item({
        stock_item_id: Cypress.env('EU_STOCK_ITEM_ID'),
        quantity: 1
      })

      cy.create_sku_line_item({
        order_id: order.id,
        sku_code: Cypress.env('SKU_CODE'),
        quantity: 1
      })

      cy.update_order({
        order_id: order.id,
        attributes: {
          customer_email: 'filippo@example.com'
        }
      })

      cy.visit(`${Cypress.env('BASE_URL')}/${order.id}`)
    })
  })

  it('lets the customer add their billing address', () => {
    cy.get('#billing-address-first-name').type(usAddress.first_name)
    cy.get('#customer-step-submit').should('be.disabled')

    cy.get('#billing-address-last-name').type(usAddress.last_name)
    cy.get('#customer-step-submit').should('be.disabled')

    cy.get('#billing-address-line-1').type(usAddress.line_1)
    cy.get('#customer-step-submit').should('be.disabled')

    cy.get('#billing-address-city').type(usAddress.city)
    cy.get('#customer-step-submit').should('be.disabled')

    cy.get('#billing-address-country-code').type(usAddress.country)
    cy.contains(usAddress.country).click()
    cy.get('#customer-step-submit').should('be.disabled')

    cy.get('#billing-address-state-code').type(usAddress.state_code)
    cy.contains(usAddress.state_code).click()
    cy.get('#customer-step-submit').should('be.disabled')

    cy.get('#billing-address-zip-code').type(usAddress.zip_code)
    cy.get('#customer-step-submit').should('be.disabled')

    cy.get('#billing-address-phone').type(usAddress.phone)
    cy.get('#customer-step-submit').should('not.be.disabled')
  })

  context('when I submit the customer step', () => {
    before(() => {
      cy.get('#customer-step-submit').click()
    })

    it('displays the customer billing address summary', () => {
      cy.get('.billing-address-summary').contains(
        `${usAddress.first_name} ${usAddress.last_name}`
      )
      cy.get('.billing-address-summary').contains(usAddress.line_1)
      cy.get('.billing-address-summary').contains(
        `${usAddress.zip_code} ${usAddress.city} (${usAddress.state_code})`
      )
      cy.get('.billing-address-summary').contains(usAddress.country)
      cy.get('.billing-address-summary').contains(usAddress.phone)
    })

    it('displays the customer shipping address summary (same as billing)', () => {
      cy.get('.shipping-address-summary').contains(
        `${usAddress.first_name} ${usAddress.last_name}`
      )
      cy.get('.shipping-address-summary').contains(usAddress.line_1)
      cy.get('.shipping-address-summary').contains(
        `${usAddress.zip_code} ${usAddress.city} (${usAddress.state_code})`
      )
      cy.get('.shipping-address-summary').contains(usAddress.country)
      cy.get('.shipping-address-summary').contains(usAddress.phone)
    })
  })
})
