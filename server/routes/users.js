'use strict'

const Users = require('../lib/users.js')
const Joi = require('joi')
const Boom = require('boom')
const querystring = require('querystring')

exports.register = function register (server, opts, next) {
  const routes = [
    {
      method: 'GET',
      path: '/api/user',
      handler: (req, reply) => {
        let {fields, offset, limit} = req.query
        Users.list(fields, offset, limit, (err, result) => {
          if (err) {
            return reply(Boom.badImplementation())
          }
          if (result.nextPage) {
            result.nextPage = `${server.info.uri}${req.path}?offset=${result.nextPage.offset}&limit=${result.nextPage.limit}`
            if (fields) {
              result.nextPage += `&${querystring.stringify({fields: fields})}`
            }
          }
          return reply(result)
        })
      },
      config: {
        tags: ['api'],
        auth: false,
        validate: {
          query: {
            fields: [Joi.string().valid(Users.allowedFields), Joi.array().items(Joi.string().valid(Users.allowedFields))],
            offset: Joi.number().min(0),
            limit: Joi.number().min(10).max(30)
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
      method: 'POST',
      path: '/api/user',
      handler: (req, reply) => {
        console.log(req.payload)
        Users.create(req.payload, (err, user) => {
          if (err) {
            if (err.code && err.code === '23505') {
              return reply({error: err.detail}).code(400)
            }
            return reply(Boom.badImplementation())
          }
          reply(user)
        })
      },
      config: {
        validate: {
          payload: {
            email: Joi.string().email().lowercase().required(),
            username: Joi.string().token().min(4).max(50).lowercase().trim().required(),
            password: Joi.string().min(6).max(128).required(),
            phone: Joi.string(),
            cell: Joi.string(),
            dob: Joi.date().min('1-1-1900').max('now'),
            pps: Joi.string().regex(/^(\d{7})([A-Z]{1,2})$/i),
            gender: Joi.string().valid(['male', 'female', 'other'])
          }
        },
        auth: false,
        description: `Create a user`,
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
    },
    {
      method: 'POST',
      path: '/api/user/login',
      handler: (req, reply) => {
        console.log(req.payload)
        Users.verifyLogin(req.payload, (err, verified) => {
          if (err) return reply(Boom.badImplementation())
          reply(verified).code(verified ? 200 : 400)
        })
      },
      config: {
        validate: {
          payload: Joi.object().keys({
            login: Joi.string().required(),
            password: Joi.string().required()
          })
        },
        auth: false,
        description: `Create a user`,
        tags: ['api', 'users']
      }
    },
  ]

  server.route(routes)
  next()
}

exports.register.attributes = {
  name: 'users',
  version: '0.0.1'
}
