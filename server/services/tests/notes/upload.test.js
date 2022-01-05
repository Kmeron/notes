const fetch = require('node-fetch')
const { port } = require('../../../config')
const { initUser, closeConnection } = require('./utils')
const fs = require('fs/promises')
const path = require('path')
const filePath = path.join(__dirname, 'example.txt')

let token
let file

beforeAll(async () => {
  token = await initUser(token)
  file = await fs.readFile(filePath)
})

afterAll(() => {
  closeConnection()
})

async function uploadNotes (file) {
  const response = await fetch(`http://localhost:${port}/api/v1/upload`, {
    method: 'POST',
    body: file,
    headers: {
      'Content-Type': 'text/plain',
      Authorization: token
    }
  })
  const result = response.json()
  return result
}

test('testing uploading a file with notes', async () => {
  const result = await uploadNotes(file)
  console.log(result)
  expect(result.ok).toBeTrue()
  expect(result.data).toEqual(expect.arrayContaining([
    expect.objectContaining({
      id: expect.any(Number),
      title: expect.any(String),
      text: expect.any(String)
    })
  ]))
})
