const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const Boom = require('@hapi/boom')
const lab = exports.lab = Lab.script()
const supertest = require('supertest')
const path = '/applications'

const { port } = require('../../server/config')

// UNIT test begin
lab.experiment('Application api: ', () => {
  let server
  let applicationId
  let application = {
    categoryId: 'c0c7b1bc-71ee-4a05-9f22-4bb0bc87da4d',
    contactId: 'e374c62d-8908-40c5-8f8c-53f051f42f61'
  }

  let categoryIdChanged = 'd5111976-bcef-4c9e-b3c4-5aa7c6f3b253'

  // Create server before the tests
  lab.before(async () => {
    server = supertest.agent(`http://localhost:${port}`)
  })

  lab.experiment(`Add, Update and Remove an application`, () => {
    lab.test(`Add with POST ${path}`, async () => {
      const res = await server.post(path)
        .send(application)
        .expect('Content-type', /json/)
        .expect(200)

      const { id } = res.body
      Code.expect(id).to.exist()

      Code.expect(Object.entries(res.body)).to.include(Object.entries(application))
      applicationId = id
    })

    lab.test(`Check if added correctly when GET ${path} returns an array of applications containing the added application`, async () => {
      const res = await server.get(path)
        .send(application)
        .expect('Content-type', /json/)
        .expect(200)

      const added = res.body.find(({ categoryId, contactId }) => categoryId === application.categoryId && contactId === application.contactId)

      Code.expect(added).to.exist()
    })

    lab.test(`Update with PATCH ${path}/{id}`, async () => {
      const res = await server.patch(path + '/' + applicationId)
        .send({ categoryId: categoryIdChanged })
        .expect('Content-type', /json/)
        .expect(200)

      Code.expect(Object.entries(res.body)).to.include(Object.entries({ id: applicationId, categoryId: categoryIdChanged, contactId: application.contactId }))
    })

    lab.test(`Check if updated correctly when GET ${path}/{id} returns 200 and the correct application data`, async () => {
      const res = await server.get(path + '/' + applicationId)
        .expect('Content-type', /json/)
        .expect(200)

      Code.expect(Object.entries(res.body)).to.include(Object.entries({ id: applicationId, categoryId: categoryIdChanged, contactId: application.contactId }))
    })

    lab.test(`Delete with DELETE ${path}/{id}`, async () => {
      const res = await server.delete(path + '/' + applicationId)
        .expect('Content-type', /json/)
        .expect(200)

      Code.expect(res.body).to.equal(true)
    })

    lab.test(`Check if deleted correctly when GET ${path}/{id} returns 404`, async () => {
      const res = await server.get(path + '/' + applicationId)
        .expect('Content-type', /json/)
        .expect(404)

      Code.expect(res.body).to.equal(Boom.notFound().output.payload)
    })

    lab.test(`Check if deleted correctly when GET ${path} returns an array of applications not containing the deleted application`, async () => {
      const res = await server.get(path)
        .send(application)
        .expect('Content-type', /json/)
        .expect(200)

      const added = res.body.find(({ id }) => id === applicationId)

      Code.expect(added).to.not.exist()
    })
  })
})
