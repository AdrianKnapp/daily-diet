import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import responseWrapper from '../utils/responseWrapper'
import checkUserIdExists from '../middlewares/check-userid-exists'
import { z } from 'zod'
import validateZodSchema from '../utils/validateZodSchema'
import getBestSequenceInDiet from '../utils/getBestSequenceInDiet'

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
      const getMealByIdParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const {
        errors,
        data: { id },
      } = validateZodSchema(getMealByIdParamsSchema, request.params)

      if (errors) {
        return reply.status(400).send(
          responseWrapper({
            errors,
          }),
        )
      }

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

  app.get(
    '/resume',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const { uid } = request.cookies

      const meals = await knex
        .table('meals')
        .where({ user_id: uid })
        .select('*')

      if (!meals) {
        return reply.status(404).send(responseWrapper('Meal id not found'))
      }

      const mealsInDiet = meals.filter((meal) => meal.is_in_the_diet)?.length
      const bestSequenceInDiet = getBestSequenceInDiet(meals)?.length

      reply.send(
        responseWrapper({
          data: {
            quantity: meals.length,
            mealsInDiet,
            mealsOutDiet: meals.length - mealsInDiet,
            bestSequenceInDiet,
          },
        }),
      )
    },
  )

  app.post(
    '/',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string().min(0).max(255),
        description: z.string().min(0).max(255),
        date: z.string().min(0).max(255),
        isInTheDiet: z.boolean(),
      })

      const {
        errors,
        data: { name, description, date, isInTheDiet },
      } = validateZodSchema(createMealBodySchema, request.body)

      if (errors) {
        return reply.status(400).send(
          responseWrapper({
            errors,
          }),
        )
      }

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
      const editMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const {
        errors: paramErrors,
        data: { id },
      } = validateZodSchema(editMealParamsSchema, request.params)

      if (paramErrors) {
        return reply.status(400).send(
          responseWrapper({
            errors: paramErrors,
          }),
        )
      }

      const editMealBodySchema = z.object({
        name: z.string().min(0).max(255),
        description: z.string().min(0).max(255),
        date: z.string().min(0).max(255),
        isInTheDiet: z.boolean(),
      })

      const {
        errors,
        data: { name, description, date, isInTheDiet },
      } = validateZodSchema(editMealBodySchema, request.body)

      if (errors) {
        return reply.status(400).send(
          responseWrapper({
            errors,
          }),
        )
      }

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
      const deleteMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const {
        errors,
        data: { id },
      } = validateZodSchema(deleteMealParamsSchema, request.params)

      if (errors) {
        return reply.status(400).send(
          responseWrapper({
            errors,
          }),
        )
      }
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
