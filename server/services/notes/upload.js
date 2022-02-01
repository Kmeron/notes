const { sequelize } = require('../../db.js')
const { Note } = require('../../models/note.js')
const dumpNote = require('./dump')
const ServiceError = require('../../ServiceError.js')

async function importFile (notes) {
  console.log(notes)
  const transaction = await sequelize.transaction()

  try {
    const createdNotes = await Note.bulkCreate(notes, { transaction })

    await transaction.commit()
    return createdNotes.map(note => dumpNote(note))
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
}

module.exports = { importFile }
