
Cypress.Commands.add('validateNumberOfRows', (num) => {
    cy.get('table tbody tr').should('have.length', num)
})

Cypress.Commands.add('verifyThatExists', (locator) => {
    cy.get(locator).should('exist')
})

Cypress.Commands.add('verifyThatNotExists', (locator) => {
    cy.get(locator).should('not.exist')
})




// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

