'use strict'

const _ = require('lodash')
const async = require('async')
const pg = require('pg')
const config = require('../server/config')

/**
 * This is a hack to connect to PostgreSQL if you do not have a specific db.
 * @see https://github.com/olalonde/pgtools/blob/master/index.js#L43
 */
const pgConf = _.clone(config.pg)
pgConf.database = 'postgres'

const client = new pg.Client(pgConf)

function connect (next) {
  client.connect(next)
}

function dropDb (next) {
  if (/production/i.test(process.env.NODE_ENV)) {
    return next()
  }

  client.query(`DROP DATABASE IF EXISTS "${config.pg.database}"`, function (err, result) {
    if (err) return next(err)

    next()
  })
}

function createDb (next) {
  client.query(`CREATE DATABASE "${config.pg.database}"`, function (err, result) {
    if (err) return next(err)

    next()
  })
}

function init (cb) {
  async.series([
    connect,
    dropDb,
    createDb
  ],
  function (err1) {
    if (err1) console.log(err1)
    client.end(function () {
      cb(err1)
    })
  })
}

init((err) => {
  if (err) throw err
  else console.log('Db init: done')
})
