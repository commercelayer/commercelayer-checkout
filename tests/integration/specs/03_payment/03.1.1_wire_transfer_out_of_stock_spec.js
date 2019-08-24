import _ from 'lodash'

describe('[03.1.1] payment / wire transfer (out of stock)', () => {
  var orderId

  before(() => {
    cy.setup_payment_step().then(order => {
      cy.log(order)
      orderId = order.id
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

      context('when the customer places the order', () => {
        before(() => {
          cy.update_stock_item({
            stock_item_id: Cypress.env('EU_STOCK_ITEM_ID'),
            quantity: 0
          })

          cy.get('#payment-step-submit').click()
        })

        it('displays an out of stock message', () => {
          cy.contains('Some items have gone out of stock')
        })
      })
    })
  })
})
