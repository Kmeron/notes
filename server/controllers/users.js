const { makeServiceRunner, verifyMailSender } = require('./makeServiceRunner')

const create = require('../services/users/create')
const authorize = require('../services/users/authorize')
const verify = require('../services/users/verify')

module.exports = {
  create: makeServiceRunner(create, (req, res) => ({ ...req.body })),
  authorize: makeServiceRunner(authorize, (req, res) => ({ ...req.body })),
  verify: verifyMailSender(verify, (req, res) => ({ ...res.locals }))
}
