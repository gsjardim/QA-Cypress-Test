/// <reference types="Cypress"/>

//Element locators
const NAME_INPUT = 'input[placeholder=Name]'
const PHONE_INPUT = 'input[placeholder=Phone]'
const EMAIL_INPUT = 'input[placeholder=Email]'
const ADD_BUTTON = 'button[name=add]'
const EDIT_BUTTON = 'button[name=edit]'
const DELETE_BUTTON = 'button[name=delete]'
const UPDATE_BUTTON = 'button[name=update]'
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
const clickUpdate = () => cy.get(UPDATE_BUTTON).click()

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
  createEntryWithFields(VALID_NAME, VALID_PHONE, VALID_EMAIL)
}

const createEntryWithFields = (name, phone, email) => {
  enterName(name)
  enterPhoneNumber(phone)
  enterEmail(email)
  clickAdd()
}

/**
 * Author: Guilherme Jardim
 * July 2023
 */
describe('Test Contact App', () => {

  beforeEach(() => {
    cy.visit('./contact_app.html')
  })

  it('Test if the application loads correctly', () => {
    cy.get('h1.text-center').should('have.text', 'Contact List App');
    cy.validateNumberOfRows(1)
  })

  // Add tests here

  //Create entry
  //Although the table is always empty when the page loads, a few tests below
  //are designed as if there could be pre-existing data in the table
  context('Test create a new entry', () => {


    it('Test adding entry with valid name, phone and email', () => {
      cy.get(TABLE_ROW).should($tr => {
        return $tr.length
      }).then((rows) => {
        createValidEntry()
        cy.validateNumberOfRows(rows.length + 1)
        validateNameByRowIndex(1, VALID_NAME)
        validatePhoneByRowIndex(1, VALID_PHONE)
        validateEmailByRowIndex(1, VALID_EMAIL)
        cy.verifyThatExists(EDIT_BUTTON)
        cy.verifyThatExists(DELETE_BUTTON)
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
      cy.get(TABLE_ROW).should($tr => { return $tr })
        .then((rows) => {
          clickAdd()
          cy.get(TABLE_ROW).should('have.length', rows.length)
        })

    })

    it('Should not accept invalid email addresses', () => {
      let invalidEmail = 'invalid.email'

      cy.get(TABLE_ROW).should($tr => { return $tr })
        .then((rows) => {
          createEntryWithFields(VALID_NAME, VALID_PHONE, invalidEmail)
          //Length should remain unchanged
          cy.get(TABLE_ROW).should('have.length', rows.length)
          cy.get(`td:contains(${invalidEmail})`).should('not.exist')
        })
    })

    it('Should not accept letters in the phone field', () => {
      let invalidPhone = '444-AAA-8989'

      createEntryWithFields(VALID_NAME, invalidPhone, VALID_EMAIL)
      cy.get(`td:contains(${invalidPhone})`).should('not.exist')

    })

  })

  //Edit entry
  context('Test edit an existing entry', () => {

    it('Test buttons are displayed and hidden correclty on the screen', () => {
      createValidEntry()
      cy.verifyThatExists(EDIT_BUTTON)
      cy.verifyThatExists(DELETE_BUTTON)
      cy.verifyThatNotExists(UPDATE_BUTTON)
      clickEdit()
      cy.verifyThatExists(UPDATE_BUTTON)
      cy.verifyThatNotExists(EDIT_BUTTON)
      cy.verifyThatNotExists(DELETE_BUTTON)
      clickUpdate()
      cy.verifyThatExists(EDIT_BUTTON)
      cy.verifyThatExists(DELETE_BUTTON)
      cy.verifyThatNotExists(UPDATE_BUTTON)
    })

    it('Test edit entry NAME only and keep the other fields', () => {
      createValidEntry()
      clickEdit()
      let newName = 'Raphael'
      cy.get(TABLE_ROW).find('input').eq(0).clear().type(newName)
      clickUpdate()
      validateNameByRowIndex(1, newName)
      validatePhoneByRowIndex(1, VALID_PHONE)
      validateEmailByRowIndex(1, VALID_EMAIL)
    })

    it('Test edit entry PHONE only and keep the other fields', () => {
      createValidEntry()
      clickEdit()
      let newPhone = '123-456-7899'
      cy.get(TABLE_ROW).find('input').eq(1).clear().type(newPhone)
      clickUpdate()
      validateNameByRowIndex(1, VALID_NAME)
      validatePhoneByRowIndex(1, newPhone)
      validateEmailByRowIndex(1, VALID_EMAIL)
    })

    it('Test edit entry EMAIL only and keep the other fields', () => {
      createValidEntry()
      clickEdit()
      let newEmail = 'angelo@gmail.com'
      cy.get(TABLE_ROW).find('input').eq(2).clear().type(newEmail)
      clickUpdate()
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
      clickUpdate()
      validateNameByRowIndex(1, newName)
      validatePhoneByRowIndex(1, newPhone)
      validateEmailByRowIndex(1, newEmail)
    })

    it('Test press edit button and save without making any changes', () => {
      createValidEntry()
      clickEdit()
      clickUpdate()
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
      createEntryWithFields(newUser.name, newUser.phone, newUser.email)
      cy.get(TABLE_ROW).should($tr => { return $tr })
        .then((rows) => {
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

    it('Test delete all entries one by one', () => {
      cy.get(TABLE_ROW).should($tr => { return $tr })
        .then((rows) => {
          let newUser1 = {
            name: 'Barbara Garcia',
            phone: '613-342-3344',
            email: 'b.garcia@gmail.com'
          }
          let newUser2 = {
            name: 'Bob King',
            phone: '613-987-3344',
            email: 'bking@gmail.com'
          }
          let newUser3 = {
            name: 'Ava Max',
            phone: '343-565-7878',
            email: 'max.ava@yahoo.com'
          }

          let users = [newUser1, newUser2, newUser3]
          for (let newUser of users) createEntryWithFields(newUser.name, newUser.phone, newUser.email)
          cy.get(TABLE_ROW).should('have.length', rows.length + users.length)

          for (let newUser of users) {
            cy.get(`td:contains(${newUser.name})`).parent().find(DELETE_BUTTON).click()
          }

          cy.get(TABLE_ROW).should('have.length', rows.length)

        })
    })
  })

});