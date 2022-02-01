const { sequelize } = require('../../db.js')
const { Note } = require('../../models/note.js')
const ServiceError = require('../../ServiceError')
const dumpNote = require('./dump')
const Joi = require('joi')

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
      },
      transaction
    })

    const note = await Note.findOne({
      where: {
        id,
        userId
      },
      transaction
    })

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
