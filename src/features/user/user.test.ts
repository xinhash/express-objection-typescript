import { setupDB } from '@app/config/db/commands'
import app from '@app/server'
import { NODE_ENV } from '@app/types/common'
import request from 'supertest'
import { generatePasswordHash } from 'objection-password-argon2'

describe('User endpoints', () => {
  let knex
  let user
  let token: string
  const authUrl = '/api/v1'

  beforeAll(async done => {
    knex = setupDB(NODE_ENV.staging, true)
    await knex.migrate.rollback()
    await knex.migrate.latest()
    await knex('users')
      .del()
      .then(async () => {
        // Inserts seed entries
        return knex('users').insert([
          {
            username: 'Test User',
            email: 'test@test.com',
            password: await generatePasswordHash('password')
          }
        ])
      })
    const res = await request(app)
      .post(`${authUrl}/auth/login`)
      .set('Content-Type', 'application/json')
      .set('Acccept', 'application/json')
      .send({
        email: 'test@test.com',
        password: 'password'
      })
    token = res.body.token
    done()
  })

  afterAll(async done => {
    // Closing the DB connection allows Jest to exit successfully.
    await knex.destroy()
    done()
  })

  it('should provide list of users', async () => {
    const res = await request(app)
      .get(`${authUrl}/users`)
      .set('Content-Type', 'application/json')
      .set('Acccept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('data')
    expect(Array.isArray(res.body.data)).toBe(true)
    user = res.body.data[0]
    expect(user).not.toHaveProperty('password')
    expect(user).toHaveProperty('email')
    expect(user).toHaveProperty('username')
  })

  it('should provide users by id', async () => {
    const res = await request(app)
      .get(`${authUrl}/users`)
      .query({ id: user?.id })
      .set('Content-Type', 'application/json')
      .set('Acccept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('data')
    expect(res.body.data[0]).not.toHaveProperty('password')
    expect(res.body.data[0]).toHaveProperty('email')
    expect(res.body.data[0]).toHaveProperty('username')
  })
})
