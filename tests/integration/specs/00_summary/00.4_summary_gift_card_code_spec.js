describe('[00.4] summary / Gift card code', () => {
  before(() => {
    cy.create_order({
      market_id: Cypress.env('EU_MARKET_ID')
    }).then(order => {
      cy.update_price({
        price_id: Cypress.env('EU_PRICE_ID'),
        amount_cents: 2500
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

      cy.create_gift_card({
        attributes: {
          currency_code: 'EUR',
          balance_cents: 2000
        }
      }).then(giftCard => {
        cy.purchase_gift_card({
          gift_card_id: giftCard.id
        }).then(giftCard => {
          cy.activate_gift_card({
            gift_card_id: giftCard.id
          }).then(giftCard => {
            cy.visit(`${Cypress.env('BASE_URL')}/${order.id}`)
            cy.apply_gift_card_or_coupon_code({
              code: giftCard.attributes.code
            })
          })
        })
      })
    })
  })

  it('displays the gift card amount', () => {
    cy.get('#order-summary-gift-card').contains('-€20,00')
  })

  it('hides the gift card or coupon code input field', () => {
    cy.get('#gift-card-or-coupon-code').should('not.visible')
  })
})
