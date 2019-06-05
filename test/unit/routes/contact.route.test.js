const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const sinon = require('sinon')
const Boom = require('@hapi/boom')
const lab = exports.lab = Lab.script()
const createServer = require('../../../server')
const path = '/contacts'
const { Contact } = require('../../../server/models')

const UNKNOWN_GUID = 'e5ea3b73-1666-47dc-82e0-037baa5fba29'
const INVALID_GUID = 'INVALID-GUID'

const invalidGuidMessage = (prop) => `child "${prop}" fails because ["${prop}" must be a valid GUID]`
const invalidStringMessage = (prop) => `child "${prop}" fails because ["${prop}" must be a string]`

lab.experiment('Contact route: ', () => {
  let server

  // Create server before the tests
  lab.before(async () => {
    server = await createServer()
  })

  let sandbox
  let mocks
  let request

  const testResponse = (actual, expected) => {
    Code.expect(actual.statusCode).to.equal(expected.statusCode)
    Code.expect(actual.headers['content-type']).to.include('application/json')
    Code.expect(actual.payload).to.equal(JSON.stringify(expected.payload))
  }

  lab.beforeEach(() => {
    mocks = {
      id: 'a5754ea4-aee8-40d3-a0d7-e7681ed8ef3a',
      contact: new Contact({
        firstName: 'James',
        lastName: 'Bond'
      })
    }

    // Create a sinon sandbox to stub methods
    sandbox = sinon.createSandbox()
  })

  lab.afterEach(() => {
    // Restore the sandbox to make sure the stubs are removed correctly
    sandbox.restore()
  })

  /** ************************* GET All **************************** **/

  lab.experiment(`GET ${path}`, () => {
    lab.beforeEach(() => {
      // Create GET request
      request = () => {
        return {
          method: 'GET',
          url: path
        }
      }
    })

    lab.test('responds with all contacts', async () => {
      sandbox.stub(Contact, 'getAll').value(async () => [mocks.contact])

      testResponse(await server.inject(request()), {
        statusCode: 200,
        payload: [mocks.contact]
      })
    })

    lab.test('responds with "Bad Implementation" when the request throws an error', async () => {
      sandbox.stub(Contact, 'getAll').value(async () => {
        throw new Error('failure')
      })

      testResponse(await server.inject(request()), Boom.badImplementation().output)
    })
  })

  /** ************************* GET By Id **************************** **/

  lab.experiment(`GET ${path}/{id}`, () => {
    lab.beforeEach(() => {
      // Create GET request
      request = (id) => {
        return {
          method: 'GET',
          url: `${path}/${id}`
        }
      }
    })

    lab.test('responds with the existing contact when {id} is an existing guid', async () => {
      sandbox.stub(Contact, 'getById').value(async () => mocks.contact)

      testResponse(await server.inject(request(mocks.id)), {
        statusCode: 200,
        payload: mocks.contact
      })
    })

    lab.test('responds with "Not Found" when {id} is an unknown guid', async () => {
      sandbox.stub(Contact, 'getById').value(async () => undefined)

      testResponse(await server.inject(request(UNKNOWN_GUID)), Boom.notFound().output)
    })

    lab.test('responds with "Bad Data" when {id} is an invalid guid', async () => {
      testResponse(await server.inject(request(INVALID_GUID)), Boom.badData(invalidGuidMessage('id')).output)
    })

    lab.test('responds with "Bad Implementation" when the request throws an error', async () => {
      sandbox.stub(Contact, 'getById').value(async () => {
        throw new Error('failure')
      })

      testResponse(await server.inject(request(mocks.id)), Boom.badImplementation().output)
    })
  })

  /** ************************* POST **************************** **/

  lab.experiment(`POST ${path}`, () => {
    lab.beforeEach(() => {
      // Create POST request
      request = (data) => {
        return {
          method: 'POST',
          url: path,
          payload: data
        }
      }
    })

    lab.test('responds with the added contact', async () => {
      sandbox.stub(Contact.prototype, 'save').value(async () => mocks.contact)

      testResponse(await server.inject(request(mocks.contact)), {
        statusCode: 200,
        payload: mocks.contact
      })
    })

    lab.test('responds with "Bad Data" when invalid data is posted', async () => {
      testResponse(await server.inject(request({ firstName: 10101 })), Boom.badData(`${invalidStringMessage('firstName')}`).output)
    })

    lab.test('responds with "Bad Implementation" when the request throws an error', async () => {
      sandbox.stub(Contact.prototype, 'save').value(async () => {
        throw new Error('failure')
      })

      testResponse(await server.inject(request(mocks.contact)), Boom.badImplementation().output)
    })
  })

  /** ************************* PATCH **************************** **/

  lab.experiment(`PATCH ${path}/{id}`, () => {
    lab.beforeEach(() => {
      // Create PATCH request
      request = (id, data) => {
        return {
          method: 'PATCH',
          url: `${path}/${id}`,
          payload: data
        }
      }
    })

    lab.test('responds with the updated contact when {id} is an existing guid', async () => {
      sandbox.stub(Contact, 'getById').value(async () => mocks.contact)
      sandbox.stub(Contact.prototype, 'save').value(async () => mocks.contact)

      testResponse(await server.inject(request(mocks.id, mocks.contact)), {
        statusCode: 200,
        payload: mocks.contact
      })
    })

    lab.test('responds with "Not Found" when {id} is an unknown guid', async () => {
      sandbox.stub(Contact, 'getById').value(async () => undefined)

      testResponse(await server.inject(request(UNKNOWN_GUID, mocks.contact)), Boom.notFound().output)
    })

    lab.test('responds with "Bad Data" when {id} is an invalid guid', async () => {
      testResponse(await server.inject(request(INVALID_GUID, mocks.contact)), Boom.badData(invalidGuidMessage('id')).output)
    })

    lab.test('responds with "Bad Data" when invalid data is patched', async () => {
      testResponse(await server.inject(request(mocks.id, { firstName: 10101 })), Boom.badData(`${invalidStringMessage('firstName')}`).output)
    })

    lab.test('responds with "Bad Implementation" when the request throws an error', async () => {
      sandbox.stub(Contact, 'getById').value(async () => {
        throw new Error('failure')
      })

      testResponse(await server.inject(request(mocks.id, mocks.contact)), Boom.badImplementation().output)
    })
  })

  /** ************************* DELETE **************************** **/

  lab.experiment(`DELETE ${path}/{id}`, () => {
    lab.beforeEach(() => {
      // Create DELETE request
      request = (id) => {
        return {
          method: 'DELETE',
          url: `${path}/${id}`
        }
      }
    })

    lab.test('responds with the existing contact when {id} is an existing guid', async () => {
      sandbox.stub(Contact, 'getById').value(async () => mocks.contact)
      sandbox.stub(Contact.prototype, 'delete').value(async () => true)

      testResponse(await server.inject(request(mocks.id)), {
        statusCode: 200,
        payload: true
      })
    })

    lab.test('responds with "Not Found" when {id} is an unknown guid', async () => {
      sandbox.stub(Contact, 'getById').value(async () => undefined)

      testResponse(await server.inject(request(UNKNOWN_GUID)), Boom.notFound().output)
    })

    lab.test('responds with "Bad Data" when {id} is an invalid guid', async () => {
      testResponse(await server.inject(request(INVALID_GUID)), Boom.badData(invalidGuidMessage('id')).output)
    })

    lab.test('responds with "Bad Implementation" when the request throws an error', async () => {
      sandbox.stub(Contact, 'getById').value(async () => {
        throw new Error('failure')
      })

      testResponse(await server.inject(request(mocks.id)), Boom.badImplementation().output)
    })
  })
})
