'use strict'

module.exports = {
  host: process.env.RH_USERS_HOST || 'localhost',
  port: process.env.RH_USERS_PORT || 3100,
  prod: process.env.NODE_ENV === 'production',
  pg: {
    
  }
}
