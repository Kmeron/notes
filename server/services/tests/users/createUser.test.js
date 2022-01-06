const fetch = require('node-fetch')
const { sequelize } = require('../../../sequelize.js')
const { port } = require('../../../config')

const newUser = {
  email: 'lkmeronl@gmail.com',
  password: '1111'
}

async function createUser (user) {
  const response = await fetch(`http://localhost:${port}/api/v1/registration`, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: { 'Content-Type': 'application/json' }
  })
  const result = response.json()
  return result
}

beforeAll(async () => {
  await sequelize.sync({ force: true })
})

afterAll(() => {
  sequelize.close()
})

test('new user creation', async () => {
  const result = await createUser(newUser)
  console.log(result)
  expect(result.ok).toBeTrue()
  expect(result.data).toMatchObject({
    email: expect.any(String)
  })
})
