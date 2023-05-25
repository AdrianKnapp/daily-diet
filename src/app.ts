import fastify from 'fastify'
import mealsRoutes from './routes/meals'
import usersRoutes from './routes/users'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.addHook('preHandler', async (request) => {
  console.log(`🚀 request ~ [${request.method}] ${request.url}`)
})

app.register(fastifyCookie)

app.register(mealsRoutes, {
  prefix: 'meals',
})
app.register(usersRoutes, {
  prefix: 'users',
})
