describe('Customer step', () => {
  var currentOrderId

  beforeEach(() => {
    cy.create_order_with_line_item({
      market_number: '2',
      sku_code: 'HATBSBMUFFFFFF000000XXXX'
    }).then(orderId => {
      currentOrderId = orderId
      cy.visit(`${Cypress.env('BASE_URL')}/${orderId}`)
    })
  })

  it('lets the customer add their email address', () => {
    cy.get('#customer-email').type('filippo@example.com')
    cy.get('#customer-step-submit').should('be.disabled')
  })

  context('when I fill in a valid customer email', () => {
    beforeEach(() => {
      cy.fill_in_customer_email({
        customer_email: 'filippo@example.com'
      })
    })

    it('updates the order customer email on blur', () => {
      cy.get_order({
        market_number: '2',
        order_id: currentOrderId
      }).then(response => {
        expect(response.data.attributes.customer_email).to.equal(
          'filippo@example.com'
        )
      })
    })

    it('lets the customer add their billing address', () => {
      cy.get('#billing-address-first-name').type('Filippo')
      cy.get('#customer-step-submit').should('be.disabled')

      cy.get('#billing-address-last-name').type('Conforti')
      cy.get('#customer-step-submit').should('be.disabled')

      cy.get('#billing-address-line-1').type('123 5th Avenue')
      cy.get('#customer-step-submit').should('be.disabled')

      cy.get('#billing-address-city').type('New York')
      cy.get('#customer-step-submit').should('be.disabled')

      cy.get('#billing-address-country-code').type('united')
      cy.contains('United States').click()
      cy.get('#customer-step-submit').should('be.disabled')

      cy.get('#billing-address-state-code').type('NY')
      cy.get('#customer-step-submit').should('be.disabled')

      cy.get('#billing-address-zip-code').type('10001')
      cy.get('#customer-step-submit').should('be.disabled')

      cy.get('#billing-address-phone').type('212 1234567890')
      cy.get('#customer-step-submit').should('not.be.disabled')
    })
  })

  context('when I fill in a valid customer email and billing address', () => {
    beforeEach(() => {
      cy.fill_in_customer_email({
        customer_email: 'filippo@example.com'
      })
      cy.fill_in_address({
        type: 'billing',
        first_name: 'Filippo',
        last_name: 'Conforti',
        line_1: '123 5th Avenue',
        city: 'New York',
        country: 'United States',
        state_code: 'NY',
        zip_code: '10001',
        phone: '212 1234567890'
      })
    })

    context(
      'when I submit the customer step (shipping address same as billing)',
      () => {
        beforeEach(() => {
          cy.submit_customer_step()
        })

        it('displays the customer billing address summary', () => {
          cy.get('.billing-address-summary').contains('Filippo Conforti')
          cy.get('.billing-address-summary').contains('123 5th Avenue')
          cy.get('.billing-address-summary').contains('10001 New York (NY)')
          cy.get('.billing-address-summary').contains('United States')
          cy.get('.billing-address-summary').contains('212 1234567890')
        })

        it('displays the customer shipping address summary (same as billing)', () => {
          cy.get('.shipping-address-summary').contains('Filippo Conforti')
          cy.get('.shipping-address-summary').contains('123 5th Avenue')
          cy.get('.shipping-address-summary').contains('10001 New York (NY)')
          cy.get('.shipping-address-summary').contains('United States')
          cy.get('.shipping-address-summary').contains('212 1234567890')
        })
      }
    )

    context('when I check the ship to different address checkbox', () => {
      beforeEach(() => {
        cy.ship_to_different_address()
      })

      it('lets the customer add their shipping address', () => {
        cy.get('#shipping-address-first-name').type('Filippo')
        cy.get('#customer-step-submit').should('be.disabled')

        cy.get('#shipping-address-last-name').type('Conforti')
        cy.get('#customer-step-submit').should('be.disabled')

        cy.get('#shipping-address-line-1').type('321 6th Avenue')
        cy.get('#customer-step-submit').should('be.disabled')

        cy.get('#shipping-address-city').type('New York')
        cy.get('#customer-step-submit').should('be.disabled')

        cy.get('#shipping-address-country-code').type('united')
        cy.contains('United States').click()
        cy.get('#customer-step-submit').should('be.disabled')

        cy.get('#shipping-address-state-code').type('NY')
        cy.get('#customer-step-submit').should('be.disabled')

        cy.get('#shipping-address-zip-code').type('10001')
        cy.get('#customer-step-submit').should('be.disabled')

        cy.get('#shipping-address-phone').type('212 0987654321')
        cy.get('#customer-step-submit').should('not.be.disabled')
      })
    })

    context(
      'when I submit the customer step (different shipping address)',
      () => {
        beforeEach(() => {
          cy.ship_to_different_address()
          cy.fill_in_address({
            type: 'shipping',
            first_name: 'Filippo',
            last_name: 'Conforti',
            line_1: '321 6th Avenue',
            city: 'New York',
            country: 'United States',
            state_code: 'NY',
            zip_code: '10001',
            phone: '212 0987654321'
          })
          cy.submit_customer_step()
        })

        it('displays the customer billing address summary', () => {
          cy.get('.billing-address-summary').contains('Filippo Conforti')
          cy.get('.billing-address-summary').contains('123 5th Avenue')
          cy.get('.billing-address-summary').contains('10001 New York (NY)')
          cy.get('.billing-address-summary').contains('United States')
          cy.get('.billing-address-summary').contains('212 1234567890')
        })

        it('displays the customer shipping address summary (different from billing)', () => {
          cy.get('.shipping-address-summary').contains('Filippo Conforti')
          cy.get('.shipping-address-summary').contains('321 6th Avenue')
          cy.get('.shipping-address-summary').contains('10001 New York (NY)')
          cy.get('.shipping-address-summary').contains('United States')
          cy.get('.shipping-address-summary').contains('212 0987654321')
        })
      }
    )
  })
})
