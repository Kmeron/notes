const path = require('path')
const express = require('express')
const { sequelize } = require('./sequelize.js')
const cors = require('cors')
const { port } = require('./config')

const app = express()

const pathToStaticFiles = path.resolve('..', 'client', 'public')

const router = require('./router')

app
  .use(express.static(pathToStaticFiles, { extensions: ['html'] }))
  .use(express.json())
  .use(cors({ origin: '*' }))
  .use('/api/v1', router)

sequelize.sync()
  .then(() => app.listen(port, () => console.log(`App listen on port ${port}`)))
  .catch(console.log)
