import './App.css'
import FindButton from './buttons/Find'
import SignOut from './buttons/SignOut'
import FindInput from './inputs/FindInput'
import CreateTitleInput from './inputs/CreateTitleInput'
import CreateTextInput from './inputs/CreateTextInput'
import Create from './buttons/Create'
import DeleteAll from './buttons/DeleteAll'
import UploadFileInput from './inputs/FileUploadInput'

import { useState, useEffect } from 'react'
import getNotes from './api/getNotes'
import createNote from './api/createNote'
import deleteAllNotes from './api/deleteAllNotes'
import saveNote from './api/saveNote'
import deleteNote from './api/deleteNote'
import uploadFile from './api/uploadFile'

import PageButtons from './PageButtons'
import NoteDivs from './NoteDivs'

function App () {
  const [search, setSearchValue] = useState('')
  const [notes, setNotes] = useState([])
  const [noteData, setNoteData] = useState({ title: '', text: '' })
  const [totalNotes, setTotalNotes] = useState(0)
  const [offset, setOffset] = useState(0)

  const limit = 5

  useEffect(() => getNotes({ limit, offset, search })
    .then(({ data, meta }) => {
      setNotes(data)
      setTotalNotes(meta.totalCount)
    })
    .catch(error => alert(error.message)), [offset])

  const handleOnClickCreateNoteButton = () => createNote(noteData)
    .then(() => {
      setNoteData({ title: '', text: '' })
      return getNotes({ limit, offset: 0 })
    })
    .then(({ data, meta }) => {
      setNotes(data)
      setTotalNotes(meta.totalCount)
      setOffset(meta.offset)
    })
    .catch(error => alert(error.message))

  const handleOnClickSaveNoteButton = (payload) => saveNote(payload)
    .then(({ data }) => {
      const editedIndex = notes.findIndex(note => note.id === data.id)
      const editedArr = [...notes]
      editedArr.splice(editedIndex, 1, data)
      setNotes(editedArr)
    })
    .catch(error => alert(error.message))

  const handleOnClickDeleteNoteButton = (noteId) => deleteNote(noteId)
    .then(() => getNotes({ limit, offset, search }))
    .then(({ data, meta }) => {
      if (meta.offset >= meta.totalCount) {
        return getNotes({ limit, offset: offset - 5, search })
          .then(({ data, meta }) => {
            setNotes(data)
            setTotalNotes(meta.totalCount)
            setOffset(meta.offset)
          })
      }
      setNotes(data)
      setTotalNotes(meta.totalCount)
    })
    .catch(error => alert(error.message))

  const handleOnClickDeleteAllNotes = () => {
    if (window.confirm('All your notes will be removed!')) {
      deleteAllNotes()
        .then(() => {
          setNotes([])
          setTotalNotes(0)
          setOffset(0)
        })
        .catch(error => alert(error.message))
    }
  }

  const handleOnClickSendFileButton = (file) => {
    return uploadFile(file)
      .then(() => getNotes({ limit, offset: 0 }))
      .then(({ data, meta }) => {
        setNotes(data)
        setOffset(meta.offset)
        setTotalNotes(meta.totalCount)
      })
      .catch(error => alert(error.message))
  }

  const handleOnClickPageButton = (params) => {
    setOffset(params.offset)
  }

  const handleOnClickFindButton = (search) => getNotes({ limit, offset: 0, search })
    .then(({ data, meta }) => {
      setNotes(data)
      setTotalNotes(meta.totalCount)
      setOffset(0)
    })

  return (
    <div className="App">
      <SignOut />

      <div id="search-block">
        <FindInput onChange={setSearchValue}/>
        <FindButton onClick={() => handleOnClickFindButton(search)}/>
      </div>

      <div id="create-block">

        <p type="text">Title:</p>
        <CreateTitleInput value={noteData.title} onChange={current => setNoteData(previous => ({ ...previous, ...current }))}/>

        <p type="text">Text:</p>
        <CreateTextInput value={noteData.text} onChange={current => setNoteData(previous => ({ ...previous, ...current }))}/>

        <div id="create-buttons">

          <Create onClick={() => handleOnClickCreateNoteButton()}/>
          <DeleteAll onClick={() => handleOnClickDeleteAllNotes()}/>
          <UploadFileInput onClick={file => handleOnClickSendFileButton(file)} />

        </div>

        <NoteDivs notes={notes}
          saveFn={note => handleOnClickSaveNoteButton(note)}
          deleteFn={noteId => handleOnClickDeleteNoteButton(noteId)}/>

      </div>

      <PageButtons totalCount={totalNotes} limit={limit} offset={offset} onClick={params => handleOnClickPageButton(params)}/>
    </div>
  )
}

export default App
