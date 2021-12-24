const ServiceError = require('../ServiceError')
const ValidationError = require('../ValidationError')

const Joi = require('joi')

async function successResponseToClient (res, promise) {
  const result = await promise
  console.log(result)
  const data = result?.data ? result : { data: result }
  res.send({ ok: true, ...data })
}

function errorResponseToClient (res, error) {
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
}

// async function responseToClient (res, promise) {
//   try {
//     const result = await promise
//     console.log(result)
//     const data = result?.data ? result : { data: result }
//     res.send({ ok: true, ...data })
//   } catch (error) {
//     console.warn(error)
//     if (error instanceof ServiceError || error instanceof ValidationError) {
//       res
//         .status(400)
//         .send({
//           ok: false,
//           error: { message: error.message, code: error.code, fields: error.fields }
//         })
//     } else {
//       res
//         .status(500)
//         .send({
//           ok: false,
//           error: { message: 'Unknown server error', code: 'UNKNOWN_ERROR' }
//         })
//     }
//   }
// }
// promise
//   .then(result => {
//     console.log(result)
//     const data = result?.data ? result : { data: result }
//     res.send({ ok: true, ...data })
//   })
//   .catch(error => {
//     console.warn(error)
//     if (error instanceof ServiceError || error instanceof ValidationError) {
//       res
//         .status(400)
//         .send({
//           ok: false,
//           error: { message: error.message, code: error.code, fields: error.fields }
//         })
//     } else {
//       res
//         .status(500)
//         .send({
//           ok: false,
//           error: { message: 'Unknown server error', code: 'UNKNOWN_ERROR' }
//         })
//     }
//   })

function makeServiceRunner ({ service, validationRules }, dumpData) {
  return async (req, res) => {
    const payload = dumpData(req, res)
    console.log(payload)
    const schema = Joi.object(validationRules)
    try {
      const data = await schema.validateAsync(payload, { abortEarly: false })
      const promise = await service(data)
      await successResponseToClient(res, promise)
    } catch (error) {
      if (error.name === 'ValidationError') {
        // eslint-disable-next-line no-ex-assign
        error = new ValidationError({
          message: 'Invalid data provided with request',
          code: 'INVALID_DATA_ERROR',
          fields: error.details.map(e => e.path[0])
        })
      }
      errorResponseToClient(res, error)
    }
    //   const promise = Joi.object(validationRules)
    //     .validateAsync(payload, { abortEarly: false })
    //     .catch(error => {
    //       throw new ValidationError({
    //         message: 'Invalid data provided with request',
    //         code: 'INVALID_DATA_ERROR',
    //         fields: error.details.map(e => e.path[0])
    //       })
    //     })
    //     .then(service)

  //   responseToClient(res, promise)
  // }
  }
}

function verifyMailSender ({ service, validationRules }, dumpData) {
  return async (req, res) => {
    const payload = dumpData(req, res)
    console.log(payload)
    const schema = Joi.object(validationRules)
    try {
      const data = await schema.validateAsync(payload, { abortEarly: false })
      await service(data)
      res.redirect('http://localhost:3001/authorization')
    } catch (error) {
      console.log(error)
      if (error.name === 'ValidationError') {
        res.send('<html><p>Oops, Provided invalid token to activate your account</p></html>')
      } else {
        res.send(`<html><p>Oops, something has gone wrong: ${error.message}</p></html>`)
      }
    }
    // Joi.object(validationRules)
    //   .validateAsync(payload, { abortEarly: false })
    //   .then(service)
    //   .then(() => res.redirect('http://localhost:3001/authorization'))
    //   .catch(error => {
    //     console.log(error)
    //     if (error.name === 'ValidationError') {
    //       res.send('<html><p>Oops, Provided invalid token to activate your account</p></html>')
    //     } else {
    //       res.send(`<html><p>Oops, something has gone wrong: ${error.message}</p></html>`)
    //     }
    //   })
  }
}

module.exports = { makeServiceRunner, verifyMailSender }
