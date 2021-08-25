const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  return sequelize.define('Todo', {
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    done: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
  })
}
