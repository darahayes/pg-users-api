const {getDb} = require('./db')

function list(callback) {
  getDb((err, db) => {
    db.column('email', 'username').select().from('users')
      .then((result) => {
        callback(null, result)
      })
      .catch((e) => {
        callback(e)
      })
  })
}

function read(id, callback) {
  getDb((err, db) => {
    db.column('email', 'username').select().where('id', id).from('users')
      .then((result) => {
        callback(null, result)
      })
      .catch((e) => {
        callback(e)
      })
  })
}

function create(callback) {
  callback(null, 'Testing')
}

function update(callback) {
  callback(null, 'Testing')
}

function remove(id, callback) {
  getDb((err, db) => {
    db('users').where('id', id).delete()
      .then((rows) => {
        console.log('rows', rows)
        callback(null, rows)
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