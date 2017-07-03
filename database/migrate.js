'use strict'

const knex = require('knex')
const path = require('path')
const chalk = require('chalk')
const config = require('../server/config')

const knexConfig = {
  client: 'pg',
  connection: config.pg,
  migrations: {
    directory: path.join(__dirname, 'migrations')
  }
}

knex(knexConfig).migrate.latest().spread(function (batchNo, log) {
  if (log.length === 0) {
    success(chalk.cyan('Already up to date'))
  }

  success(
    chalk.green(`Batch ${batchNo} run: ${log.length} migrations \n`) +
    chalk.cyan(log.join('\n'))
  )
}).catch(exit)

function exit (err) {
  if (err) {
    chalk.red(err)
  }
  process.exit(1)
}

function success (text) {
  console.log(text)
  process.exit(0)
}
