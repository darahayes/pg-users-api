'use strict'

const Users = require('../lib/users.js')
const Joi = require('joi')
const Boom = require('boom')

exports.register = function register (server, opts, next) {
  const routes = [
    {
      method: 'GET',
      path: '/api/user',
      handler: (req, reply) => {
        let fields = req.query && req.query.fields ? req.query.fields : null
        Users.list(fields, (err, result) => {
          if (err) {
            return reply(Boom.badImplementation())
          }
          return reply(result)
        })
      },
      config: {
        tags: ['api'],
        auth: false,
        validate: {
          query: {
            fields: [Joi.string().valid(Users.allowedFields), Joi.array().items(Joi.string().valid(Users.allowedFields))]
          }
        }
      }
    },
    {
      method: 'GET',
      path: '/api/user/{id}',
      handler: (req, reply) => {
        let {id} = req.params
        let fields = req.query && req.query.fields ? req.query.fields : null
        Users.read(id, fields, (err, user) => {
          if (err) {
            return reply(Boom.badImplementation)
          }
          if (!user) {
            return reply(Boom.notFound('User not found'))
          }
          reply(user)
        })
      },
      config: {
        validate: {
          params: {
            id: Joi.number().min(1).required()
          },
          query: {
            fields: [Joi.string().valid(Users.allowedFields), Joi.array().items(Joi.string().valid(Users.allowedFields))]
          }
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
