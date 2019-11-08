describe('[03.3.3] payment / stripe card (3ds2)', () => {
  var orderId

  before(() => {
    cy.setup_payment_step().then(order => {
      orderId = order.id
    })
  })

  context('if stripe payment is an available payment method', () => {
    before(() => {
      cy.check_payment_method({
        order_id: orderId,
        payment_source_type: 'stripe_payments'
      })
    })

    context('when the customer selects stripe card payment option', () => {
      before(() => {
        cy.get('#stripe-card-radio').click({ force: true })
      })

      it('displays the stripe card element', () => {
        cy.check_stripe_card_element()
      })

      context('when the customer enters a valid card', () => {
        before(() => {
          cy.enter_stripe_card({
            card_number: '4000000000003220',
            exp_date: '1223',
            cvc: '123'
          })
        })

        context('when the customer places the order', () => {
          before(() => {
            cy.place_order()
          })

          it('presents the customer with a challenge frame', () => {
            cy.check_stripe_challenge_frame()
          })
          // TODO: authorize the 3ds2 challenge
        })
      })
    })
  })
})
