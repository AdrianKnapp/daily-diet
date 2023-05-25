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

      // TODO: drop tables and redo database schema
      await knex.table('meals').insert(meal)

      // TODO: return the created meal
      reply.status(201).send(
        responseWrapper({
          data: {
            meal,
          },
        }),
      )
    },
  )
}

export default mealsRoutes
