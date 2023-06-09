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

  it('should be able to get a meal by id', async () => {
    const cookies = await login()

    const responseCreateMeal = await createMeal(cookies)

    const responseGetMealById = await request(app.server)
      .get(`/meals/${responseCreateMeal.body.data.meal.id}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(responseGetMealById.body.data.meal).toEqual(
      expect.objectContaining({
        name: lunchMock.name,
        description: lunchMock.description,
      }),
    )
  })

  it('should be able to edit a meal', async () => {
    const cookies = await login()

    const responseCreateMeal = await createMeal(cookies)

    const responseGetMealById = await request(app.server)
      .get(`/meals/${responseCreateMeal.body.data.meal.id}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(responseGetMealById.body.data.meal).toEqual(
      expect.objectContaining({
        name: lunchMock.name,
        description: lunchMock.description,
      }),
    )

    const responseEditMeal = await request(app.server)
      .patch(`/meals/${responseCreateMeal.body.data.meal.id}`)
      .set('Cookie', cookies)
      .send({
        name: 'Dinner',
      })

    expect(responseEditMeal.body.data.meal).toEqual(
      expect.objectContaining({
        name: 'Dinner',
      }),
    )
  })

  it('should be able to delete a meal', async () => {
    const cookies = await login()

    const responseCreateMeal = await createMeal(cookies)

    const responseGetMealById = await request(app.server)
      .get(`/meals/${responseCreateMeal.body.data.meal.id}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(responseGetMealById.body.data.meal).toEqual(
      expect.objectContaining({
        name: lunchMock.name,
        description: lunchMock.description,
      }),
    )

    const responseDeleteMeal = await request(app.server)
      .delete(`/meals/${responseCreateMeal.body.data.meal.id}`)
      .set('Cookie', cookies)

    expect(responseDeleteMeal.statusCode).toBe(204)
  })

  it('should be able to get resume', async () => {
    const cookies = await login()

    const responseCreateMeal = await createMeal(cookies)

    expect(responseCreateMeal.statusCode).toBe(201)

    const responseGetResume = await request(app.server)
      .get('/meals/resume')
      .set('Cookie', cookies)
      .expect(200)

    expect(responseGetResume.body.data).toEqual(
      expect.objectContaining({
        bestSequenceInDiet: 1,
        mealsInDiet: 1,
        mealsOutDiet: 0,
        quantity: 1,
      }),
    )
  })
})
