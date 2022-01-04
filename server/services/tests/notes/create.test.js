const fetch = require('node-fetch')
const { port } = require('../../../config')
const { initUser, closeConnection } = require('./utils')

let token

beforeAll(async () => {
  token = await initUser(token)
})

afterAll(() => {
  closeConnection()
})

const noteBody = {
  title: 'title',
  text: 'text'
}

test('Adding note', async () => {
  const result = await createNote(noteBody)
  console.log(result)
  expect(result.ok).toBeTrue()
  expect(result.data).toMatchObject({
    id: expect.any(Number),
    ...noteBody
  })
})

async function createNote (requestBody) {
  const response = await fetch(`http://localhost:${port}/api/v1/notes`, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    }
  })
  const body = response.json()
  return body
}
