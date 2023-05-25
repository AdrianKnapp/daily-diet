import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import responseWrapper from '../utils/responseWrapper'
import { encryptPassword, validatePassword } from '../utils/handlePassword'

const usersRoutes = async (app, options, done) => {
  app.get('/', async (request, reply) => {
    const users = await knex.table('users').select('*')

    reply.send(responseWrapper({ data: { users } }))
  })

  app.post('/', async (request, reply) => {
    const { name, email, password } = request.body

    const emailAlreadyExists = await knex
      .table('users')
      .where({ email })
      .select('email')
      .first()

    if (emailAlreadyExists) {
      return reply.status(409).send(
        responseWrapper({
          error: 'Email already exists',
        }),
      )
    }

    const hashedPassword = await encryptPassword(password)

    const user = {
      id: randomUUID(),
      name,
      email,
      password: hashedPassword,
      created_at: new Date().toISOString(),
    }

    await knex.table('users').insert(user)

    // TODO: return the created meal
    reply.status(201).send(
      responseWrapper({
        data: {
          user,
        },
      }),
    )
  })

  app.post('/login', async (request, reply) => {
    const { email, password } = request.body

    const user = await knex.table('users').where({ email }).select('*').first()

    const passwordIsValid = await validatePassword(password, user.password)

    if (passwordIsValid) {
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
    }

    // TODO: return the created meal
    reply.status(403).send(
      responseWrapper({
        error: 'Invalid credentials',
      }),
    )
  })
}

export default usersRoutes
