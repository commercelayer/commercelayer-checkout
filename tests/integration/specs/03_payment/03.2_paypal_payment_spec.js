describe('[03.2] payment / paypal payment', () => {
  var orderId

  before(() => {
    cy.setup_payment_step().then(order => {
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

      it('displays the paypal payment message', () => {
        cy.get('#paypal-payment-hint')
      })

      context('when the customer places the order', () => {
        before(() => {
          cy.server()
          cy.route('POST', '/api/paypal_payments').as('createPaypalPayment')
          cy.wait('@createPaypalPayment').then(() => {
            cy.place_order()
          })
        })

        it('displays the paypal payment page', () => {
          cy.location().should(loc => {
            // Proceeding from here is an anti-pattern:
            // https://docs.cypress.io/guides/references/best-practices.html#Visiting-external-sites
            // Alternatives?
            expect(loc.host).to.eq('www.sandbox.paypal.com')
          })
        })
      })
    })
  })
})
