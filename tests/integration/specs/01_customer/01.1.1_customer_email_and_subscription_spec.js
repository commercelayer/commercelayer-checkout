describe('[01.1.1] customer / customer email and subscription', () => {
  before(() => {
    cy.create_order({
      market_id: Cypress.env('EU_MARKET_ID')
    }).then(order => {
      cy.update_stock_item({
        stock_item_id: Cypress.env('EU_STOCK_ITEM_ID'),
        quantity: 1
      })

      cy.create_sku_line_item({
        order_id: order.id,
        sku_code: Cypress.env('SKU_CODE'),
        quantity: 1
      })

      cy.visit(`${Cypress.env('BASE_URL')}/${order.id}`)
    })
  })

  context('when I fill in a valid customer email', () => {
    before(() => {
      cy.get('#customer-email')
        .clear()
        .type('filippo@example.com')
        .blur()
    })

    context('when I check the customer subsciption checkbox', () => {
      before(() => {
        cy.get('#customer-subscription-checkbox').click({ force: true })
      })

      it('creates a customer subscription', () => {
        // to make a real test here we need to record and reuse the API responses
      })
    })
  })
})
