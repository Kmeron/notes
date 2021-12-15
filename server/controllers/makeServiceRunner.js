const ServiceError = require('../ServiceError')
const ValidationError = require('../ValidationError')

const Joi = require('joi')

function responseToClient (res, promise) {
  promise
    .then(result => {
      console.log(result)
      const data = result?.data ? result : { data: result }
      res.send({ ok: true, ...data })
    })
    .catch(error => {
      console.warn(error)
      if (error instanceof ServiceError || error instanceof ValidationError) {
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
}

function makeServiceRunner ({ service, validationRules }, dumpData) {
  return (req, res) => {
    const payload = dumpData(req, res)
    console.log(payload)
    const promise = Joi.object(validationRules)
      .validateAsync(payload, { abortEarly: false })
      .catch(error => {
        throw new ValidationError({
          message: 'Invalid data provided with request',
          code: 'INVALID_DATA_ERROR',
          fields: error.details.map(e => e.path[0])
        })
      })
      .then(service)

    responseToClient(res, promise)
  }
}

function verifyMailSender ({ service, validationRules }, dumpData) {
  return (req, res) => {
    const payload = dumpData(req, res)
    console.log(payload)
    Joi.object(validationRules)
      .validateAsync(payload, { abortEarly: false })
      .catch(error => {
        console.log(error)
        throw new ValidationError({
          message: 'Provided invalid token to activate your account',
          code: 'INVALID_DATA_ERROR',
          path: error.details.map(e => e.path[0])
        })
      })
      .then(service)
      .then(() => res.redirect('/authorization'))
      .catch(error => {
        if (error instanceof ValidationError) {
          res.send(`<html><p>Oops, ${error.message}</p></html>`)
        }
        res.send(`<html><p>Oops, something has gone wrong: ${error.message}</p></html>`)
      })
  }
}

module.exports = { makeServiceRunner, verifyMailSender }
