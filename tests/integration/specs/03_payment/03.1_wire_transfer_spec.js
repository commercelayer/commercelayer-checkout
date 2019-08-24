import _ from 'lodash'

describe('[03.1] payment / wire transfer', () => {
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
