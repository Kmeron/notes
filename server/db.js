// const fs = require('fs').promises
// const path = require('path')

// const pathToDb = path.resolve(__dirname, 'db.txt') //C:\Users\Admin\Desktop\notes\server

// function ensureDbFile() {
//     return ensureFile(pathToDb)
// }

// function ensureFile(pathToFile) {
//     return fs.stat(pathToFile)
//         .catch(err => {
//             if (err.code === 'ENOENT') {
//                 console.log(`Create file ${path.basename(pathToFile)}`);
//                 return fs.writeFile(pathToFile, '[]')
//             }
//         })
// }
// function getNotes() {
//     return fs.readFile(pathToDb) 
//             .then(buffer => {
//                 const payload = buffer.toString()
//                 const notes = JSON.parse(payload)
//                 return notes
//             })
// }
            

// function getNoteById(id) {
//     return getNotes()
//         .then(notes => notes.find(note => note.id === id))
// }

// function writeNoteInDb(note) {
//     return getNotes()
//         .then(notes => {
//             notes.unshift(note)
//             const NewArrToString = JSON.stringify(notes)
//             return fs.writeFile(pathToDb, NewArrToString)
//         })
// }

// function deleteNoteById(id) {
//     return getNotes()
//         .then(notes => {
//             const noteToDel = notes.findIndex(note => note.id === id)
//             notes.splice(noteToDel, 1)
//             const newArray = JSON.stringify(notes)
//             return fs.writeFile(pathToDb, newArray)
//     })
// }

// function saveEditedNoteById(id, title, text) {
//     return changeNotesFile((notes) => {
//         const noteIndex = notes.findIndex(note => note.id === id)
//         notes[noteIndex] = {
//             title,
//             text,
//             id
//         }
//         return notes 
//     })
// }

// //     return getNotes()
// //         .then(notes => {
// //             const noteIndex = notes.findIndex(note => note.id === id)
// //                 notes[noteIndex] = {
// //                     title,
// //                     text,
// //                     id
// //                 }
// //                 const editedArray = JSON.stringify(notes)
// //                 return fs.writeFile(pathToDb, editedArray)
// //         })
// // }
// function changeNotesFile(callback) {
//     return getNotes()
//         .then(notes => {
//             const changedNotes = callback(notes)
//             const ChangedNotesToString = JSON.stringify(changedNotes)
//             return fs.writeFile(pathToDb, ChangedNotesToString)
//         })
// }



// module.exports = {ensureDbFile, getNoteById, writeNoteInDb, getNotes, deleteNoteById, saveEditedNoteById}

const mysql = require('mysql2')
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "qwerty2021"
}).promise()
function initDatabase () {
      return connection.query('CREATE DATABASE IF NOT EXISTS notesdb')
      .then(()=> connection.changeUser({database:'notesdb'}))
      .then(() => connection.query(`CREATE TABLE IF NOT EXISTS users(
        id INT AUTO_INCREMENT PRIMARY KEY,
        login VARCHAR(30) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL
      )`))
       .then(()=> connection.query(`CREATE TABLE IF NOT EXISTS notes(
          id MEDIUMINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
          title VARCHAR(255),
          text VARCHAR(255),
          userId INT NOT NULL,
          CONSTRAINT notes_users_fk
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )`))
}

module.exports = {initDatabase, connection}



  