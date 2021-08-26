/** @type import('fastify').FastifyPluginAsync */
module.exports = async (fastify, opts) => {
  const { Todo } = fastify.models()
  fastify.get('/', async (request, reply) => {
    try {
      const todos = await Todo.findAll()
      return todos.map((t) => t.toJSON())
    } catch (error) {
      throw error
    }
  })

  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params
    const todo = await Todo.findByPk(id)
    if (!todo) {
      return fastify.httpErrors.notFound()
    }
    return todo.toJSON()
  })

  fastify.post('/', async (request, reply) => {
    try {
      const todo = await Todo.create(request.body)
      reply.status(201)
      return todo.toJSON()
    } catch (error) {
      throw error
    }
  })

  fastify.patch('/:id', async (request, reply) => {
    const { id } = request.params
    const { message, done } = request.body
    try {
      const todo = await Todo.findByPk(id)
      if (!todo) {
        return fastify.httpErrors.notFound()
      }
      todo.message = message
      todo.done = done
      await todo.save()
      return todo.toJSON()
    } catch (error) {
      throw error
    }
  })

  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params
    try {
      await Todo.destroy({ where: { id } })
      return { id, delete: true }
    } catch (error) {
      throw error
    }
  })
}
