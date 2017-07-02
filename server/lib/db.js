'use strict'

const knex = require('knex')
const config = require('../config')

let db

function connect (callback) {
  try {
    let database = knex({
      client: 'pg',
      connection: config.pg,
      acquireConnectionTimeout: 1000
    })

    callback(null, database)
  } catch (e) {
    console.error(e)
    callback(e)
  }
}

function getDb (callback) {
  if (db) {
    return callback(null, db)
  }
  connect((err, database) => {
    if (err) {
      return callback(err)
    }
    db = database
    callback(null, db)
  })
}

module.exports = {
  getDb
}