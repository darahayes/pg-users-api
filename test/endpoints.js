'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const expect = require('code').expect
const testData = require('./testData')

const startServer = require('../server')

let server

lab.experiment('Testing Endpoints', () => {
  lab.before((done) => {
    startServer()
      .then((s) => {
        server = s
        console.log('server started')
        let requestOptions = {
          method: 'POST',
          url: '/api/user',
          payload: testData.realUser
        }
        server.inject(requestOptions, (response) => {
          testData.realUser.id = response.result.id
          done()
        })
      })
      .catch(done)
  })

  lab.after((done) => {
    server.stop(done)
  })

  lab.test('healthcheck should return 200', (done) => {
    let requestOptions = {
      method: 'GET',
      url: '/api/healthcheck'
    }
    server.inject(requestOptions, (response) => {
      expect(response.statusCode).to.equal(200)
      done()
    })
  })

  lab.test('GET /api/user should return 200', (done) => {
    let requestOptions = {
      method: 'GET',
      url: '/api/user'
    }
    server.inject(requestOptions, (response, payload) => {
      expect(response.statusCode).to.equal(200)
      expect(response.result).to.be.an.object().and.to.include(['rows', 'nextPage'])
      expect(response.result.rows).to.be.an.array()
      done()
    })
  })

  lab.test('GET /api/user using field query should return those fields', (done) => {
    let requestOptions = {
      method: 'GET',
      url: '/api/user?fields=username&fields=email'
    }
    server.inject(requestOptions, (response, payload) => {
      expect(response.statusCode).to.equal(200)
      expect(response.result).to.be.an.object().and.to.include(['rows', 'nextPage'])
      expect(response.result.rows).to.be.an.array()
      let user = response.result.rows[0]
      expect(user).to.be.an.object().and.to.only.include(['username', 'email'])
      done()
    })
  })

  lab.test('POST /api/user should return 200', (done) => {
    let requestOptions = {
      method: 'POST',
      url: '/api/user',
      payload: {
        email: 'user123@test.com',
        username: 'testuser123',
        password: 'password'
      }
    }
    server.inject(requestOptions, (response, payload) => {
      expect(response.statusCode).to.equal(200)
      expect(response.result).to.be.an.object()
      done()
    })
  })

  lab.test('POST /api/user when email already in use should return 400', (done) => {
    let requestOptions = {
      method: 'POST',
      url: '/api/user',
      payload: {
        email: testData.realUser.email,
        password: testData.realUser.password
      }
    }
    server.inject(requestOptions, (response, payload) => {
      expect(response.statusCode).to.equal(400)
      expect(response.result).to.be.an.object()
      done()
    })
  })

  lab.test('POST /api/user/login should return 200', (done) => {
    let requestOptions = {
      method: 'POST',
      url: '/api/user/login',
      payload: {
        login: 'user123@test.com',
        password: 'password'
      }
    }
    server.inject(requestOptions, (response, payload) => {
      expect(response.statusCode).to.equal(200)
      done()
    })
  })

  lab.test('POST /api/user/login with incorrect details should return 401', (done) => {
    let requestOptions = {
      method: 'POST',
      url: '/api/user/login',
      payload: {
        login: testData.fakeUser.email,
        password: testData.fakeUser.password
      }
    }
    server.inject(requestOptions, (response, payload) => {
      expect(response.statusCode).to.equal(401)
      done()
    })
  })

  lab.test('POST /api/user/login with incorrect details should return 401', (done) => {
    let requestOptions = {
      method: 'POST',
      url: '/api/user/login',
      payload: {
        login: testData.fakeUser.email,
        password: testData.fakeUser.password
      }
    }
    server.inject(requestOptions, (response, payload) => {
      expect(response.statusCode).to.equal(401)
      done()
    })
  })

  lab.test('GET /api/user/:id should return 200', (done) => {
    let requestOptions = {
      method: 'GET',
      url: `/api/user/${testData.realUser.id}`
    }
    server.inject(requestOptions, (response, payload) => {
      expect(response.statusCode).to.equal(200)
      done()
    })
  })

  lab.test('GET /api/user/:id when user does not exist should return 404', (done) => {
    let requestOptions = {
      method: 'GET',
      url: `/api/user/${testData.fakeUser.id}`
    }
    server.inject(requestOptions, (response, payload) => {
      expect(response.statusCode).to.equal(404)
      done()
    })
  })

  lab.test('PUT /api/user/:id should return 200', (done) => {
    let requestOptions = {
      method: 'PUT',
      url: `/api/user/${testData.realUser.id}`,
      payload: {
        location: testData.location
      }
    }
    server.inject(requestOptions, (response, payload) => {
      expect(response.statusCode).to.equal(200)
      done()
    })
  })

  lab.test('PUT /api/user/:id when user does not exist should return 404', (done) => {
    let requestOptions = {
      method: 'PUT',
      url: `/api/user/${testData.fakeUser.id}`,
      payload: {
        location: testData.location
      }
    }
    server.inject(requestOptions, (response, payload) => {
      expect(response.statusCode).to.equal(404)
      done()
    })
  })

  lab.test('GET /api/user/search using username should return results', (done) => {
    let requestOptions = {
      method: 'GET',
      url: `/api/user/search?query=${testData.realUser.username}`
    }
    server.inject(requestOptions, (response, payload) => {
      expect(response.statusCode).to.equal(200)
      expect(response.result).to.be.an.array().and.to.not.be.empty()
      done()
    })
  })

  lab.test('GET /api/user/search using username should return results', (done) => {
    let requestOptions = {
      method: 'GET',
      url: `/api/user/search?query=${testData.realUser.email}`
    }
    server.inject(requestOptions, (response, payload) => {
      expect(response.statusCode).to.equal(200)
      expect(response.result).to.be.an.array().and.to.not.be.empty()
      done()
    })
  })

  lab.test('GET /api/user/search should return results containing only requested fields', (done) => {
    let requestOptions = {
      method: 'GET',
      url: `/api/user/search?query=${testData.realUser.email}&fields=username`
    }
    server.inject(requestOptions, (response, payload) => {
      expect(response.statusCode).to.equal(200)
      expect(response.result).to.be.an.array().and.to.have.length(1)
      expect(response.result[0]).to.be.an.object().and.to.only.include('username')
      done()
    })
  })

  lab.test('GET /api/user/search using unknown username/email should not return results', (done) => {
    let requestOptions = {
      method: 'GET',
      url: `/api/user/search?query=${testData.fakeUser.email}`
    }
    server.inject(requestOptions, (response, payload) => {
      expect(response.statusCode).to.equal(200)
      expect(response.result).to.be.an.array().and.to.be.empty()
      done()
    })
  })

  lab.test('DELETE /api/user/:id should return 200', (done) => {
    let requestOptions = {
      method: 'DELETE',
      url: `/api/user/${testData.realUser.id}`
    }
    server.inject(requestOptions, (response, payload) => {
      expect(response.statusCode).to.equal(200)
      done()
    })
  })

  lab.test('DELETE /api/user/:id when user not found should return 404', (done) => {
    let requestOptions = {
      method: 'DELETE',
      url: `/api/user/${testData.fakeUser.id}`
    }
    server.inject(requestOptions, (response, payload) => {
      expect(response.statusCode).to.equal(404)
      done()
    })
  })
})
