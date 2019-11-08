describe('[03.1] payment / wire transfer', () => {
  var orderId

  before(() => {
    cy.setup_payment_step().then(order => {
      orderId = order.id
    })
  })

  context('if wire transfer is an available payment method', () => {
    before(() => {
      cy.check_payment_method({
        order_id: orderId,
        payment_source_type: 'wire_transfers'
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
          cy.place_order()
        })

        it('displays the order confirmation page', () => {
          cy.check_order_confirmation_page(orderId)
        })
      })
    })
  })
})
