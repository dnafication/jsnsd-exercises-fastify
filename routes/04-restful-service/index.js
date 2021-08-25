/** @type import('fastify').FastifyPluginAsync */
module.exports = async (fastify, opts) => {
  const { Todo } = fastify.models()
  fastify.get('/', async (request, reply) => {
    const todos = await Todo.findAll()
    return todos.map((t) => t.toJSON())
  })

  fastify.post('/', async (request, reply) => {
    const todo = await Todo.create(request.body)
    return todo.toJSON()
  })
}
