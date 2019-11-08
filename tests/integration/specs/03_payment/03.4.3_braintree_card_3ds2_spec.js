describe('[03.4.3] payment / braintree card (3ds2)', () => {
  var orderId

  before(() => {
    cy.update_price({
      price_id: Cypress.env('EU_PRICE_ID'),
      amount_cents: 5000
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
            card_number: '4000000000001091',
            exp_date: '0122',
            cvc: '123'
          })
        })

        context('when the customer places the order', () => {
          before(() => {
            cy.place_order()
          })

          it('presents the customer with a challenge frame', () => {
            cy.check_braintree_challenge_frame()
          })

          context('when the customer authorizes the challege', () => {
            before(() => {
              cy.authorize_braintree_challenge_frame()
            })

            it('displays the order confirmation page', () => {
              cy.check_order_confirmation_page(orderId)
            })
          })
        })
      })
    })
  })
})
