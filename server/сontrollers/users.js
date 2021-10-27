const {makeServiceRunner, verifyMailSender} = require('./makeServiceRunner')

const {createUser, authUser, verifyUser} = require('../users')

module.exports = {
    create: makeServiceRunner(createUser, (req, res) => ({...req.body})),
    authorize: makeServiceRunner(authUser, (req, res) => ({...req.body})),
    verify: verifyMailSender(verifyUser, (req, res) => ({...res.locals}))
}