import { useState } from "react";

export default function UploadFileInput({onClick}) {
  // State to store uploaded file
  const [file, setFile] = useState("");

  // Handles file upload event and updates state
  function handleUpload(event) {
    setFile(event.target.files[0]);
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
  );
}
