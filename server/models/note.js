const {sequelize, DT} = require('../db.js')

const Note = sequelize.define('note', {
    id: {
      type: DT.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DT.STRING
    },
    text: {
      type: DT.STRING
    },
    userId: {
      type: DT.INTEGER,
      allowNull: false
    }
  })

  function initRelation () {
    Note.belongsTo(User, {
      foreignKey: 'userId'
    })
  }

module.exports = {Note, initRelation}