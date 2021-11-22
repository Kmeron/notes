const { makeServiceRunner } = require('./makeServiceRunner')
const ServiceError = require('../ServiceError')

const create = require('../services/notes/create')
const list = require('../services/notes/list')
const remove = require('../services/notes/remove')
const update = require('../services/notes/update')
const removeAll = require('../services/notes/removeAll')
const { importFile } = require('../services/notes/upload')

module.exports = {
  list: makeServiceRunner(list, (req, res) => ({ ...res.locals, ...req.query })),
  create: makeServiceRunner(create, (req, res) => ({ ...res.locals, ...req.body })),
  delete: makeServiceRunner(remove, (req, res) => ({ ...res.locals, ...req.query })),
  update: makeServiceRunner(update, (req, res) => ({ ...res.locals, ...req.body })),
  deleteAll: makeServiceRunner(removeAll, (req, res) => ({ ...res.locals })),
  upload: (req, res) => {
    let acc = ''
    let notes = ''
    req.setEncoding('utf8')
    req.on('data', chunk => {
      req.pause()
      acc += chunk
      while (acc.includes('\n')) {
        const cutIndex = acc.lastIndexOf('\n')
        const last = acc.slice(cutIndex + 2)
        const full = acc.replace(last, '')
        acc = last
        notes += full
      }
      req.resume()
    })
    req.on('end', () => {
      const payload = notes.split('\n')
        .filter(element => element)
        .map(element => element.split(';'))
        .map(([title, text]) => ({
          title,
          text,
          ...res.locals
        }))
      importFile(payload)
        .then(result => {
          const data = result?.data ? result : { data: result }
          res.send({ ok: true, ...data })
        })
        .catch(error => {
          console.warn(error)
          if (error instanceof ServiceError) {
            res
              .status(400)
              .send({
                ok: false,
                error: { message: error.message, code: error.code, fields: error.fields }
              })
          } else {
            res
              .status(500)
              .send({
                ok: false,
                error: { message: 'Unknown server error', code: 'UNKNOWN_ERROR' }
              })
          }
        })
    })
  }
}
