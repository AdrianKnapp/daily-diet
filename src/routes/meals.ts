import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import responseWrapper from '../utils/responseWrapper'

const mealsRoutes = async (app, options, done) => {
  app.get('/', async (request, reply) => {
    const meals = await knex.table('meals').select('*')

    reply.send(responseWrapper({ data: { meals } }))
  })

  app.post('/', async (request, reply) => {
    const { name, description, date, isInTheDiet, userId } = request.body

    const meal = {
      id: randomUUID(),
      name,
      description,
      date,
      is_in_the_diet: isInTheDiet,
      user_id: userId,
      created_at: new Date().toISOString(),
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
  })
}

export default mealsRoutes
