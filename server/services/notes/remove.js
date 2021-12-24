const { sequelize } = require('../../db.js')
const { Note } = require('../../models/note.js')
const ServiceError = require('../../ServiceError')
const Joi = require('joi')
// const { Op } = require('sequelize')

async function deleteNoteById ({ id, userId }) {
  const transaction = await sequelize.transaction()

  try {
    const result = await Note.destroy({
      where: {
        id,
        userId
      }
    }, { transaction })

    if (!result) {
      throw new ServiceError({
        message: 'Provided non-existent note id',
        code: 'INVALID_NOTE_ID'
      })
    }
    await transaction.commit()
    return {}
  } catch (error) {
    await transaction.rollback()
    throw error
  }
  // return sequelize.transaction().then((transaction) => {
  //   return Note.destroy({
  //     where: {
  //       id,
  //       userId
  //     }
  //   }, { transaction })
  //     .then(result => {
  //       if (!result) {
  //         return transaction.rollback()
  //           .then(() => {
  //             throw new ServiceError({
  //               message: 'Provided non-existent note id',
  //               code: 'INVALID_NOTE_ID'
  //             })
  //           })
  //       }
  //       return transaction.commit()
  //         .then(() => {})
  //     })
  // })
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
