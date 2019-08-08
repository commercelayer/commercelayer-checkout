describe('Customer step', () => {
  it('works', () => {
    cy.visit('https://checkout.commercelayer.dev/aqjobhrDNX')

    cy.get('#billing-address-first-name')
      .clear()
      .type('Filippo')
    cy.get('#billing-address-last-name')
      .clear()
      .type('Conforti')
    cy.get('#billing-address-line_1')
      .clear()
      .type('123 5th Avenue')
    cy.get('#billing-address-city')
      .clear()
      .type('New York')

    cy.get('#billing-address-country-code').click({ force: true })
    cy.contains('Austria').click()

    cy.get('#billing-address-state-code')
      .clear()
      .type('NY')
    cy.get('#billing-address-zip-code')
      .clear()
      .type('10001')
    cy.get('#billing-address-phone')
      .clear()
      .type('212 1234567890')

    cy.get('#customer-step-submit').click()
  })
})
