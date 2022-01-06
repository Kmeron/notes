const fetch = require('node-fetch')
const { sequelize } = require('../../../sequelize.js')
const jwt = require('jwt-simple')
const { port, saltRounds, jwtSecret } = require('../../../config')
const bcrypt = require('bcryptjs')

let token

async function createUser () {
  const user = await sequelize.model('user').create({
    email: 'lkmeronl@gmail.com',
    password: await bcrypt.hash('1111', saltRounds),
    status: 'PENDING'
  })
  token = jwt.encode({ userId: user.id }, jwtSecret)
}

async function verifyUser () {
  const params = new URLSearchParams({ token: token }).toString()
  const { status } = await fetch(`http://localhost:${port}/api/v1/authentication?` + params, {
    redirect: 'manual'
  })
  return status
}

beforeAll(async () => {
  await sequelize.sync({ force: true })
  await createUser()
  console.log(token)
  console.log('Done!')
})

test('account activation', async () => {
  const result = await verifyUser()
  console.log(result)
  expect(result).toBe(302)
})

afterAll(() => {
  sequelize.close()
})
