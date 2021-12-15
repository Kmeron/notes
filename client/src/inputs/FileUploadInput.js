import { useState } from 'react'
import PropTypes from 'prop-types'

function UploadFileInput ({ onClick }) {
  // State to store uploaded file
  const [file, setFile] = useState('')

  // Handles file upload event and updates state
  function handleUpload (event) {
    setFile(event.target.files[0])
  }
  // Add code here to upload file to server
  // ...

  return (
    <div id="upload-box">
      <input type="file" accept=".txt" onChange={handleUpload} />
      {
        file
          ? (
          <button onClick={() => onClick(file).then(() => setFile(''))}>Send</button>
            )
          : (
        <p/>
            )
      }

    </div>
  )
}

UploadFileInput.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default UploadFileInput
