describe('[03.5.1] payment / adyen card (declined)', () => {
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
            card_number: '5555444433331111',
            exp_date: '1020',
            cvc: '000'
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
