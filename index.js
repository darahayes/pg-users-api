'use strict'

const startServer = require('./server/')

startServer()
  .then(server => console.info(`Server listening on ${server.info.uri}`))
  .catch(err => console.error({err}, `Failed to start server: ${err.message}`))
