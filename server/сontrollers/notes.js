const { makeServiceRunner } = require('./makeServiceRunner')

const { postNewNote, deleteAllNotes, getNotes, deleteNoteById, editNoteById } = require('../notes')

module.exports = {
  list: makeServiceRunner(getNotes, (req, res) => ({ ...res.locals, ...req.query })),
  create: makeServiceRunner(postNewNote, (req, res) => ({ ...res.locals, ...req.body })),
  delete: makeServiceRunner(deleteNoteById, (req, res) => ({ ...res.locals, ...req.query })),
  update: makeServiceRunner(editNoteById, (req, res) => ({ ...res.locals, ...req.body })),
  deleteAll: makeServiceRunner(deleteAllNotes, (req, res) => ({ ...res.locals }))
}
