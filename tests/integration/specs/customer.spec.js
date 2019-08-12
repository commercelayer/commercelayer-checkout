describe('Customer step', () => {
  context('with empty billing address', () => {
    beforeEach(() => {
      cy.visit('https://checkout.commercelayer.dev/lNVlXhyLPx')
    })

    it('lets the customer add their billing address', () => {
      cy.get('#billing-address-first-name').type('Filippo')
      cy.get('#billing-address-last-name').type('Conforti')
      cy.get('#billing-address-line_1').type('123 5th Avenue')
      cy.get('#billing-address-city').type('New York')

      cy.get('#billing-address-country-code').type('united')
      cy.contains('United States').click()

      cy.get('#billing-address-state-code').type('NY')
      cy.get('#billing-address-zip-code').type('10001')
      cy.get('#billing-address-phone').type('212 1234567890')

      cy.get('#customer-step-submit').click()
    })
  })
})
