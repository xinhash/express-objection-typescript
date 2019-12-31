const globalAny: any = global

import { setupDB } from '@app/config/db/commands'
import app from '@app/server'
import { NODE_ENV } from '@app/types/common'
import request from 'supertest'

describe('User endpoints', () => {
  let server
  let knex
  let user
  const authUrl = '/api/v1/'

  it('should provide list of users', async () => {
    const res = await request(app)
      .get(`${authUrl}/users`)
      .set('Content-Type', 'application/json')
      .set('Acccept', 'application/json')
      .set('Authorization', `Bearer ${globalAny.authToken}`)
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
      .set('Authorization', `Bearer ${globalAny.authToken}`)
    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('data')
    expect(res.body.data).not.toHaveProperty('password')
    expect(res.body.data).toHaveProperty('email')
    expect(res.body.data).toHaveProperty('username')
  })
})
