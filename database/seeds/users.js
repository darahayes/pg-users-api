const users = require('../data/users.json').users
const {hashPassword} = require('../../server/lib/password')

var processed = users.map(function (user) {
  var hash = hashPassword(user.password)
  return {
    email: user.email,
    username: user.username,
    sha256: hash.sha256,
    salt: hash.salt,
    registered: new Date(user.registered),
    dob: new Date(user.dob),
    phone: user.phone,
    cell: user.cell,
    pps: user.PPS,
    gender: user.gender
  }
})

exports.seed = function (knex, Promise) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert(processed)
    })
}
