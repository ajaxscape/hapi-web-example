const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const Boom = require('@hapi/boom')
const lab = exports.lab = Lab.script()
const supertest = require('supertest')
const path = '/contacts'

const { port } = require('../../server/config')

// UNIT test begin
lab.experiment('Contact api: ', () => {
  let server
  let contactId
  let contact = {
    firstName: 'James',
    lastName: 'Bond'
  }

  let firstNameChanged = 'George'

  // Create server before the tests
  lab.before(async () => {
    server = supertest.agent(`http://localhost:${port}`)
  })

  lab.experiment(`Add, Update and Remove a contact`, () => {
    lab.test(`Add with POST ${path}`, async () => {
      const res = await server.post(path)
        .send(contact)
        .expect('Content-type', /json/)
        .expect(200)

      const { id } = res.body
      Code.expect(id).to.exist()

      Code.expect(Object.entries(res.body)).to.include(Object.entries(contact))
      contactId = id
    })

    lab.test(`Check if added correctly when GET ${path} returns an array of contacts containing the added contact`, async () => {
      const res = await server.get(path)
        .send(contact)
        .expect('Content-type', /json/)
        .expect(200)

      const added = res.body.find(({ firstName, lastName }) => firstName === contact.firstName && lastName === contact.lastName)

      Code.expect(added).to.exist()
    })

    lab.test(`Update with PATCH ${path}/{id}`, async () => {
      const res = await server.patch(path + '/' + contactId)
        .send({ firstName: firstNameChanged })
        .expect('Content-type', /json/)
        .expect(200)

      Code.expect(Object.entries(res.body)).to.include(Object.entries({ id: contactId, firstName: firstNameChanged, lastName: contact.lastName }))
    })

    lab.test(`Check if updated correctly when GET ${path}/{id} returns 200 and the correct contact data`, async () => {
      const res = await server.get(path + '/' + contactId)
        .expect('Content-type', /json/)
        .expect(200)

      Code.expect(Object.entries(res.body)).to.include(Object.entries({ id: contactId, firstName: firstNameChanged, lastName: contact.lastName }))
    })

    lab.test(`Delete with DELETE ${path}/{id}`, async () => {
      const res = await server.delete(path + '/' + contactId)
        .expect('Content-type', /json/)
        .expect(200)

      Code.expect(res.body).to.equal(true)
    })

    lab.test(`Check if deleted correctly when GET ${path}/{id} returns 404`, async () => {
      const res = await server.get(path + '/' + contactId)
        .expect('Content-type', /json/)
        .expect(404)

      Code.expect(res.body).to.equal(Boom.notFound().output.payload)
    })

    lab.test(`Check if deleted correctly when GET ${path} returns an array of contacts not containing the deleted contact`, async () => {
      const res = await server.get(path)
        .send(contact)
        .expect('Content-type', /json/)
        .expect(200)

      const added = res.body.find(({ id }) => id === contactId)

      Code.expect(added).to.not.exist()
    })
  })
})
