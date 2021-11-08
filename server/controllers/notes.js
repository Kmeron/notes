const { makeServiceRunner } = require('./makeServiceRunner')

const create = require('../services/notes/create')
const list = require('../services/notes/list')
const remove = require('../services/notes/remove')
const update = require('../services/notes/update')
const removeAll = require('../services/notes/removeAll')

module.exports = {
  list: makeServiceRunner(list, (req, res) => ({ ...res.locals, ...req.query })),
  create: makeServiceRunner(create, (req, res) => ({ ...res.locals, ...req.body })),
  delete: makeServiceRunner(remove, (req, res) => ({ ...res.locals, ...req.query })),
  update: makeServiceRunner(update, (req, res) => ({ ...res.locals, ...req.body })),
  deleteAll: makeServiceRunner(removeAll, (req, res) => ({ ...res.locals }))
}
