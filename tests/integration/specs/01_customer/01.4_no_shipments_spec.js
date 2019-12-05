import { euAddress } from '../../support/utils'

describe('[01.4] customer / no shipments', () => {
  before(() => {
    cy.delete_billing_info_validation_rules()

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
              customer_email: 'filippo@example.com'
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
          cy.visit(`${Cypress.env('BASE_URL')}/${order.id}`)
        })
      })
    })
  })

  it('displays the continue to payment button', () => {
    cy.get('#customer-step-submit').contains('continue to payment')
  })

  it('does not display the ship to different address checkbox', () => {
    cy.get('#ship-to-different-address-checkbox').should('not.exist')
  })
})
