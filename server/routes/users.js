'use strict'

const Users = require('../lib/users.js')
const Joi = require('joi')
const Boom  = require('boom')

exports.register = function register (server, opts, next) {
  const routes = [
    {
      method: 'GET',
      path: '/api/user',
      handler: (req, reply) => {
        Users.list((err, result) => {
          return reply({result: err || result})
        })
      },
      config: {
        tags: ['api'],
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/api/user/{id}',
      handler: (req, reply) => {
        let {id} = req.params
        Users.read(id, (err, result) => {
          return reply({result: err || result})
        })
      },
      config: {
        validate: {
          params: Joi.object({
            id: Joi.number().min(1).required()
          })
        },
        auth: false,
        description: `Read a user by ID`,
        tags: ['api', 'users']
      }
    },
    {
      method: 'DELETE',
      path: '/api/user/{id}',
      handler: (req, reply) => {
        let {id} = req.params
        Users.remove(id, (err, deleted) => {
          if (err) return reply(Boom.badImplementation())
          if (!deleted) return reply(Boom.notFound('User not found'))
          reply().statusCode(200)
        })
      },
      config: {
        validate: {
          params: Joi.object({
            id: Joi.number().min(1).required()
          })
        },
        auth: false,
        description: `Delete a user by ID`,
        tags: ['api', 'users']
      }
    }
  ]

  server.route(routes)
  next()
}

exports.register.attributes = {
  name: 'users',
  version: '0.0.1'
}
