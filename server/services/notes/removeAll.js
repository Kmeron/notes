const { sequelize } = require('../../db.js')
const { Note } = require('../../models/note.js')
const Joi = require('joi')

function deleteAllNotes ({ userId }) {
  return sequelize.transaction().then((transaction) => {
    return Note.destroy({
      where: {
        userId
      }
    }, { transaction })
      .then(() => {
        return transaction.commit()
          .then(() => {})
      })
      .catch(error => {
        return transaction.rollback()
          .then(() => {
            throw error
          })
      })
  })
}

const validationRules = {
  userId: Joi.number()
    .integer()
    .positive()
    .required()
}

module.exports = { service: deleteAllNotes, validationRules }
