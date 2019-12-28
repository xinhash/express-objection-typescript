import { createPassword } from '@app/utils/password'
import { v4 as uuid } from 'uuid'

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: uuid(),
          username: 'Admin',
          email: 'admin@site.com',
          password: createPassword('password')
        },
        {
          id: uuid(),
          username: 'User',
          email: 'user@site.com',
          password: createPassword('password')
        },
        {
          id: uuid(),
          username: 'Shubham',
          email: 'shubhamsinha.ss@gmail.com',
          password: createPassword('password')
        }
      ])
    })
}
