'use strict'
const {getDb} = require('./db')

const defaultFields = [
  'email',
  'username'
]

const allowedFields = [
  'id',
  'email',
  'username',
  'gender',
  'name',
  'location',
  'dob',
  'phone',
  'cell',
  'pps',
  'picture'
]

function list (fields, offset, limit, callback) {
  getDb((err, db) => {
    if (err) return callback(err)
    offset = offset || 0
    limit = limit || 10
    db('users').column(fields || defaultFields).select().where('id', '>', offset).orderBy('id', 'asc').limit(limit)
      .then((result) => {
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
        callback(null, result.length > 0 ? result[0] : null)
      })
      .catch((e) => {
        callback(e)
      })
  })
}

function create (callback) {
  callback(null, 'Testing')
}

function update (callback) {
  callback(null, 'Testing')
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

module.exports = {
  list,
  read,
  create,
  update,
  remove,
  allowedFields
}
