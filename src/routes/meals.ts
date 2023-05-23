const mealsRoutes = async (app, options, done) => {
  app.get('/', async (request, reply) => {
    reply.send({ hello: 'world' })
  })
}

export default mealsRoutes
