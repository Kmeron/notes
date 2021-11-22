const express = require('express')
const router = express.Router()

const { checkSession } = require('./middlewares')
const controllers = require('./controllers')

// router.use((req, res, next) => {
// req.query = Object.fromEntries(Object.entries(req.query).map(([key, value]) => {
//   if (!isNaN(value)) {
//     value = +value
//   }
//   return [key, value]
// })
// )
//   next()
// })

router
  .route('/notes')
  .post(checkSession, controllers.notes.create)
  .get(checkSession, controllers.notes.list)
  .delete(checkSession, controllers.notes.delete)
  .put(checkSession, controllers.notes.update)

router
  .route('/notes/delete-all')
  .delete(checkSession, controllers.notes.deleteAll)

router
  .route('/authorization')
  .post(controllers.users.authorize)

router
  .route('/registration')
  .post(controllers.users.create)

router
  .route('/authentication')
  .get(checkSession, controllers.users.verify)

router
  .route('/upload')
  .post(checkSession, controllers.notes.upload)
  // .post(checkSession, (req, res, next) => {
  //   let acc = ''
  //   let notes = ''
  //   req.setEncoding('utf8')
  //   req.on('data', chunk => {
  //     req.pause()
  //     acc += chunk
  //     while (acc.includes('\n')) {
  //       const cutIndex = acc.lastIndexOf('\n')
  //       console.log(cutIndex)
  //       const last = acc.slice(cutIndex + 2)
  //       const full = acc.replace(last, '')
  //       acc = last
  //       notes += full
  //     }
  //     req.resume()
  //   })
  //   req.on('end', () => {
  //     req.body = { notes }
  //     next()
  //   })
  // }, controllers.notes.upload)//

module.exports = router
