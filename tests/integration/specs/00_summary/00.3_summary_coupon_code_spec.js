describe('[00.3] summary / Coupon code', () => {
  before(() => {
    cy.create_order({
      market_id: Cypress.env('EU_MARKET_ID')
    }).then(order => {
      cy.update_price({
        price_id: Cypress.env('EU_PRICE_ID'),
        amount_cents: 5000
      })

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

      cy.apply_gift_card_or_coupon_code({ code: Cypress.env('COUPON_CODE') })
    })
  })

  it('displays the coupon code discount', () => {
    cy.get('#order-summary-discount-total').contains('-€25,00')
  })

  it('hides the gift card or coupon code input field', () => {
    cy.get('#gift-card-or-coupon-code').should('not.visible')
  })
})
