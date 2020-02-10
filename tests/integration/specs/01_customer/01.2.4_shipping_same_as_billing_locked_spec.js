import { euAddress } from '../../support/utils'

describe('[01.2.4] customer / shipping same as billing (locked)', () => {
  var orderId

  before(() => {
    cy.delete_billing_info_validation_rules()

    cy.create_order({
      market_id: Cypress.env('EU_MARKET_ID'),
      shipping_country_code_lock: euAddress.country_code
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

      cy.visit(`${Cypress.env('BASE_URL')}/${orderId}`)
    })
  })

  it('displays the billing address country code (selected and enabled)', () => {
    cy.get('#billing-address-country-code').should('not.be.disabled')
    cy.get('#billing-address-country-code').should(
      'have.value',
      euAddress.country
    )
  })
})
