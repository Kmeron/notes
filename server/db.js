const Sequelize = require('sequelize')

const sequelize = new Sequelize('notesdb', 'root', 'qwerty2021', {
  dialect: 'mysql',
  host: 'localhost',
  define: {
    timestamps: false
  }
  // logging: false
})

module.exports = { sequelize, DT: Sequelize.DataTypes }
