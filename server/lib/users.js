'use strict'
const {getDb} = require('./db')
const {hashPassword, verify} = require('./password')
const {UniqueConstraintError, UserNotFoundError} = require('./errors')

const defaultFields = [
  'email',
  'username',
  'name'
]

const allowedFields = [
  'id',
  'email',
  'username',
  'phone',
  'cell',
  'dob',
  'pps',
  'gender',
  'location',
  'name',
  'picture'
]

function list (fields = defaultFields, offset, limit, callback) {
  getDb((err, db) => {
    if (err) return callback(err)
    if (fields === 'all') fields = allowedFields
    offset = offset || 0
    limit = limit || 10
    db('users').column(fields).select().where('id', '>', offset).orderBy('id', 'asc').limit(limit)
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

function read (id, fields = defaultFields, callback) {
  getDb((err, db) => {
    if (err) return callback(err)
    if (fields === 'all') fields = allowedFields
    db('users').select(fields).where('id', id)
      .then((result) => {
        if (result.length > 0) {
          return callback(null, result[0])
        }
        callback(new UserNotFoundError())
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
    db('users')
      .insert({
        email: user.email,
        username: user.username,
        salt: hash.salt,
        sha256: hash.sha256,
        phone: user.phone,
        cell: user.cell,
        dob: user.dob,
        pps: user.pps,
        gender: user.gender,
        name: user.name,
        picture: user.picture,
        location: user.location
      })
      .returning(allowedFields).then((result) => {
        callback(null, result[0])
      })
      .catch((err) => {
        if (err.constraint) {
          return callback(new UniqueConstraintError(err.constraint))
        }
        callback(err)
      })
  })
}

function update (userId, fields, callback) {
  getDb((err, db) => {
    if (err) return callback(err)
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
        if (err.constraint) {
          return callback(new UniqueConstraintError(err.constraint))
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
        if (rows === 0) {
          return callback(new UserNotFoundError())
        }
        callback(null, true)
      })
      .catch(e => {
        callback(e)
      })
  })
}

function search (query, fields = defaultFields, callback) {
  getDb((err, db) => {
    if (err) return callback(err)
    if (fields === 'all') fields = allowedFields
    db('users')
      .select(fields)
      .where('email', 'like', `%${query}%`)
      .orWhere('username', 'like', `%${query}%`)
      .then((rows) => {
        callback(null, rows)
      })
      .catch(e => {
        callback(e)
      })
  })
}

function verifyLogin (creds, callback) {
  getDb((err, db) => {
    if (err) return callback(err)
    db('users')
      .select()
      .where('email', creds.login)
      .orWhere('username', creds.login)
      .then((result) => {
        if (result.length > 0) {
          let user = result[0]
          callback(null, verify(creds.password, user.salt, user.sha256))
        } else {
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
  search,
  verifyLogin,
  allowedFields
}
