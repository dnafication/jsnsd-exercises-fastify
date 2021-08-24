/** @type import('fastify').FastifyPluginAsync */
module.exports = async (fastify, opts) => {
  fastify.get('/', (request, reply) => {
    reply.sendFile('custom.html')
  })
}
