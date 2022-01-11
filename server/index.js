const path = require('path')
const express = require('express')
const { sequelize } = require('./sequelize.js')
const cors = require('cors')
const { port } = require('./config')

const app = express()

const pathToStaticFiles = path.resolve('..', 'client', 'build')

const router = require('./router')

app
  .use(express.json())
  .use(cors({ origin: '*' }))
  .use('/api/v1', router)
  .use(express.static(pathToStaticFiles))
  .get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
  })

sequelize.sync()
  .then(() => app.listen(port, () => console.log(`App listen on port ${port}`)))
  .catch(console.log)
