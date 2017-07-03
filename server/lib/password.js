const crypto = require('crypto')

function generateSalt () {
  return crypto.randomBytes(64).toString('hex')
}

exports.hashPassword = function (password) {
  var salt = generateSalt()
  var hash = crypto.createHmac('sha256', salt)
  hash.update(password)
  return {
    salt: salt,
    sha256: hash.digest('hex')
  }
}

exports.verify = function (password, salt, sha256) {
  var calculated = crypto.createHmac('sha256', salt).update(password).digest('hex')
  return calculated === sha256
}
