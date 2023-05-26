import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import responseWrapper from '../utils/responseWrapper'
import checkUserIdExists from '../middlewares/check-userid-exists'

const mealsRoutes = async (app, options, done) => {
  app.get(
    '/',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const { uid } = request.cookies

      const meals = await knex
        .table('meals')
        .where({ user_id: uid })
        .select('*')

      reply.send(responseWrapper({ data: { meals } }))
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const { id } = request.params

      const { uid } = request.cookies

      const meal = await knex
        .table('meals')
        .where({ id, user_id: uid })
        .select('*')
        .first()

      if (!meal) {
        return reply.status(404).send(responseWrapper('Meal id not found'))
      }

      reply.send(responseWrapper({ data: { meal } }))
    },
  )

  app.post(
    '/',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const { name, description, date, isInTheDiet } = request.body

      const { uid } = request.cookies

      const meal = {
        id: randomUUID(),
        name,
        description,
        date,
        is_in_the_diet: isInTheDiet,
        user_id: uid,
        created_at: new Date(Date.now()).toISOString(),
      }

      await knex.table('meals').insert(meal)

      reply.status(201).send(
        responseWrapper({
          data: {
            meal,
          },
        }),
      )
    },
  )

  app.patch(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const { id } = request.params
      const { name, description, date, isInTheDiet } = request.body

      const { uid } = request.cookies

      const meal = {
        id,
        name,
        description,
        date,
        is_in_the_diet: isInTheDiet,
      }

      const response = await knex.table('meals').update(meal).where({
        id,
        user_id: uid,
      })

      if (!response) {
        return reply.status(404).send(responseWrapper('Meal id not found'))
      }

      const mealUpdated = await knex
        .select('*')
        .from('meals')
        .where({ id, user_id: uid })
        .first()

      reply.status(201).send(
        responseWrapper({
          data: {
            mealUpdated,
          },
        }),
      )
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const { id } = request.params

      const { uid } = request.cookies

      const response = await knex.table('meals').delete().where({
        id,
        user_id: uid,
      })

      if (!response) {
        return reply.status(404).send(responseWrapper('Meal id not found'))
      }

      reply.status(204).send()
    },
  )
}

export default mealsRoutes
