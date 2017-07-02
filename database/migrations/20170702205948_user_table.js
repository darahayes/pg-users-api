const knex = require('knex')
const config = require('../../server/config')

exports.up = function(knex, Promise) {
  return knex.schema
    .withSchema('public')
    .createTable('users', (table) => {
      table.increments('id').notNullable().primary()
    })
};

exports.down = function(knex, Promise) {
  
};
