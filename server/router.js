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

module.exports = router
