'use strict'
const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  host: process.env.USERS_API_HOST || 'localhost',
  port: process.env.USERS_API_PORT || 3001,
  prod: process.env.NODE_ENV === 'production',
  pg: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'users',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  }
}
