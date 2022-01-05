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

async function deleteAllNotes () {
  const response = await fetch(`http://localhost:${port}/api/v1/notes/delete-all`, {
    method: 'Delete',
    headers:
    { Authorization: token }
  })
  const result = response.json()
  return result
}

test('Testing deleting of all notes', async () => {
  const result = await deleteAllNotes()
  console.log(result)
  expect(result.ok).toBeTrue()
  expect(result.data).toEqual({})
})
