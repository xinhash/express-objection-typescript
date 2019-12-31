import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
  return knex.schema.createTable('users', table => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('username').notNullable()
    table
      .string('email')
      .unique()
      .index()
    table.string('password').notNullable()
    table
      .enu('role', ['admin', 'user', 'manager'], {
        useNative: true,
        enumName: 'role_types'
      })
      .defaultTo('user')
      .notNullable()
      .index()
    table.boolean('is_verified').defaultTo(false)
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists('users')
  return knex.raw('DROP TYPE IF EXISTS role_types')
}
