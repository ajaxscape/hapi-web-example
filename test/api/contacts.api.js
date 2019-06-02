const Lab = require('lab')
const Code = require('code')
const Boom = require('@hapi/boom')
const lab = exports.lab = Lab.script()
const supertest = require('supertest')
const path = '/contacts'

// UNIT test begin
lab.experiment('Contact api: ', () => {
  let server
  let contact = {
    firstName: 'James',
    lastName: 'Bond'
  }

  let firstNameChanged = 'George'

  // Create server before the tests
  lab.before(async () => {
    server = supertest.agent('http://localhost:3000')
  })

  lab.experiment(`Add, Update and Remove a contact`, () => {
    lab.test(`Add with POST ${path}`, async () => {
      const res = await server.post(path)
        .send(contact)
        .expect('Content-type', /json/)
        .expect(200)

      Code.expect(res.body.id).to.exist()
      Code.expect(res.body.firstName).to.equal(contact.firstName)
      Code.expect(res.body.lastName).to.equal(contact.lastName)
      contact = res.body
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
      const res = await server.patch(path + '/' + contact.id)
        .send({ firstName: firstNameChanged })
        .expect('Content-type', /json/)
        .expect(200)

      Code.expect(res.body.id).to.exist()
      Code.expect(res.body.firstName).to.equal(firstNameChanged)
      Code.expect(res.body.lastName).to.equal(contact.lastName)
      contact = res.body
    })

    lab.test(`Check if updated correctly when GET ${path}/{id} returns 200 and the correct contact data`, async () => {
      const res = await server.get(path + '/' + contact.id)
        .expect('Content-type', /json/)
        .expect(200)

      Code.expect(res.body.id).to.exist()
      Code.expect(res.body.firstName).to.equal(firstNameChanged)
      Code.expect(res.body.lastName).to.equal(contact.lastName)
      contact = res.body
    })

    lab.test(`Delete with DELETE ${path}/{id}`, async () => {
      const res = await server.delete(path + '/' + contact.id)
        .expect('Content-type', /json/)
        .expect(200)

      Code.expect(res.body).to.equal(true)
    })

    lab.test(`Check if deleted correctly when GET ${path}/{id} returns 404`, async () => {
      const res = await server.get(path + '/' + contact.id)
        .expect('Content-type', /json/)
        .expect(404)

      Code.expect(res.body).to.equal(Boom.notFound().output.payload)
    })

    lab.test(`Check if deleted correctly when GET ${path} returns an array of contacts not containing the deleted contact`, async () => {
      const res = await server.get(path)
        .send(contact)
        .expect('Content-type', /json/)
        .expect(200)

      const added = res.body.find(({ id }) => id === contact.id)

      Code.expect(added).to.not.exist()
    })
  })
})
