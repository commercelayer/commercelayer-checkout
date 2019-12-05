describe('[01.1] customer / customer email', () => {
  var orderId

  before(() => {
    cy.create_order({
      market_id: Cypress.env('EU_MARKET_ID')
    }).then(order => {
      orderId = order.id

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

  it('lets the customer add their email address', () => {
    cy.get('#customer-email').type('filippo@example.com')
    cy.get('#customer-step-submit').should('be.disabled')
  })

  context('when I fill in a valid customer email', () => {
    before(() => {
      cy.get('#customer-email')
        .clear()
        .type('filippo@example.com')
        .blur()
    })

    it('updates the order customer email on blur', () => {
      cy.get_order({
        order_id: orderId
      }).then(order => {
        expect(order.data.attributes.customer_email).to.equal(
          'filippo@example.com'
        )
      })
    })

    it('keeps the submit button as disabled', () => {
      cy.get('#customer-step-submit').should('be.disabled')
    })
  })
})
