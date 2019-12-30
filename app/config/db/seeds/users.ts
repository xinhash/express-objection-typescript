import * as Knex from 'knex'
import { generatePasswordHash } from 'objection-password-argon2'

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(async () => {
      // Inserts seed entries
      return knex('users').insert([
        {
          username: 'Admin',
          email: 'admin@email.com',
          password: await generatePasswordHash('password')
        },
        {
          username: 'User',
          email: 'user@email.com',
          password: await generatePasswordHash('password')
        },
        {
          username: 'Manager',
          email: 'manager@email.com',
          password: await generatePasswordHash('password')
        }
      ])
    })
}
