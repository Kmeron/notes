const path = require('path')
const express = require('express')
const {sequelize} = require('./sequelize.js')
const {checkSession} = require('./middlewares')

const controllers = require('./сontrollers')

const app = express()

const pathToStaticFiles = path.resolve('client', 'public')

const router = require('./router')

app
    .use(express.static(pathToStaticFiles, { extensions: ['html'] }))
    .use(express.json())
    .use('/api/v1', router)
    // .post('/notes', checkSession, controllers.notes.create)
    // .get('/notes', checkSession, controllers.notes.list)
    // .delete('/notes', checkSession, controllers.notes.delete)
    // .put('/notes', checkSession, controllers.notes.update)
    // .delete('/notes/delete-all', checkSession, controllers.notes.deleteAll)
    // .post('/registration', controllers.users.create)
    // .post('/authorization', controllers.users.authorize)
    // .get('/authentication', checkSession, controllers.users.verify)

sequelize.sync()
    .then(() => app.listen(3000, () => console.log('App listen on port 3000')))
    .catch(console.log)
