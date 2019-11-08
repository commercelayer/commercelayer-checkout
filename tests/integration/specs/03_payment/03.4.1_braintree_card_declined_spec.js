describe('[03.4.1] payment / braintree card (declined)', () => {
  var orderId

  before(() => {
    cy.update_price({
      price_id: Cypress.env('EU_PRICE_ID'),
      amount_cents: 230000
    })

    cy.setup_payment_step().then(order => {
      orderId = order.id
    })
  })

  context('if braintree payment is an available payment method', () => {
    before(() => {
      cy.check_payment_method({
        order_id: orderId,
        payment_source_type: 'braintree_payments'
      })
    })

    context('when the customer selects braintree card payment option', () => {
      before(() => {
        cy.get('#braintree-card-radio').click({ force: true })
      })

      it('displays the braintree card hosted fields', () => {
        cy.check_braintree_card_hosted_fields()
      })

      context('when the customer enters a valid card', () => {
        before(() => {
          cy.enter_braintree_card({
            card_number: '4242424242424242',
            exp_date: '1223',
            cvc: '123'
          })
        })

        context('when the customer places the order', () => {
          before(() => {
            cy.place_order()
          })

          it('displays a payment error message', () => {
            cy.check_card_declined_message()
          })
        })
      })
    })
  })
})
