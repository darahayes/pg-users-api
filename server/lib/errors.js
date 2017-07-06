'use strict'
const util = require('util')

const constraintMessages = {
  'users_email_unique': 'email already in use',
  'users_username_unique': 'username already in use'
}

function UserNotFoundError (message, detail) {
  Error.captureStackTrace(this, this.constructor)
  this.name = this.constructor.name
  this.message = 'user not found'
  this.detail = detail
}

function UniqueConstraintError (constraint) {
  Error.captureStackTrace(this, this.constructor)
  this.message = constraintMessages[constraint]
}

function InvalidLoginError () {
  Error.captureStackTrace(this, this.constructor)
  this.message = 'Invalid login'
}

util.inherits(UserNotFoundError, Error)
util.inherits(UniqueConstraintError, Error)
util.inherits(InvalidLoginError, Error)

module.exports = {
  UniqueConstraintError,
  UserNotFoundError,
  InvalidLoginError
}
