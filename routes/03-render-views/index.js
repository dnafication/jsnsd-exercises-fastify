/** @type import('fastify').FastifyPluginAsync */
module.exports = async (fastify, opts) => {
  fastify.get('/', (request, reply) => {
    const { name = 'world' } = request.query
    return reply.view('hello.hbs', { name })
  })
}
