
exports.up = function (knex, Promise) {
  return knex.raw('CREATE EXTENSION pg_trgm')
}

exports.down = function (knex, Promise) {

}
