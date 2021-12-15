import { useState } from 'react'
import PropTypes from 'prop-types'
import EditTitleInput from './inputs/EditTitleInput'
import EditTextInput from './inputs/EditTextInput'
import Save from './buttons/Save'
import Edit from './buttons/Edit'
import Delete from './buttons/Delete'

function NoteDivs ({ notes, saveFn, deleteFn }) {
  const [editNote, setEditNote] = useState(null)

  return (
    <div id="notes-area">
      {notes.map(note =>
        editNote?.id === note.id
          ? (
          <div key={note.id} >
            <EditTitleInput value={editNote.title} onChange={current => setEditNote(previous => ({ ...previous, ...current }))}/>
            <EditTextInput value={editNote.text} onChange={current => setEditNote(previous => ({ ...previous, ...current }))}/>
            <Save onClick={() => saveFn(editNote).then(() => setEditNote(null))} />
          </div>
            )
          : (
          <div key={note.id}>
            <p>{note.title}</p>
            <p>{note.text}</p>
            <Edit onClick={() => setEditNote(note)}/>
            <Delete onClick={() => deleteFn(note.id)}/>
          </div>
            )
      )}
    </div>
  )
}

NoteDivs.propTypes = {
  notes: PropTypes.array.isRequired,
  saveFn: PropTypes.func.isRequired,
  deleteFn: PropTypes.array.isRequired
}

export default NoteDivs
