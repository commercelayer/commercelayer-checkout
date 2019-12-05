import { euAddress } from '../../support/utils'

describe('[02.1] delivery / one shipment', () => {
  before(() => {
    cy.delete_billing_info_validation_rules()

    cy.create_order({
      market_id: Cypress.env('EU_MARKET_ID')
    }).then(order => {
      cy.update_price({
        price_id: Cypress.env('EU_PRICE_ID'),
        amount_cents: 2500
      })

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
        cy.visit(`${Cypress.env('BASE_URL')}/${order.id}`)
      })
    })
  })

  it('displays one shipment', () => {
    cy.get('.shipment').should('have.length', 1)
  })

  it('displays the shipment available shipping methods', () => {
    cy.get('.shipment')
      .find('.available-shipping-method')
      .should('have.length', 2)
  })

  it('displays the delivery step submit button as disabled', () => {
    cy.get('#delivery-step-submit').should('be.disabled')
  })

  context('when I select the first available shipping method', () => {
    before(() => {
      cy.get('.shipment')
        .find('.available-shipping-method input')
        .first()
        .click({ force: true })
    })

    it('displays the first available shipping method radio button as checked', () => {
      cy.get('.shipment')
        .find('.available-shipping-method input')
        .first()
        .should('be.checked')
    })

    it('updates the order summary shipping amount', () => {
      cy.get('#order-summary-shipping-amount').should('contain', '€7,00')
    })

    it('updates the order summary total amount', () => {
      cy.get('#order-summary-total-amount').should('contain', '€32,00')
    })

    it('enables the delivery step submit button', () => {
      cy.get('#delivery-step-submit').should('not.be.disabled')
    })

    context('when I select the other available shipping method', () => {
      before(() => {
        cy.get('.shipment')
          .find('.available-shipping-method input')
          .last()
          .click({ force: true })
      })

      it('displays the other available shipping method radio button as checked', () => {
        cy.get('.shipment')
          .find('.available-shipping-method input')
          .last()
          .should('be.checked')
      })

      it('updates the order summary shipping amount', () => {
        cy.get('#order-summary-shipping-amount').should('contain', '€12,00')
      })

      it('updates the order summary total amount', () => {
        cy.get('#order-summary-total-amount').should('contain', '€37,00')
      })

      it('enables the delivery step submit button', () => {
        cy.get('#delivery-step-submit').should('not.be.disabled')
      })

      it('displays the shipment summary', () => {
        cy.get('.shipment-summary').should('contain', 'Express Delivery')
      })
    })
  })
})
