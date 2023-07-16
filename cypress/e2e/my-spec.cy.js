/// <reference types="Cypress"/>

//Element locators
const NAME_INPUT = 'input[placeholder=Name]'
const PHONE_INPUT = 'input[placeholder=Phone]'
const EMAIL_INPUT = 'input[placeholder=Email]'
const ADD_BUTTON = 'button[name=add]'
const EDIT_BUTTON = 'button[name=edit]'
const DELETE_BUTTON = 'button[name=delete]'
const TABLE_ROW = 'table tbody tr'

//Test data
const VALID_NAME = 'Michael Angelo'
const VALID_PHONE = '345-678-9090'
const VALID_EMAIL = 'michael.angelo@outlook.com'

//Helper functions
const enterName = text => cy.get(NAME_INPUT).type(text)
const enterPhoneNumber = text => cy.get(PHONE_INPUT).type(text)
const enterEmail = text => cy.get(EMAIL_INPUT).type(text)
const clickAdd = () => cy.get(ADD_BUTTON).click()
const clickEdit = () => cy.get(EDIT_BUTTON).click()
const clickDelete = () => cy.get(DELETE_BUTTON).click()

const validateNameByRowIndex = (rowIndex, value) => {
  cy.get(TABLE_ROW).eq(rowIndex)
    .get('td').eq(0).should($td => {
      expect($td.text()).to.eq(value)
    })
}

const validatePhoneByRowIndex = (rowIndex, value) => {
  cy.get(TABLE_ROW).eq(rowIndex)
    .get('td').eq(1).should($td => {
      expect($td.text()).to.eq(value)
    })
}

const validateEmailByRowIndex = (rowIndex, value) => {
  cy.get(TABLE_ROW).eq(rowIndex)
    .get('td').eq(2).should($td => {
      expect($td.text()).to.eq(value)
    })
}

const createValidEntry = () => {
  createValidEntryWithFields(VALID_NAME, VALID_PHONE, VALID_EMAIL)
}

const createValidEntryWithFields = (name, phone, email) => {
  enterName(name)
  enterPhoneNumber(phone)
  enterEmail(email)
  clickAdd()
}


