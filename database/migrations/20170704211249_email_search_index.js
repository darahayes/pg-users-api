
exports.up = function (knex, Promise) {
  return knex.raw('CREATE INDEX user_email_search_idx ON users USING GIN(email gin_trgm_ops)')
}

exports.down = function (knex, Promise) {

}
