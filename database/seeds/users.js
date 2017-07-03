const users = require('../data/users.json').users
const passwords = require('../../server/lib/password')

var processed = users.map(function (user) {
  var hash = passwords.sha256(user.password)
  return {
    email: user.email,
    username: user.username,
    sha256: hash.sha256,
    salt: hash.salt
  }
})

exports.seed = function (knex, Promise) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert(processed)
    })
}
