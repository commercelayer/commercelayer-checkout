import { euAddress } from '../../support/utils'

describe('[01.2] customer / shipping same as billing', () => {
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

  it('displays the continue to delivery button', () => {
    cy.get('#customer-step-submit').contains('continue to delivery')
  })

  it('displays the ship to different address checkbox', () => {
    cy.get('#ship-to-different-address-checkbox').should('exist')
  })

  it('lets the customer add their billing address', () => {
    cy.get('#billing-address-first-name').type(euAddress.first_name)
    cy.get('#customer-step-submit').should('be.disabled')

    cy.get('#billing-address-last-name').type(euAddress.last_name)
    cy.get('#customer-step-submit').should('be.disabled')

    cy.get('#billing-address-line-1').type(euAddress.line_1)
    cy.get('#customer-step-submit').should('be.disabled')

    cy.get('#billing-address-city').type(euAddress.city)
    cy.get('#customer-step-submit').should('be.disabled')

    cy.get('#billing-address-country-code').type(euAddress.country)
    cy.contains(euAddress.country).click()
    cy.get('#customer-step-submit').should('be.disabled')

    cy.get('#billing-address-state-code').type(euAddress.state_code)
    cy.get('#customer-step-submit').should('be.disabled')

    cy.get('#billing-address-zip-code').type(euAddress.zip_code)
    cy.get('#customer-step-submit').should('be.disabled')

    cy.get('#billing-address-phone').type(euAddress.phone)
    cy.get('#customer-step-submit').should('not.be.disabled')
  })

  context('when I submit the customer step', () => {
    before(() => {
      cy.get('#customer-step-submit').click()
    })

    it('displays the customer billing address summary', () => {
      cy.get('.billing-address-summary').contains(
        `${euAddress.first_name} ${euAddress.last_name}`
      )
      cy.get('.billing-address-summary').contains(euAddress.line_1)
      cy.get('.billing-address-summary').contains(
        `${euAddress.zip_code} ${euAddress.city} (${euAddress.state_code})`
      )
      cy.get('.billing-address-summary').contains(euAddress.country)
      cy.get('.billing-address-summary').contains(euAddress.phone)
    })

    it('displays the customer shipping address summary (same as billing)', () => {
      cy.get('.shipping-address-summary').contains(
        `${euAddress.first_name} ${euAddress.last_name}`
      )
      cy.get('.shipping-address-summary').contains(euAddress.line_1)
      cy.get('.shipping-address-summary').contains(
        `${euAddress.zip_code} ${euAddress.city} (${euAddress.state_code})`
      )
      cy.get('.shipping-address-summary').contains(euAddress.country)
      cy.get('.shipping-address-summary').contains(euAddress.phone)
    })
  })
})
