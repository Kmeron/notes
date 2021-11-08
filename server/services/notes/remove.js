const { sequelize } = require('../../db.js')
const { Note } = require('../../models/note.js')
const ServiceError = require('../../ServiceError')
const Joi = require('joi')
// const { Op } = require('sequelize')

function deleteNoteById ({ id, userId }) {
  return sequelize.transaction()
    .then((transaction) => {
      return Note.destroy({
        where: {
          id,
          userId
        }
      }, { transaction })
        .then(result => {
          if (!result) {
            return transaction.rollback()
              .then(() => {
                throw new ServiceError({
                  message: 'Provided non-existent note id',
                  code: 'INVALID_NOTE_ID'
                })
              })
          }
          return transaction.commit()
            .then(() => {})
        })
    })
}

const validationRules = {
  userId: Joi.number()
    .integer()
    .positive()
    .required(),

  id: Joi.number()
    .integer()
    .required()
}

module.exports = { service: deleteNoteById, validationRules }
