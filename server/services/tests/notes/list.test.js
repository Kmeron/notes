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

const params = { limit: 5, offset: 0 }

const requestParams = new URLSearchParams(params).toString()

async function getNotes (requestParams) {
  const response = await fetch(`http://localhost:${port}/api/v1/notes?` + requestParams, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    }
  })
  const result = response.json()
  return result
}

test('Get Notes', async () => {
  const result = await getNotes(requestParams)
  console.log(result)
  expect(result.ok).toBeTrue()
  expect(result.data).toBeArrayOfSize(params.limit)
  expect(result.data).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
        text: expect.any(String)
      })
    ]))
  expect(result.meta).toMatchObject({
    ...params,
    totalCount: expect.any(Number)
  })
})
