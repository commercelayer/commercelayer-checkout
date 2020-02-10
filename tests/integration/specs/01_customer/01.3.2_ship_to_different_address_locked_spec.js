import { euAddress, usAddress } from '../../support/utils'

describe('[01.3.2] customer / ship to different address (locked)', () => {
  var orderId

  before(() => {
    cy.delete_billing_info_validation_rules()

    cy.create_order({
      market_id: Cypress.env('EU_MARKET_ID'),
      shipping_country_code_lock: usAddress.country_code
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
          order_id: orderId,
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

        cy.visit(`${Cypress.env('BASE_URL')}/${orderId}`)
      })
    })
  })

  it('displays the ship to different address checkbox (checked and disabled)', () => {
    cy.get('#ship-to-different-address-checkbox').should('be.checked')
    cy.get('#ship-to-different-address-checkbox').should('be.disabled')
  })

  it('displays the shipping address country code (selected and disabled)', () => {
    cy.get('#shipping-address-country-code').should('be.disabled')
    cy.get('#shipping-address-country-code').should(
      'have.value',
      usAddress.country
    )
  })
})
