const path = require('path')
const express = require('express')
const {postNewNote, deleteAllNotes, getNotes, deleteNoteById, editNoteById,} = require('./notes')
const {initDatabase} = require('./db.js')
const {createUser, authUser} = require('./users.js')
const ServiceError = require('./ServiceError')
const {checkSession} = require('./middlewares')

const app = express()

const pathToStaticFiles = path.resolve('client', 'public')

app
    .use(express.static(pathToStaticFiles, { extensions: ['html'] }))
    .use(express.json())
    .post('/notes', checkSession, (req, res) => {
        const payload = {
            ...res.locals, 
            ...req.body 
        }
        responseToClient(res, postNewNote(payload))
    })
    .get('/notes', checkSession, (req, res) => {
        const payload = {
            ...res.locals,
            ...req.query
        }
        responseToClient(res, getNotes(payload))
    })
    .delete('/notes', checkSession, (req, res) => {
        const payload = {
           ...res.locals,
           ...req.query
        }
        responseToClient(res, deleteNoteById(payload))
    })
    .put('/notes', checkSession, (req, res) => {
        const payload = { 
            ...res.locals,
            ...req.body,
        }
        responseToClient(res, editNoteById(payload))
    })
    .delete('/notes/delete-all', checkSession, (req,res) => {
        const payload = {
            ...res.locals
        }
        responseToClient(res, deleteAllNotes(payload))
    })
    .post('/registration', (req,res) => {
        const newUser = {...req.body}
        responseToClient(res, createUser(newUser))
    })
    .post('/authorization', (req,res) => {
        const user = {...req.body}
        responseToClient(res, authUser(user))
    })

initDatabase()
    .then(() => app.listen(3000, () => console.log('App listen on port 3000')))
    .catch(console.log)


function responseToClient(res, promise) {
    promise
        .then(result => {
            console.log(result)
            const data = result?.data? result : {data: result}
            res.send({ok: true, ...data})
        })
        .catch(error => {
            console.warn(error)
            if (error instanceof ServiceError) {
                res
                    .status(400)
                    .send({
                        ok: false,
                        error: { message: error.message, code: error.code }
                    })
            } else {
                res
                    .status(500)
                    .send({
                        ok: false,
                        error: { message: 'Unknown server error', code: 'UNKNOWN_ERROR' }
                    })
            }

        })
}



// [
//     {
//         method: 'GET',
//         route: '/notes',
//         callback: (req, res) => {
//             const noteBody = {...req.body, id: uuid()}
//             notes.push(noteBody)
//             console.log(notes)
//             res.send('Ok')
//         }
//     },
//     {
//         method: 'GET',
//         route: '/notes',
//         callback: (req,res) => {
//             res.send(notes)
//         }
//     }
// ].find(handler => {
//     if (handler.method === payload.method && handler.route === payload.route)
//     handler.callback(req, res)
// })