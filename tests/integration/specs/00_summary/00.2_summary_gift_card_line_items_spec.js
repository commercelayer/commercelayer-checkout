describe('[00.2] summary / Gift card line items', () => {
  before(() => {
    cy.create_order({
      market_id: Cypress.env('EU_MARKET_ID')
    }).then(order => {
      cy.create_gift_card({
        attributes: {
          currency_code: 'EUR',
          balance_cents: 10000
        }
      }).then(giftCard => {
        cy.create_line_item({
          order_id: order.id,
          item_type: 'gift_cards',
          item_id: giftCard.id,
          quantity: 1
        })

        cy.visit(`${Cypress.env('BASE_URL')}/${order.id}`)
      })
    })
  })

  it('displays the gift card line item', () => {
    cy.get('.line-items').find('.line-item')
  })
})
