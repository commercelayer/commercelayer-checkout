import { euAddress } from '../../support/utils'
import _ from 'lodash'

describe('[03.1.1] payment / wire transfer', () => {
  var orderId

  before(() => {
    cy.create_order({
      market_id: Cypress.env('EU_MARKET_ID')
    }).then(order => {
      orderId = order.id
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
    })
  })

  context('if wire transfer is an available payment method', () => {
    before(() => {
      cy.get_available_payment_methods({
        order_id: orderId
      }).then(paymentMethods => {
        let wireTransferAvailable = _.find(paymentMethods, paymentMethod => {
          return (
            paymentMethod.attributes.payment_source_type === 'wire_transfers'
          )
        })
        if (!wireTransferAvailable) Cypress.stop()
      })
    })

    context('when the customer selects wire transfer payment option', () => {
      before(() => {
        cy.get('#wire-transfers-radio').click({ force: true })
      })

      it('displays the wire transfer message', () => {
        cy.get('#wire-transfer-payment-hint')
      })

      context('when the customer places the order', () => {
        before(() => {
          cy.get('#payment-step-submit').click()
        })

        it('displays the order confirmation page', () => {
          cy.location().should(loc => {
            expect(loc.pathname).to.eq(`/${orderId}/confirmation`)
          })
        })
      })
    })
  })
})
