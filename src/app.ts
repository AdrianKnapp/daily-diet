import fastify from 'fastify'
import mealsRoutes from './routes/meals'

export const app = fastify()

app.addHook('preHandler', async (request) => {
  console.log(`🚀 request ~ [${request.method}] ${request.url}`)
})

app.register(mealsRoutes, {
  prefix: 'meals',
})
