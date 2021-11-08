const ServiceError = require('../ServiceError')
const ValidationError = require('../ValidationError')

const Joi = require('joi')

function responseToClient (res, promise) {
  promise
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
            error: { message: error.message, code: error.code }
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
    try {
      const payload = dumpData(req, res)
      console.log(payload)
      const validPayload = Joi.object(validationRules).validate(payload, { abortEarly: false })

      if (validPayload.error) {
        console.log(validPayload.error.details)
        throw new ValidationError({
          message: validPayload.error.details.map(e => e.message),
          code: 'INVALID_DATA_ERROR',
          path: validPayload.error.details.map(e => e.path[0])
        })
      }

      responseToClient(res, service({ ...validPayload.value }))
    } catch (error) {
      console.log(error)
      res.send({
        ok: false,
        error: { message: error.message, code: error.code, path: error.path }
      })
    }
  }
}

function verifyMailSender ({ service, validationRules }, dumpData) {
  return (req, res) => {
    try {
      const payload = dumpData(req, res)
      console.log(payload)
      const validPayload = Joi.object(validationRules).validate(payload, { abortEarly: false })

      if (validPayload.error) {
        console.log(validPayload.error.details)
        throw new ValidationError({
          message: validPayload.error.details.map(e => e.message),
          code: 'INVALID_DATA_ERROR',
          path: validPayload.error.details.map(e => e.path[0])
        })
      }

      service(payload)
        .then(() => res.redirect('/authorization'))
        .catch(() => res.send('<html><p>You have already verified your email!</p></html>'))
    } catch (error) {
      console.log(error)
      res.send(`<html><p>Oops, something has gone wrong: ${error.message}</p></html>`)
    }
  }
}

module.exports = { makeServiceRunner, verifyMailSender }
