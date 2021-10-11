const { connection } = require('./db.js')
const ServiceError = require('./ServiceError')

function getNotes(params = {}) { 
  const queryArguments = params.search
    ? ['SELECT * FROM notes WHERE title LIKE ? OR text LIKE ? AND userId=? ORDER BY ID DESC LIMIT ? OFFSET ?', [`%${params.search}%`, `%${params.search}%`, params.userId, +params.limit, +params.offset]]
    : ['SELECT * FROM notes WHERE userId=? ORDER BY id DESC LIMIT ? OFFSET ?', [params.userId, +params.limit, +params.offset]]
  return connection.beginTransaction()
    .then(() => connection.query(...queryArguments))
    .then(([selectResult]) =>  {
      const countArguments = params.search
      ? ['SELECT COUNT(*) FROM notes WHERE title LIKE ? OR text LIKE ? AND userId=?', [`%${params.search}%`, `%${params.search}%`, params.userId]]
      : ['SELECT COUNT(*) FROM notes WHERE userId=?', params.userId]
      return connection.query(...countArguments)
      .then(([[countResult]]) => ({selectResult, countResult}))
    })
    .then(({selectResult, countResult}) => {
      const data = selectResult.map(note => dumpNote(note))
      const meta = { limit: +params.limit, offset: +params.offset, totalCount: countResult['COUNT(*)'] }
      return connection.commit().then(() => {
        return { data, meta }
      })
    })
    .catch(error => {
      connection.rollback()
      console.log(error);
      if (['ER_PARSE_ERROR', 'ER_SP_UNDECLARED_VAR'].includes(error.code)) {
        throw new ServiceError({
          message: 'Provided invalid data for getting note',
          code: 'INVALID_DATA'
        })
      }
      throw error
    })

}

function postNewNote(note) {
  const insertData = [note.title, note.text, note.userId]
  return connection.beginTransaction()
    .then(() => connection.query('INSERT INTO notes(title, text, userId) VALUES(?, ?, ?)', insertData))
    .then(([data]) =>  {
      const selectData = [data.insertId, note.userId]
      return connection.query('SELECT * FROM notes WHERE id=? AND userId=?', selectData)
    })
    .then(([data]) => {
      return connection.commit().then(() => dumpNote(data[0]))
    })
    .catch(error => {
      connection.rollback()
      console.log(error)
      if (error.code === 'ER_PARSE_ERROR') throw new ServiceError({
        message: 'Provided invalid data for creating note',
        code: 'INVALID_DATA'
      })
      throw error
    })
}

function deleteNoteById(payload) {
  const delInfo = [payload.id, payload.userId]
  return connection.beginTransaction()
    .then(() => connection.query('DELETE FROM notes WHERE id=? AND userId=?', delInfo))
    .then(([result]) => {
      if (result.affectedRows === 0) {
        connection.rollback()
        throw new ServiceError({
          message: 'Provided non-existent note id',
          code: 'INVALID_NOTE_ID'
        }) 
      }
      return connection.commit()
    })
}

function editNoteById(payload) {
  const updateInfo = [payload.title, payload.text, payload.id, payload.userId]
  return connection.beginTransaction()
    .then(() => connection.query('UPDATE notes SET title=?, text=? WHERE id=? AND userId=?', updateInfo))
    .then(() => {
      const selectInfo = [payload.id, payload.userId]
      return connection.query('SELECT * FROM notes WHERE id=? AND userId=?', selectInfo)
    })
    .then(([note]) => {
      return connection.commit().then(() => dumpNote(note[0]))
    })
    .catch(error => {
      connection.rollback()
      console.log(error)
      if (error.code === 'ER_PARSE_ERROR') throw new ServiceError({
        message: 'Provided invalid data for editing note',
        code: 'INVALID_DATA'
      })
      throw error
    })
}

function dumpNote(note) {
  return {
    id: note.id,
    title: note.title,
    text: note.text
  }
}

function deleteAllNotes(payload) {
  const userId = payload.userId
  
  return connection.beginTransaction()
    .then(() => connection.query('DELETE FROM notes WHERE userId=?', userId))
    .then(() => connection.commit())
    .then(() => {})
    .catch(error => {
      connection.rollback()
      throw error
    })
}


module.exports = { postNewNote, getNotes, deleteNoteById, editNoteById, deleteAllNotes, }