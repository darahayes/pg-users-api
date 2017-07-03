exports.up = function (knex, Promise) {
  return knex.schema
    .withSchema('public')
    .createTable('users', (table) => {
      table.increments('id').notNullable().primary()
      table.string('email').notNullable()
      table.string('username').notNullable()
      table.string('sha256').notNullable()
      table.string('salt').notNullable()
      table.string('pps')
      table.string('phone')
      table.string('cell')
      table.timestamp('registered').defaultTo(knex.fn.now())
      table.timestamp('dob')
      table.enum('gender', ['male', 'female', 'other'])
    })
}

exports.down = function (knex, Promise) {

}
