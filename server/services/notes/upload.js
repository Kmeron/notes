const { sequelize } = require('../../db.js')
const { Note } = require('../../models/note.js')
const dumpNote = require('./dump')
const ServiceError = require('../../ServiceError.js')

function importFile (notes) {
  return sequelize.transaction().then(transaction => {
    return Note.bulkCreate(notes, { transaction })
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

module.exports = { importFile }
