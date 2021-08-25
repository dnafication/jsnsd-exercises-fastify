const { Sequelize } = require('sequelize')

const db = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite',
})

module.exports = { db }

const sync = async () => {
  await require('../models/todo')(db).sync()
}
// synchronize the db
if (require.main === module) {
  sync().catch(console.error)
}
