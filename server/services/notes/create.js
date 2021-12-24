const { sequelize } = require('../../db.js')
const { Note } = require('../../models/note.js')
const ServiceError = require('../../ServiceError.js')
const Joi = require('joi')
const dumpNote = require('./dump')

async function postNewNote ({ title, text, userId }) {
  const transaction = await sequelize.transaction()

  try {
    const note = await Note.create({ title, text, userId }, { transaction })
    await transaction.commit()
    return dumpNote(note)
  } catch (error) {
    await transaction.rollback()
    if (error.code === 'ER_PARSE_ERROR') {
      throw new ServiceError({
        message: 'Provided invalid data for creating note',
        code: 'INVALID_DATA'
      })
    }
    throw error
  }
  // return sequelize.transaction().then((transaction) => {
  //   return Note.create({
  //     title,
  //     text,
  //     userId
  //   }, { transaction })
  //     .then((note) => {
  //       return transaction.commit()
  //         .then(() => {
  //           return dumpNote(note)
  //         })
  //     })
  //     .catch(error => {
  //       return transaction.rollback()
  //         .then(() => {
  //           if (error.code === 'ER_PARSE_ERROR') {
  //             throw new ServiceError({
  //               message: 'Provided invalid data for creating note',
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

  title: Joi.string(),

  text: Joi.string()
}

module.exports = { service: postNewNote, validationRules }
