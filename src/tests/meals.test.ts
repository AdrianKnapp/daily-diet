import { afterAll, beforeAll, expect, describe, it, beforeEach } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { app } from '../app'
import { joeDoe } from './mocks/users'
import { lunchMock } from './mocks/meals'

const login = async () => {
  const loginResponse = await request(app.server)
    .post('/users')
    .send(joeDoe)
    .expect(201)

  const loginCookies = loginResponse.get('Set-Cookie')

  return loginCookies
}

const createMeal = async (cookies) => {
  const response = await request(app.server)
    .post('/meals')
    .send(lunchMock)
    .set('Cookie', cookies)
    .expect(201)

  return response
}

describe('meals routes', () => {
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

  it('should be able to create a new meal', async () => {
    const cookies = await login()

    const response = await createMeal(cookies)

    expect(response.statusCode).toBe(201)
  })

  it('should be able to list all meals', async () => {
    const cookies = await login()

    await createMeal(cookies)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.data.meals).toEqual([
      expect.objectContaining({
        name: lunchMock.name,
        description: lunchMock.description,
      }),
    ])
  })
})
