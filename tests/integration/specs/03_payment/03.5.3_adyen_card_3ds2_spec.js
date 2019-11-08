describe('[03.5.3] payment / adyen card (3ds2)', () => {
  var orderId

  before(() => {
    cy.setup_payment_step().then(order => {
      orderId = order.id
    })
  })

  context('if adyen payment is an available payment method', () => {
    before(() => {
      cy.check_payment_method({
        order_id: orderId,
        payment_source_type: 'adyen_payments'
      })
    })

    context('when the customer selects adyen card payment option', () => {
      before(() => {
        cy.get('#adyen-card-radio').click({ force: true })
      })

      it('displays the adyen card component', () => {
        cy.check_adyen_card_component()
      })

      context('when the customer enters a valid card', () => {
        before(() => {
          cy.enter_adyen_card({
            card_number: '4917 6100 0000 0000',
            exp_date: '1020',
            cvc: '737'
          })
        })

        context('when the customer places the order', () => {
          before(() => {
            cy.place_order()
          })

          it('presents the customer with a challenge frame', () => {
            cy.check_adyen_challenge_frame()
          })

          context('when the customer authorizes the challege', () => {
            before(() => {
              cy.authorize_adyen_challenge_frame()
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
