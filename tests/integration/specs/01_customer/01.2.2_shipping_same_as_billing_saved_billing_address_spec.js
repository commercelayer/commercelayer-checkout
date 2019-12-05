import { euAddress } from '../../support/utils'

describe('[01.2.2] customer / shipping same as billing (saved billing address)', () => {
  before(() => {
    cy.delete_billing_info_validation_rules()
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

      cy.update_order({
        order_id: order.id,
        attributes: {
          customer_email: 'filippo@example.com',
          customer_password: 'secret'
        }
      })

      cy.get_customer_access_token({
        username: 'filippo@example.com',
        password: 'secret'
      }).then(credentials => {
        cy.create_customer_address({
          accessToken: credentials.access_token,
          addressAttrbutes: {
            first_name: euAddress.first_name,
            last_name: euAddress.last_name,
            line_1: euAddress.line_1,
            city: euAddress.city,
            country_code: euAddress.country_code,
            state_code: euAddress.state_code,
            zip_code: euAddress.zip_code,
            phone: euAddress.phone
          }
        })

        cy.visit(
          `${Cypress.env('BASE_URL')}/${order.id}?access_token=${
            credentials.access_token
          }`
        )
      })
    })
  })

  context('with a customer address', () => {
    before(() => {})
    it('works', () => {
      console.log('works')
    })
  })
})
