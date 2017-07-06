const Server = require('hapi').Server
const config = require('./config')
const inert = require('inert')
const vision = require('vision')

const healthcheck = require('./routes/healthcheck')
const users = require('./routes/users')

const {name, version} = require('../package.json')

const startServer = () => {
  const server = new Server()

  server.connection({host: config.host, port: config.port})

  const plugins = [
    vision,
    inert,
    healthcheck,
    users,
    {
      register: require('good'),
      options: {
        reporters: {
          console: [
            {
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [{ log: '*', response: '*' }]
            },
            {
              module: 'good-console'
            },
            'stdout'
          ]
        }
      }
    }
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
