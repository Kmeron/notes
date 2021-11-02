const path = require('path')
const express = require('express')
const { sequelize } = require('./sequelize.js')

const app = express()

const pathToStaticFiles = path.resolve('client', 'public')

const router = require('./router')

app
  .use(express.static(pathToStaticFiles, { extensions: ['html'] }))
  .use(express.json())
  .use('/api/v1', router)

sequelize.sync()
  .then(() => app.listen(3000, () => console.log('App listen on port 3000')))
  .catch(console.log)
