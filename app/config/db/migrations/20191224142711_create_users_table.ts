import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('users', t => {
    t.uuid('id').primary()
    t.string('username').notNullable()
    t.string('email').unique()
    t.string('password').notNullable()
    t.timestamp('createdAt').defaultTo(knex.fn.now())
    t.timestamp('updatedAt').defaultTo(knex.fn.now())

    t.index('email')
  })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('users')
}
