const { sequelize } = require('../../db.js')
const { Note } = require('../../models/note.js')
const Joi = require('joi')

async function deleteAllNotes ({ userId }) {
  const transaction = await sequelize.transaction()

  try {
    await Note.destroy({
      where: {
        userId
      },
      transaction
    })
    await transaction.commit()
    return {}
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

const validationRules = {
  userId: Joi.number()
    .integer()
    .positive()
    .required()
}

module.exports = { service: deleteAllNotes, validationRules }
