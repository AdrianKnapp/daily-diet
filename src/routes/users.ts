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

    const passwordIsValid = await validatePassword(password)

    // TODO: validate why this is returning true to every passwords
    console.log(
      '🚀 ~ file: users.ts:42 ~ app.post ~ passwordIsValid:',
      passwordIsValid,
    )

    if (passwordIsValid) {
      const user = await knex
        .table('users')
        .where({ email })
        .select('id')
        .first()

      return reply.status(200).send(
        responseWrapper({
          data: {
            user,
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
