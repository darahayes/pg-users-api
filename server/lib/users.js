'use strict'
const {getDb} = require('./db')

function list (callback) {
  getDb((err, db) => {
    if (err) return callback(err)
    db.column('email', 'username').select().from('users')
      .then((result) => {
        callback(null, result)
      })
      .catch((e) => {
        callback(e)
      })
  })
}

function read (id, callback) {
  getDb((err, db) => {
    if (err) return callback(err)
    db('users').select('email', 'username').where('id', id)
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
  list: list,
  read: read,
  create: create,
  update: update,
  remove: remove
}
