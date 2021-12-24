const { sequelize } = require('../../db.js')
const { Note } = require('../../models/note.js')
const Joi = require('joi')

async function deleteAllNotes ({ userId }) {
  const transaction = await sequelize.transaction()

  try {
    await Note.destroy({
      where: {
        userId
      }
    }, { transaction })
    await transaction.commit()
    return {}
  } catch (error) {
    await transaction.rollback()
    throw error
  }
  // return sequelize.transaction().then((transaction) => {
  //   return Note.destroy({
  //     where: {
  //       userId
  //     }
  //   }, { transaction })
  //     .then(() => {
  //       return transaction.commit()
  //         .then(() => {})
  //     })
  //     .catch(error => {
  //       return transaction.rollback()
  //         .then(() => {
  //           throw error
  //         })
  //     })
  // })
}

const validationRules = {
  userId: Joi.number()
    .integer()
    .positive()
    .required()
}

module.exports = { service: deleteAllNotes, validationRules }
