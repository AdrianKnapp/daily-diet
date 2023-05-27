import { afterAll, beforeAll, expect, describe, it, beforeEach } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { app } from '../app'
import { joeDoe } from './mocks/users'
import checkUidCookieExists from './utils/checkUidCookieExists'

describe('users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new user', async () => {
    const response = await request(app.server).post('/users').send(joeDoe)

    const cookies = response.get('Set-Cookie')

    expect(checkUidCookieExists(cookies)).toBeDefined()
    expect(response.statusCode).toBe(201)
  })

  it('should be able to list all users', async () => {
    await request(app.server).post('/users').send(joeDoe)

    const listUsersResponse = await request(app.server)
      .get('/users')
      .expect(200)

    expect(listUsersResponse.body.data.users).toEqual([
      expect.objectContaining({
        name: joeDoe.name,
        email: joeDoe.email,
      }),
    ])
  })

  it('should be able to get a specific user', async () => {
    await request(app.server).post('/users').send(joeDoe)

    const listUsersResponse = await request(app.server)
      .get('/users')
      .expect(200)

    const userId = listUsersResponse.body.data.users[0].id

    const userByIdResponse = await request(app.server)
      .get(`/users/${userId}`)
      .expect(200)

    expect(userByIdResponse.body.data.user).toEqual(
      expect.objectContaining({
        id: userId,
        name: joeDoe.name,
        email: joeDoe.email,
      }),
    )
  })

  it('should be able to logout', async () => {
    const response = await request(app.server)
      .post('/users')
      .send(joeDoe)
      .expect(201)

    const cookies = response.get('Set-Cookie')

    expect(cookies).toBeDefined()

    const logoutResponse = await request(app.server)
      .post('/users/logout')
      .expect(200)

    const logoutCookies = logoutResponse.get('Set-Cookie')

    expect(checkUidCookieExists(logoutCookies)).toBe(false)
    expect(logoutResponse.body.data.message).toBe('User logged out.')
  })

  it('should be able to login', async () => {
    await request(app.server).post('/users').send(joeDoe).expect(201)

    const logoutResponse = await request(app.server)
      .post('/users/logout')
      .expect(200)

    const logoutCookies = logoutResponse.get('Set-Cookie')
    expect(checkUidCookieExists(logoutCookies)).toBe(false)

    const response = await request(app.server)
      .post('/users/login')
      .send({
        email: joeDoe.email,
        password: joeDoe.password,
      })
      .expect(200)

    const cookies = response.get('Set-Cookie')
    expect(checkUidCookieExists(cookies)).toBe(true)
  })
})
