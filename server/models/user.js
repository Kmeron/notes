
const {sequelize, DT} = require('../db.js')
const {Note} = require('./note.js')

const User = sequelize.define('user', {
    id: {
      type: DT.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    login: {
      type: DT.STRING(30),
      unique: true,
      allowNull: false
    },
    password: {
      type: DT.STRING(30),
      allowNull: false
    }
  })

  function initRelations () {
    // const User = sequelize.model('user')
    User.hasMany(Note, { onDelete: 'cascade'})
  }

  module.exports = {User, initRelations}