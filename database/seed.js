'use strict'

const knex = require('knex')
const path = require('path')
const config = require('../server/config')

const knexConfig = {
  client: 'pg',
  connection: config.pg,
  seeds: {
    directory: path.join(__dirname, 'seeds')
  }
}

  let k = knex(knexConfig)

  k.seed.run().then((res) => {
    k.destroy().then(() => {
      return res
    })
  })


