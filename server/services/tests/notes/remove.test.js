const fetch = require('node-fetch')
const { port } = require('../../../config')
const { initUser, closeConnection } = require('./utils')

let token

const notes = [
  { title: 'blah', text: 'blah blah' },
  { title: 'title', text: 'text' },
  { title: 'nigga', text: 'nigga' },
  { title: 'New Year', text: '2022' },
  { title: 'Iphone', text: 'X' },
  { title: 'blah', text: 'blah blah' },
  { title: 'title', text: 'text' },
  { title: 'nigga', text: 'nigga' },
  { title: 'New Year', text: '2022' },
  { title: 'Iphone', text: 'X' }
]

async function setupNotes (note) {
  await fetch(`http://localhost:${port}/api/v1/notes`, {
    method: 'POST',
    body: JSON.stringify(note),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    }
  })
}

beforeAll(async () => {
  token = await initUser(token)
  await notes.forEach(note => setupNotes(note))
  console.log('setup finished')
})

afterAll(() => {
  closeConnection()
})

const params = new URLSearchParams({ id: Math.floor(Math.random() * 11) }).toString()

async function deleteNoteById (params) {
  const response = await fetch(`http://localhost:${port}/api/v1/notes?` + params, {
    method: 'DELETE',
    headers: {
      Authorization: token
    }
  })
  const result = response.json()
  return result
}

test('delete one note by note id', async () => {
  const result = await deleteNoteById(params)
  console.log(result)
  expect(result.ok).toBeTrue()
  expect(result.data).toBe({})
})
