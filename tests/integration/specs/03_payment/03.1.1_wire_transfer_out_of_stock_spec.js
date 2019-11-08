describe('[03.1.1] payment / wire transfer (out of stock)', () => {
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

      context('when the customer places the order', () => {
        before(() => {
          cy.update_stock_item({
            stock_item_id: Cypress.env('EU_STOCK_ITEM_ID'),
            quantity: 0
          })

          cy.place_order()
        })

        it('displays an out of stock message', () => {
          cy.check_out_of_stock_message()
        })
      })
    })
  })
})
