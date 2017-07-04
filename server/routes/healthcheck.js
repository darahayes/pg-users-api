exports.register = function register (server, opts, next) {
  server.route({
    method: 'GET',
    path: '/api/healthcheck',
    config: {
      tags: ['api'],
      auth: false,
      handler: (req, reply) => reply()
    }
  })

  next()
}

exports.register.attributes = {
  name: 'healthcheck',
  version: '0.0.1'
}
