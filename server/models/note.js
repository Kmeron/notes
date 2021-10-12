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
    }
  })

  // function initRelation () {
  //   Note.belongsTo('user', {

  //   })
  // }

module.exports = {Note, }