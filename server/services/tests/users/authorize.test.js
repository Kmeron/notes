const bcrypt = require('bcryptjs')
const { sequelize } = require('../../../sequelize.js')
const { port, saltRounds } = require('../../../config')
const fetch = require('node-fetch')

const user = {
  email: 'lkmeronl@gmail.com',
  password: '1111'
}

async function createUser () {
  await sequelize.sync({ force: true })
  await sequelize.model('user').create({
    email: user.email,
    password: await bcrypt.hash(user.password, saltRounds),
    status: 'ACTIVE'
  })
}

async function authorizeUser (payload) {
  const response = await fetch(`http://localhost:${port}/api/v1/authorization`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  })
  const result = response.json()
  return result
}

beforeAll(async () => {
  await createUser()
})

afterAll(() => {
  sequelize.close()
})

test('Testing user authorization', async () => {
  const result = await authorizeUser(user)
  console.log(result)
  expect(result.ok).toBeTrue()
  expect(result.data).toMatchObject({
    jwt: expect.any(String)
  })
})
