describe('[00.1] summary / SKU line items', () => {
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

  it('displays the SKU line item', () => {
    cy.get('.line-items').find('.line-item')
  })
})