describe('Test Contact App', () => {

  beforeEach(() => {
    cy.visit('./contact_app.html')
  })

  it('Test if the application loads correctly', () => {
    cy.get('h1.text-center').should('have.text', 'Contact List App');
    cy.get(TABLE_ROW).should('have.length', 1)
  })

  // Add tests here

  //Create entry
  context('Test create a new entry', () => {

    it('Test adding entry with valid name, phone and email', () => {
      cy.get(TABLE_ROW).should($tr => {
        return $tr.length
      }).then((rows) => {
        createValidEntry()
        cy.get(TABLE_ROW).should('have.length', rows.length + 1)
        validateNameByRowIndex(1, VALID_NAME)
        validatePhoneByRowIndex(1, VALID_PHONE)
        validateEmailByRowIndex(1, VALID_EMAIL)
      })

    })

    it('Test form resets after valid entry is added', () => {
      createValidEntry()
      cy.get(NAME_INPUT).should($input => { expect($input.val()).to.eq('') })
      cy.get(PHONE_INPUT).should($input => { expect($input.val()).to.eq('') })
      cy.get(EMAIL_INPUT).should($input => { expect($input.val()).to.eq('') })
    })

    it('Should not accept duplicated entries', () => {
      createValidEntry()
      createValidEntry()
      cy.get(`td:contains(${VALID_EMAIL})`).should('have.length', 1)

    })

    it('Should not accept empty entries', () => {
      cy.get(TABLE_ROW).should($tr => {
        return $tr
      }).then((rows) => {
        clickAdd()
        cy.get(TABLE_ROW).should('have.length', rows.length)
      })

    })

  })

  //Edit entry
  context('Test edit an existing entry', () => {
    it('Test edit entry NAME only and keep the other fields', () => {
      createValidEntry()
      clickEdit()
      let newName = 'Raphael'
      cy.get(TABLE_ROW).find('input').eq(0).clear().type(newName)
      cy.get(TABLE_ROW).find('button').click()
      validateNameByRowIndex(1, newName)
      validatePhoneByRowIndex(1, VALID_PHONE)
      validateEmailByRowIndex(1, VALID_EMAIL)
    })

    it('Test edit entry PHONE only and keep the other fields', () => {
      createValidEntry()
      clickEdit()
      let newPhone = '123-456-7899'
      cy.get(TABLE_ROW).find('input').eq(1).clear().type(newPhone)
      cy.get(TABLE_ROW).find('button').click()
      validateNameByRowIndex(1, VALID_NAME)
      validatePhoneByRowIndex(1, newPhone)
      validateEmailByRowIndex(1, VALID_EMAIL)
    })

    it('Test edit entry EMAIL only and keep the other fields', () => {
      createValidEntry()
      clickEdit()
      let newEmail = 'angelo@gmail.com'
      cy.get(TABLE_ROW).find('input').eq(2).clear().type(newEmail)
      cy.get(TABLE_ROW).find('button').click()
      validateNameByRowIndex(1, VALID_NAME)
      validatePhoneByRowIndex(1, VALID_PHONE)
      validateEmailByRowIndex(1, newEmail)
    })

    it('Test edit all fields', () => {
      createValidEntry()
      clickEdit()
      let newName = 'Raphael'
      let newPhone = '123-456-7899'
      let newEmail = 'angelo@gmail.com'
      cy.get(TABLE_ROW).find('input').eq(0).clear().type(newName)
      cy.get(TABLE_ROW).find('input').eq(1).clear().type(newPhone)
      cy.get(TABLE_ROW).find('input').eq(2).clear().type(newEmail)
      cy.get(TABLE_ROW).find('button').click()
      validateNameByRowIndex(1, newName)
      validatePhoneByRowIndex(1, newPhone)
      validateEmailByRowIndex(1, newEmail)
    })

    it('Test press edit button and save without making any changes', () => {
      createValidEntry()
      clickEdit()
      cy.get(TABLE_ROW).find('button').click()
      validateNameByRowIndex(1, VALID_NAME)
      validatePhoneByRowIndex(1, VALID_PHONE)
      validateEmailByRowIndex(1, VALID_EMAIL)
    })

  })


  //Delete entry

  context('Test delete existing entries', () => {

    it('Delete first and only entry', () => {
      createValidEntry()
      cy.get(TABLE_ROW).should($tr => {
        return $tr
      }).then((rows) => {
        cy.get(TABLE_ROW).eq(1).find(DELETE_BUTTON).click()
        cy.get(TABLE_ROW).should('have.length', rows.length - 1)
        cy.get(`td:contains(${VALID_NAME})`).should('not.exist')
        cy.get(`td:contains(${VALID_PHONE})`).should('not.exist')
        cy.get(`td:contains(${VALID_EMAIL})`).should('not.exist')
      })

    })

    it('Delete first entry when there are more entries', () => {
      createValidEntry()
      let newUser = {
        name: 'Barbara Garcia',
        phone: '613-342-3344',
        email: 'b.garcia@gmail.com'
      }
      createValidEntryWithFields(newUser.name, newUser.phone, newUser.email)
      cy.get(TABLE_ROW).should($tr => {
        return $tr
      }).then((rows) => {
        cy.get(TABLE_ROW).eq(1).find(DELETE_BUTTON).click()
        cy.get(TABLE_ROW).should('have.length', rows.length - 1)
        cy.get('td').contains(VALID_NAME).should('not.exist')
        cy.get('td').contains(VALID_PHONE).should('not.exist')
        cy.get('td').contains(VALID_EMAIL).should('not.exist')
        cy.get('td').contains(newUser.name).should('exist')
        cy.get('td').contains(newUser.phone).should('exist')
        cy.get('td').contains(newUser.email).should('exist')
      })
     


    })
  })

});