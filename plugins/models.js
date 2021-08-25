'use strict'

const fp = require('fastify-plugin')

const { db } = require('../db')
// initialize models
const makeTodoModel = require('../models/todo')
const Todo = makeTodoModel(db)

module.exports = fp(async function (fastify, opts) {
  fastify.decorate('models', function () {
    return { db, Todo }
  })
})
