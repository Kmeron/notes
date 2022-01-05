const dumpNote = require('./dump')

describe('testing dumpNote', () => {
  const note = {
    id: 1,
    title: 'title',
    text: 'text'
  }

  test('dumpNote have to return object with three keys', () => {
    expect(dumpNote(note)).toEqual({
      id: expect.any(Number),
      title: expect.any(String),
      text: expect.any(String)
    })
  })
})
