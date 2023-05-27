import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import responseWrapper from '../utils/responseWrapper'
import { encryptPassword, validatePassword } from '../utils/handlePassword'
import { z } from 'zod'
import validateZodSchema from '../utils/validateZodSchema'

const usersRoutes = async (app, options, done) => {
  app.get('/', async (request, reply) => {
    const users = await knex
      .table('users')
      .select('id')
      .select('email')
      .select('name')
      .select('created_at')

    reply.send(responseWrapper({ data: { users } }))
  })

  app.get('/:id', async (request, reply) => {
    const getUserByIdParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const {
      errors,
      data: { id },
    } = validateZodSchema(getUserByIdParamsSchema, request.params)

    if (errors) {
      return reply.status(400).send(
        responseWrapper({
          errors,
        }),
      )
    }

    const user = await knex
      .table('users')
      .select('id')
      .select('email')
      .select('name')
      .select('created_at')
      .where({ id })
      .first()

    reply.send(responseWrapper({ data: { user } }))
  })

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string().min(3).max(255),
      email: z.string().email(),
      password: z.string().min(6).max(255),
    })

    const {
      errors,
      data: { name, email, password },
    } = validateZodSchema(createUserBodySchema, request.body)

    if (errors) {
      return reply.status(400).send(
        responseWrapper({
          errors,
        }),
      )
    }

    const emailAlreadyExists = await knex
      .table('users')
      .where({ email })
      .select('email')
      .first()

    if (emailAlreadyExists) {
      return reply.status(409).send(responseWrapper('Email already exists.'))
    }

    const hashedPassword = await encryptPassword(password)

    const user = {
      id: randomUUID(),
      name,
      email,
      password: hashedPassword,
      created_at: new Date(Date.now()).toISOString(),
    }

    await knex.table('users').insert(user)

    reply.cookie('uid', user.id, {
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // 1 day
    })

    reply.status(201).send(
      responseWrapper({
        data: {
          user,
        },
      }),
    )
  })

  app.post('/login', async (request, reply) => {
    const loginBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6).max(255),
    })

    const {
      errors,
      data: { email, password },
    } = validateZodSchema(loginBodySchema, request.body)

    if (errors) {
      return reply.status(400).send(
        responseWrapper({
          errors,
        }),
      )
    }

    const user = await knex.table('users').where({ email }).select('*').first()

    const passwordIsValid = await validatePassword(password, user.password)

    if (!passwordIsValid) {
      reply.status(403).send(responseWrapper('Invalid credentials.'))
    }

    if (request.cookies.uid) {
      return reply.status(200).send(responseWrapper('User already logged in.'))
    }

    reply.cookie('uid', user.id, {
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // 1 day
    })

    return reply.status(200).send(
      responseWrapper({
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        },
      }),
    )
  })

  app.post('/logout', async (request, reply) => {
    reply.clearCookie('uid', {
      path: '/',
    })

    reply.status(200).send(
      responseWrapper({
        data: {
          message: 'User logged out.',
        },
      }),
    )
  })
}

export default usersRoutes
