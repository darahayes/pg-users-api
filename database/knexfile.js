'use strict'
/* eslint-env node */

module.exports = {
  client: 'pg',
  migrations: {
    directory: './migrations'
  },
  seeds: {
    directory: './seeds'
  }
}
