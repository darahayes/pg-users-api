'use strict'
const {getDb} = require('./db')
const {hashPassword, verify} = require('./password')
const {UniqueConstraintError, UserNotFoundError} = require('./errors')

const defaultFields = [
  'email',
  'username'
]

const allowedFields = [
  'id',
  'email',
  'username',
  'gender',
  'dob',
  'phone',
  'cell',
  'pps',
  'registered'
]

const modifiableFields = [
  'email',
  'username',
  'password',
  'phone',
  'cell',
  'dob',
  'pps',
  'gender'
]

function list (fields, offset, limit, callback) {
  getDb((err, db) => {
    if (err) return callback(err)
    offset = offset || 0
    limit = limit || 10
    db('users').column(fields || defaultFields).select().where('id', '>', offset).orderBy('id', 'asc').limit(limit)
      .then((rows) => {
        let result = {rows: rows}
        if (rows.length === limit) {
          result.nextPage = {
            offset: offset + limit,
            limit: limit
          }
        }
        callback(null, result)
      })
      .catch((e) => {
        callback(e)
      })
  })
}

function read (id, fields, callback) {
  getDb((err, db) => {
    if (err) return callback(err)
    db('users').select(fields || defaultFields).where('id', id)
      .then((result) => {
        if (result.length > 0) {
          return callback(null, result[0])
        }
        callback(null, new UserNotFoundError())
      })
      .catch((e) => {
        callback(e)
      })
  })
}

function create (user, callback) {
  getDb((err, db) => {
    if (err) return callback(err)
    let hash = hashPassword(user.password)
    db('users').insert({
      email: user.email,
      username: user.username,
      salt: hash.salt,
      sha256: hash.sha256,
      phone: user.phone,
      cell: user.cell,
      dob: user.dob,
      pps: user.pps,
      gender: user.gender
    }).returning(allowedFields).then((result) => {
      console.log(result)
      callback(null, result[0])
    })
    .catch((err) => {
      console.log(err)
      callback(err)
    })
  })
}

function update (userId, fields, callback) {
  getDb((err, db) => {
    if (err) return callback(err)
    console.log('updating userId', userId, fields)
    db('users')
    .where('id', userId)
    .update(fields)
    .returning(allowedFields)
    .then((result) => {
      if (result.length > 0) {
        return callback(null, result[0])
      }
      callback(new UserNotFoundError())
    })
    .catch((err) => {
      console.log(err)
      if (err.constraint) {
        callback(new UniqueConstraintError(err.constraint))
      }
      callback(err)
    })
  })
}

function remove (id, callback) {
  getDb((err, db) => {
    if (err) return callback(err)
    db('users').where('id', id).delete()
      .then((rows) => {
        callback(null, rows > 0)
      })
      .catch(e => {
        callback(e)
      })
  })
}

function verifyLogin(creds, callback) {
  getDb((err, db) => {
    if (err) return callback(err)
    db('users').select().where('email', creds.login).orWhere('username', creds.login).then((result) => {
      if (result.length > 0) {
        let user = result[0]
        callback(null, verify(creds.password, user.salt, user.sha256))
      }
      else {
        callback(null, false)
      } 
    })
    .catch((err) => {
      callback(err)
    })
  })
}

module.exports = {
  list,
  read,
  create,
  update,
  remove,
  verifyLogin,
  allowedFields,
  modifiableFields
}
