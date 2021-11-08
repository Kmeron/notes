function dumpNote (note) {
  return {
    id: note.id,
    title: note.title,
    text: note.text
  }
}

module.exports = dumpNote
