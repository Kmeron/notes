const bcrypt = require('bcryptjs')
const jwt = require('jwt-simple')
const { saltRounds, jwtSecret } = require('../../../config')
const { sequelize } = require('../../../sequelize.js')

async function initUser (token) {
  await sequelize.sync({ force: true })
  const user = await sequelize.model('user').create({
    email: 'lkmeronl@gmail.com',
    password: await bcrypt.hash('1111', saltRounds),
    status: 'ACTIVE'
  })
  token = jwt.encode({ userId: user.id }, jwtSecret)
  return token
}

function closeConnection () {
  sequelize.close()
}
module.exports = { initUser, closeConnection }
