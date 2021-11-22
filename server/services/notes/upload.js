const { sequelize } = require('../../db.js')
const { Note } = require('../../models/note.js')
const Joi = require('joi')
const dumpNote = require('./dump')
const ServiceError = require('../../ServiceError.js')

function importFile ({ data, userId }) {
  const notesArr = data.toString()
    .split('\n')
    .filter(element => element)
    .map(element => element.split(';'))
    .map(([title, text]) => ({
      title,
      text,
      userId
    }))

  console.log(notesArr)
  return sequelize.transaction().then(transaction => {
    return Note.bulkCreate(notesArr, { transaction })
      .then(notes => transaction.commit()
        .then(() => {
          return notes.map(note => dumpNote(note))
        }))
      .catch(error => {
        return transaction.rollback()
          .then(() => {
            if (error.code === 'ER_PARSE_ERROR') {
              throw new ServiceError({
                message: 'Provided invalid data for creating note',
                code: 'INVALID_DATA'
              })
            }
            throw error
          })
      })
  })
}

const validationRules = {
  name: Joi.any(),
  data: Joi.any(),
  size: Joi.any(),
  encoding: Joi.any(),
  tempFilePath: Joi.any(),
  truncated: Joi.any(),
  md5: Joi.any(),
  mv: Joi.any(),
  mimetype: Joi.string()
    .valid('text/plain')
    .required(),
  userId: Joi.number()
    .integer()
    .positive()
    .required()
}

module.exports = { service: importFile, validationRules }
