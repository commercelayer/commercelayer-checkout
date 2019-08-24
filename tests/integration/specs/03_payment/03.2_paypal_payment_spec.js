describe('[03.2] payment / paypal payment', () => {
  var orderId

  before(() => {
    cy.setup_payment_step().then(order => {
      cy.log(order)
      orderId = order.id
    })
  })

  context('if paypal payment is an available payment method', () => {
    before(() => {
      cy.check_payment_method({
        order_id: orderId,
        payment_source_type: 'paypal_payments'
      })
    })

    context('when the customer selects wire transfer payment option', () => {
      before(() => {
        cy.get('#paypal-payments-radio').click({ force: true })
      })

      it('displays the paypal paymìent message', () => {
        cy.get('#paypal-payment-hint')
      })

      context('when the customer places the order', () => {
        before(() => {
          cy.server()
          cy.route('POST', '/api/paypal_payments').as('createPaypalPayment')
          cy.wait('@createPaypalPayment').then(() => {
            cy.get('#payment-step-submit').click()
          })
        })

        it('displays the paypal payment page', () => {
          cy.location().should(loc => {
            expect(loc.host).to.eq('www.sandbox.paypal.com')
          })
        })
      })
    })
  })
})
