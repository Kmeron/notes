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

import { useNavigate } from 'react-router-dom'

function App () {
  const [search, setSearchValue] = useState('')
  const [notes, setNotes] = useState([])
  const [noteData, setNoteData] = useState({ title: '', text: '' })
  const [totalNotes, setTotalNotes] = useState(0)
  const [offset, setOffset] = useState(0)

  const navigate = useNavigate()

  const limit = 5

  useEffect(() => {
    if (!localStorage.getItem('jwt')) {
      alert('Please, authorize!')
      return navigate('/authorization')
    }
    getNotes({ limit, offset, search })
      .then(({ data, meta }) => {
        setNotes(data)
        setTotalNotes(meta.totalCount)
      })
      .catch(error => alert(error.message))
  }, [offset])

  const handleOnClickCreateNoteButton = async () => {
    if (!noteData.title || !noteData.text) return

    try {
      await createNote(noteData)
      setNoteData({ title: '', text: '' })
      const { data, meta } = await getNotes({ limit, offset: 0 })
      setNotes(data)
      setTotalNotes(meta.totalCount)
      setOffset(0)
    } catch (error) {
      alert(error.message)
    }

    // createNote(noteData)
    //   .then(() => {
    //     setNoteData({ title: '', text: '' })
    //     return getNotes({ limit, offset: 0 })
    //   })
    //   .then(({ data, meta }) => {
    //     setNotes(data)
    //     setTotalNotes(meta.totalCount)
    //     setOffset(meta.offset)
    //   })
    //   .catch(error => alert(error.message))
  }

  const handleOnClickSaveNoteButton = async (payload) => {
    if (!payload.title || !payload.text) return
    try {
      const { data } = await saveNote(payload)
      const editedIndex = notes.findIndex(note => note.id === data.id)
      const editedArr = [...notes]
      editedArr.splice(editedIndex, 1, data)
      setNotes(editedArr)
    } catch (error) {
      alert(error.message)
    }
    // return saveNote(payload)
    //   .then(({ data }) => {
    //     const editedIndex = notes.findIndex(note => note.id === data.id)
    //     const editedArr = [...notes]
    //     editedArr.splice(editedIndex, 1, data)
    //     setNotes(editedArr)
    //   })
    //   .catch(error => alert(error.message))
  }

  const handleOnClickDeleteNoteButton = async (noteId) => {
    try {
      await deleteNote(noteId)
      const { data, meta } = await getNotes({ limit, offset, search })
      if (meta.offset >= meta.totalCount && meta.totalCount !== 0) {
        return setOffset(offset - 5)
      }
      setNotes(data)
      setTotalNotes(meta.totalCount)
    } catch (error) {
      alert(error.message)
    }
  // deleteNote(noteId)
  //   .then(() => getNotes({ limit, offset, search }))
  //   .then(({ data, meta }) => {
  //     if (meta.offset >= meta.totalCount) {
  //       return getNotes({ limit, offset: offset - 5, search })
  //         .then(({ data, meta }) => {
  //           setNotes(data)
  //           setTotalNotes(meta.totalCount)
  //           setOffset(meta.offset)
  //         })
  //     }
  //     setNotes(data)
  //     setTotalNotes(meta.totalCount)
  //   })
  //   .catch(error => alert(error.message))
  }

  const handleOnClickDeleteAllNotes = async () => {
    if (window.confirm('All your notes will be removed!')) {
      try {
        await deleteAllNotes()
        setNotes([])
        setTotalNotes(0)
        setOffset(0)
      } catch (error) {
        alert(error.message)
      }
      // deleteAllNotes()
      //   .then(() => {
      //     setNotes([])
      //     setTotalNotes(0)
      //     setOffset(0)
      //   })
      //   .catch(error => alert(error.message))
    }
  }

  const handleOnClickSendFileButton = async (file) => {
    try {
      await uploadFile(file)
      const { data, meta } = await getNotes({ limit, offset: 0 })
      setNotes(data)
      setTotalNotes(meta.totalCount)
      setOffset(meta.offset)
    } catch (error) {
      alert(error.message)
    }
    // return uploadFile(file)
    //   .then(() => getNotes({ limit, offset: 0 }))
    //   .then(({ data, meta }) => {
    //     setNotes(data)
    //     setOffset(meta.offset)
    //     setTotalNotes(meta.totalCount)
    //   })
    //   .catch(error => alert(error.message))
  }

  const handleOnClickPageButton = (params) => {
    setOffset(params.offset)
  }

  const handleOnClickFindButton = async (search) => {
    if (!search) return
    const { data, meta } = await getNotes({ limit, offset: 0, search })
    setNotes(data)
    setTotalNotes(meta.totalCount)
    setOffset(0)
    // getNotes({ limit, offset: 0, search })
    //   .then(({ data, meta }) => {
    //     setNotes(data)
    //     setTotalNotes(meta.totalCount)
    //     setOffset(0)
    //   })
  }

  const handleOnClickSignOutButton = () => {
    localStorage.removeItem('jwt')
    navigate('/authorization')
  }

  return (
    <div className="App">
      <SignOut onClick={() => handleOnClickSignOutButton()}/>

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
