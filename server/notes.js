const { sequelize } = require('./db.js')
const { Note } = require('./models/note.js')
const ServiceError = require('./ServiceError')
// const { Op } = require('sequelize')

function getNotes (params = {}) {
  return sequelize.transaction()
    .then((transaction) => {
      return Note.findAll(chooseArgument(params), { transaction })
        .then(selectResult => {
          return Note.count(chooseArgument(params), { transaction })
            .then(countResult => ({ selectResult, countResult }))
        })
        .then(result => {
          const data = result.selectResult.map(element => dumpNote(element.dataValues))
          const meta = { limit: params.limit, offset: params.offset, totalCount: result.countResult }
          return transaction.commit().then(() => ({ data, meta }))
        })
        .catch(error => {
          return transaction.rollback()
            .then(() => {
              if (['ER_PARSE_ERROR', 'ER_SP_UNDECLARED_VAR'].includes(error.code)) {
                throw new ServiceError({
                  message: 'Provided invalid data for getting note',
                  code: 'INVALID_DATA'
                })
              }
              throw error
            })
        })
    })
}

function chooseArgument (params) {
  const query = {
    where: [
      { userId: params.userId }
    ],
    order: [['id', 'DESC']],
    limit: params.limit,
    offset: params.offset
  }

  if (params.search) {
    query.where.push(sequelize.literal(`MATCH (title,text) AGAINST ('(${params.search}*) ("${params.search}")' IN BOOLEAN MODE)`)) // Sql injection
  }
  return query
}

function postNewNote ({ title, text, userId }) {
  return sequelize.transaction()
    .then((transaction) => {
      return Note.create({
        title,
        text,
        userId
      }, { transaction })
        .then((note) => {
          return transaction.commit()
            .then(() => {
              return dumpNote(note)
            })
        })
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

function editNoteById ({ title, text, id, userId }) {
  return sequelize.transaction()
    .then((transaction) => {
      return Note.update({
        title,
        text
      }, {
        where: {
          id,
          userId
        }
      }, { transaction })
        .then(() => {
          return Note.findOne({
            where: {
              id,
              userId
            }
          }, { transaction })
        })
        .then(note => {
          return transaction.commit()
            .then(() => dumpNote(note))
        })
        .catch(error => {
          return transaction.rollback()
            .then(() => {
              if (error.code === 'ER_PARSE_ERROR') {
                throw new ServiceError({
                  message: 'Provided invalid data for editing note',
                  code: 'INVALID_DATA'
                })
              }
              throw error
            })
        })
    })
}

function dumpNote (note) {
  return {
    id: note.id,
    title: note.title,
    text: note.text
  }
}

function deleteAllNotes ({ userId }) {
  return sequelize.transaction()
    .then((transaction) => {
      return Note.destroy({
        where: {
          userId
        }
      }, { transaction })
        .then(() => {
          return transaction.commit()
            .then(() => {})
        })
        .catch(error => {
          return transaction.rollback()
            .then(() => {
              throw error
            })
        })
    })
}

module.exports = { postNewNote, getNotes, deleteNoteById, editNoteById, deleteAllNotes }
