import fastify from "fastify";

export const app = fastify();

// app.addHook("onRequest", (request, reply, done) => {
//   console.log(`🚀 request ~ [${request.method}] ${request.url}`)
// });

app.get("/", async (request, reply) => {
  reply.send({ hello: "world" })
});
