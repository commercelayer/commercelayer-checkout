describe('Delivery step', () => {
  before(() => {
    cy.create_order_with_line_item({
      market_number: '2',
      sku_code: 'HATBSBMUFFFFFF000000XXXX'
    }).then(orderId => {
      cy.visit(`${Cypress.env('BASE_URL')}/${orderId}`)
    })

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

    cy.submit_customer_step()
  })

  it('displays one shipment', () => {
    cy.get('.shipment').should('have.length', 1)
  })

  it('displays the shipment available shipping methods', () => {
    cy.get('.shipment')
      .find('.available-shipping-method')
      .should('have.length', 2)
  })

  it('displays the delivery step submit button as disabled', () => {
    cy.get('#delivery-step-submit').should('be.disabled')
  })

  context('when I select the first available shipping method', () => {
    beforeEach(() => {
      cy.get('.shipment')
        .find('.available-shipping-method input')
        .first()
        .click({ force: true })
    })

    it('displays the first available shipping method radio button as checked', () => {
      cy.get('.shipment')
        .find('.available-shipping-method input')
        .first()
        .should('be.checked')
    })

    it('updates the order summary shipping amount', () => {
      cy.get('#order-summary-shipping-amount').should('contain', '$9.00')
    })

    it('updates the order summary total amount', () => {
      cy.get('#order-summary-total-amount').should('contain', '$39.00')
    })

    it('enables the delivery step submit button', () => {
      cy.get('#delivery-step-submit').should('not.be.disabled')
    })

    context('when I select the other available shipping method', () => {
      beforeEach(() => {
        cy.server()
        cy.route('PATCH', '/api/shipments/*').as('patchShipment')

        cy.get('.shipment')
          .find('.available-shipping-method input')
          .last()
          .click({ force: true })
        cy.wait('@patchShipment')
      })

      it('displays the last available shipping method radio button as checked', () => {
        cy.get('.shipment')
          .find('.available-shipping-method input')
          .last()
          .should('be.checked')
      })

      it('updates the order summary shipping amount', () => {
        cy.get('#order-summary-shipping-amount').should('contain', '$17.00')
      })

      it('updates the order summary total amount', () => {
        cy.get('#order-summary-total-amount').should('contain', '$47.00')
      })

      it('enables the delivery step submit button', () => {
        cy.get('#delivery-step-submit').should('not.be.disabled')
      })
    })

    context('when I submit the delivery step', () => {
      beforeEach(() => {
        cy.submit_delivery_step()
      })

      it('displays the shipment summary', () => {
        cy.get('.shipment-summary').should('contain', 'Standard Delivery')
      })
    })
  })
})
