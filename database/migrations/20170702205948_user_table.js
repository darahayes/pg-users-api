exports.up = function (knex, Promise) {
  return knex.schema
    .withSchema('public')
    .createTable('users', (table) => {
      table.increments('id').notNullable().primary()
      table.string('email').notNullable()
      table.string('username').notNullable()
      table.string('sha256').notNullable()
      table.string('salt').notNullable()
    })
}

exports.down = function (knex, Promise) {

}
