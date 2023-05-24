import fastify from 'fastify'
import mealsRoutes from './routes/meals'
import usersRoutes from './routes/users'

export const app = fastify()

app.addHook('preHandler', async (request) => {
  console.log(`🚀 request ~ [${request.method}] ${request.url}`)
})

app.register(mealsRoutes, {
  prefix: 'meals',
})
app.register(usersRoutes, {
  prefix: 'users',
})
