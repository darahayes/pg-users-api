
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', function(table) {
    table.jsonb('location')
    table.jsonb('picture')
    table.jsonb('name')
  })

}

exports.down = function(knex, Promise) {
  
}
