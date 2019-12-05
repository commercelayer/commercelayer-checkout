import { euAddress } from '../../support/utils'

describe('[01.3] customer / ship to different address', () => {
  var orderId

  before(() => {
    cy.delete_billing_info_validation_rules()

    cy.create_order({
      market_id: Cypress.env('EU_MARKET_ID')
    }).then(order => {
      orderId = order.id

      cy.update_stock_item({
        stock_item_id: Cypress.env('EU_STOCK_ITEM_ID'),
        quantity: 1
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
          order_id: orderId,
          attributes: {
            customer_email: 'filippo@example.com'
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

        cy.visit(`${Cypress.env('BASE_URL')}/${orderId}`)
      })
    })
  })
  context('when I check the ship to different address option', () => {
    before(() => {
      cy.get('#ship-to-different-address-checkbox').click({ force: true })
    })

    it('lets the customer add their shipping address', () => {
      cy.get('#shipping-address-first-name')
        .clear()
        .type(euAddress.first_name)

      cy.get('#shipping-address-last-name')
        .clear()
        .type(euAddress.last_name)

      cy.get('#shipping-address-line-1')
        .clear()
        .type(euAddress.line_1)

      cy.get('#shipping-address-city')
        .clear()
        .type(euAddress.city)

      cy.get('#shipping-address-country-code')
        .clear()
        .type(euAddress.country)
      cy.contains(euAddress.country).click()

      cy.get('#shipping-address-state-code')
        .clear()
        .type(euAddress.state_code)

      cy.get('#shipping-address-zip-code')
        .clear()
        .type(euAddress.zip_code)

      cy.get('#shipping-address-phone')
        .clear()
        .type(euAddress.other_phone)
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

      it('displays the customer shipping address summary (different from billing)', () => {
        cy.get('.shipping-address-summary').contains(
          `${euAddress.first_name} ${euAddress.last_name}`
        )
        cy.get('.shipping-address-summary').contains(euAddress.line_1)
        cy.get('.shipping-address-summary').contains(
          `${euAddress.zip_code} ${euAddress.city} (${euAddress.state_code})`
        )
        cy.get('.shipping-address-summary').contains(euAddress.country)
        cy.get('.shipping-address-summary').contains(euAddress.other_phone)
      })
    })
  })
})
