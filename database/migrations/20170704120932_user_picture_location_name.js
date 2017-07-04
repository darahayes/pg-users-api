
exports.up = function (knex, Promise) {
  return knex.schema.alterTable('users', (table) => {
    table.jsonb('location')
    table.jsonb('picture')
    table.jsonb('name')
  })
}
