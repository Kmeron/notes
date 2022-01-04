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

beforeAll(async () => {
  token = await initUser(token)
  await notes.forEach(note => setupNotes(note))
  console.log('setupNotes done!')
})

afterAll(() => {
  closeConnection()
})

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

async function updateNote (payload) {
  const body = await fetch(`http://localhost:${port}/api/v1/notes`, {
    method: 'UPDATE',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    }
  })
  const response = body.json()
  return response
}
