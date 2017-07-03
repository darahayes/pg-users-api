'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const expect = require('code').expect

const startServer = require('../../server')

let server
let requestOptions

lab.experiment('healthcheck', () => {
  lab.before((done) => {
    requestOptions = {
      method: 'GET',
      url: '/api/healthcheck'
    }

    startServer()
      .then((s) => {
        server = s
        console.log('server started')
        done()
      })
      .catch(done)
  })

  lab.after((done) => {
    server.stop(done)
  })

  lab.test('healthcheck should return 200', (done) => {
    console.log('testing healthcheck')
    server.inject(requestOptions, (response) => {
      console.log('response', response.result)
      expect(response.statusCode).to.equal(200)
      expect(response.result).to.equal({ok: 'true'})
      done()
    })
  })
})
