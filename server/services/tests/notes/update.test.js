const fetch = require('node-fetch')
const { port } = require('../../../config')
const { initUser, closeConnection } = require('./utils')

let token

const note = {
  title: 'blah',
  text: 'blah blah'
}

const editedNote = {
  title: 'edited title',
  text: 'edited text'
}

let id

beforeAll(async () => {
  token = await initUser(token)
  const { data } = await setupNote(note)
  id = data.id
  console.log('setupNote done!')
})

afterAll(() => {
  closeConnection()
})

async function setupNote (note) {
  const response = await fetch(`http://localhost:${port}/api/v1/notes`, {
    method: 'POST',
    body: JSON.stringify(note),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    }
  })
  const result = response.json()
  return result
}

async function updateNote (payload) {
  const body = await fetch(`http://localhost:${port}/api/v1/notes`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    }
  })
  const response = body.json()
  return response
}

test('updating note', async () => {
  const result = await updateNote({ id, ...editedNote })
  console.log(result)
  expect(result).toMatchObject({
    ok: true,
    data: {
      id: id,
      ...editedNote
    }
  })
})
