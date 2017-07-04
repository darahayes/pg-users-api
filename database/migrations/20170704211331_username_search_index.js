
exports.up = function (knex, Promise) {
  return knex.raw('CREATE INDEX user_username_search_idx ON users USING GIN(username gin_trgm_ops)')
}

exports.down = function (knex, Promise) {

}
