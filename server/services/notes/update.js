const { sequelize } = require('../../db.js')
const { Note } = require('../../models/note.js')
const ServiceError = require('../../ServiceError')
const dumpNote = require('./dump')
const Joi = require('joi')
// const { Op } = require('sequelize')

async function editNoteById ({ title, text, id, userId }) {
  const transaction = await sequelize.transaction()

  try {
    await Note.update({
      title,
      text
    }, {
      where: {
        id,
        userId
      }
    }, { transaction })

    const note = await Note.findOne({
      where: {
        id,
        userId
      }
    }, { transaction })

    await transaction.commit()

    return dumpNote(note)
  } catch (error) {
    if (error.code === 'ER_PARSE_ERROR') {
      throw new ServiceError({
        message: 'Provided invalid data for editing note',
        code: 'INVALID_DATA'
      })
    }
    throw error
  }

  // return sequelize.transaction().then((transaction) => {
  //   return Note.update({
  //     title,
  //     text
  //   }, {
  //     where: {
  //       id,
  //       userId
  //     }
  //   }, { transaction })
  //     .then(() => {
  //       return Note.findOne({
  //         where: {
  //           id,
  //           userId
  //         }
  //       }, { transaction })
  //     })
  //     .then(note => {
  //       return transaction.commit()
  //         .then(() => dumpNote(note))
  //     })
  //     .catch(error => {
  //       return transaction.rollback()
  //         .then(() => {
  //           if (error.code === 'ER_PARSE_ERROR') {
  //             throw new ServiceError({
  //               message: 'Provided invalid data for editing note',
  //               code: 'INVALID_DATA'
  //             })
  //           }
  //           throw error
  //         })
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
    .positive()
    .required(),

  title: Joi.string(),

  text: Joi.string()
}

module.exports = { service: editNoteById, validationRules }
