// @ts-nocheck
const Server = require('hapi').Server
const config = require('./config')
const inert = require('inert')
const vision = require('vision')

const healthcheck = require('./routes/healthcheck')
const users = require('./routes/users')

const {name, version} = require('../package.json')

const startServer = () => {
  const debugMode = config.isProd ? false : true

  const server = new Server({debug: debugMode ? {log: ['debug', 'error', 'warn'], request: ['debug', 'error', 'warn']} : true })

  server.connection({host: config.host, port: config.port})

  const plugins = [
    vision,
    inert,
    healthcheck,
    users
  ]

  if (!config.isProd) {
    plugins.push({
      register: require('hapi-swagger'),
      options: {
        pathPrefixSize: 2,
        info: {
          title: `${name} API documentation`,
          version
        },
        documentationPath: '/api/docs',
        expanded: 'none'
      }
    })
  }

  return server.register(plugins)
    .then(() => server.start())
    .then(() => server)
}

module.exports = startServer
