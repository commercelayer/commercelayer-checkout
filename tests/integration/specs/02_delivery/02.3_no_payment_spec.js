import { euAddress } from '../../support/utils'

describe('[02.3] delivery / no payment', () => {
  var orderId

  before(() => {
    cy.delete_billing_info_validation_rules()

    cy.create_order({
      market_id: Cypress.env('EU_MARKET_ID')
    }).then(order => {
      orderId = order.id
      cy.update_price({
        price_id: Cypress.env('EU_PRICE_ID'),
        amount_cents: 2500
      })

      cy.update_stock_item({
        stock_item_id: Cypress.env('EU_STOCK_ITEM_ID'),
        quantity: 10
      })

      cy.create_sku_line_item({
        order_id: order.id,
        sku_code: Cypress.env('SKU_CODE'),
        quantity: 1
      })

      cy.create_address({
        attributes: {
          first_name: euAddress.first_name,
          last_name: euAddress.last_name,
          line_1: euAddress.line_1,
          city: euAddress.city,
          country_code: euAddress.country_code,
          state_code: euAddress.state_code,
          zip_code: euAddress.zip_code,
          phone: euAddress.phone
        }
      }).then(address => {
        cy.update_order({
          order_id: order.id,
          attributes: {
            customer_email: 'filippo@example.com',
            _shipping_address_same_as_billing: 1
          },
          relationships: {
            billing_address: {
              data: {
                type: 'addresses',
                id: address.id
              }
            }
          }
        })

        cy.create_gift_card({
          attributes: {
            currency_code: 'EUR',
            balance_cents: 5000
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
  })

  it('displays the place order button', () => {
    cy.get('#delivery-step-submit').contains('place order')
  })

  context('when I select the first available shipping method', () => {
    before(() => {
      cy.get('.shipment')
        .find('.available-shipping-method input')
        .first()
        .click({ force: true })
    })

    context('when the customer places the order', () => {
      before(() => {
        cy.get('#delivery-step-submit').click()
      })

      it('displays the order confirmation page', () => {
        cy.check_order_confirmation_page(orderId)
      })
    })
  })
})
