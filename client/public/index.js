import { requestToServer } from "./utils.js"

if (!localStorage.getItem('jwt')) {
    alert('Go fucking authorize!')
    location.href = '/authorization'
}

const searchArea = document.getElementById('search')

const titleField = document.getElementById('title')

const textField = document.getElementById('text')

const create = document.getElementById('create')

const notesArea = document.getElementById('notes-area')

const deleteAll = document.getElementById('deleteAll')

const find = document.getElementById('find')

const pageButtonsArea = document.getElementById('page-buttons-area')

let pagination = {step: 10, page: 1}

function getPagination () {
    const {step, page} = pagination
    return {
        limit: step,
        offset: page * step - step
    }
}

getNotes(getPagination())
.then(({meta})=> createPageButtons(meta))

create.onclick = function() {
   
    const payload = {
        title : titleField.value ,
        text : textField.value,
    }
    return requestToServer('/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    .then(() => {
        pagination.page = 1
        const currentPagination = getPagination()
        return getNotes(currentPagination)
    })
    .then(data=> {
        createPageButtons(data.meta)
        return data
    })
    .then(() => {
        titleField.value = ''
        textField.value = ''
    })
    .catch(error => alert(error.message))
}

function getNotes(query = {}) {
    const params = new URLSearchParams(query).toString() 
    document.getElementById('notes-area').innerHTML = ""
    return requestToServer('/notes?' + params, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'},
    })
    .then(({data, meta}) => {
        find.disabled = !data.length
        deleteAll.disabled = meta.totalCount <= 2
        data.forEach(note => {
            const noteContainer = document.createElement('div')

            const deleteNote = document.createElement('button')
            deleteNote.textContent = 'delete'

            const editNote = document.createElement('button')
            editNote.textContent = 'edit'

            const titleArticle = document.createElement('p')
            titleArticle.innerText = 'Title: '
            const textArticle = document.createElement('p')
            textArticle.innerText = 'Text: '

            const newTitleArea = document.createElement('p') 
            newTitleArea.innerText = `${note.title} ` 

            const newTextArea = document.createElement('p')
            newTextArea.innerText = `${note.text} `
            
            noteContainer.appendChild(titleArticle)
            noteContainer.appendChild(newTitleArea)
            noteContainer.appendChild(textArticle)
            noteContainer.appendChild(newTextArea)
            noteContainer.appendChild(deleteNote)
            noteContainer.appendChild(editNote)
            notesArea.appendChild(noteContainer)

            deleteNote.onclick = function() {
                deleteNoteById(note.id)
                    .then(() => getNotes(getPagination()))
                    .then((data) => {
                        const {offset, totalCount} = data.meta
                        if ((offset >= totalCount) && pagination.page !== 1) {
                            pagination.page --
                            return getNotes(getPagination())
                        }
                        return data
                    })
                    .then(data=> {
                        createPageButtons(data.meta)
                        return data
                    }) 
            }

            editNote.onclick = function() {
                const saveNote = document.createElement('button')
                saveNote.textContent = 'save'

                const inputTitle = document.createElement('input')
                inputTitle.value = note.title
                const inputText = document.createElement('input')
                inputText.value = note.text

                noteContainer.replaceChild(inputTitle, newTitleArea)
                noteContainer.replaceChild(inputText, newTextArea)
                noteContainer.removeChild(deleteNote)
                noteContainer.removeChild(editNote)
                noteContainer.appendChild(saveNote)

                saveNote.onclick = function() {
                    const payload = {
                        title: inputTitle.value,
                        text: inputText.value,
                        id: note.id
                    }
                    saveNoteById(payload)
                        .then(() => getNotes(getPagination()))
                        .then(data=> {
                            createPageButtons(data.meta)
                            return data
                        })
                }

            }
        
        })
        return {data, meta}    
    })
    .catch(error => alert(error.message))
}

function deleteNoteById(id) {
    const noteURL = new URLSearchParams({id: id})
    return requestToServer('/notes?' + noteURL.toString(),{
        method: 'DELETE',
    })
    .catch(error => alert(error.message))
}

function saveNoteById(payload) {
    return requestToServer('/notes', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    .catch(error => alert(error.message))
}

deleteAll.onclick = () => {
    const agree = confirm('Really?')
    if (!agree) {
        return
    } 
    return requestToServer('/notes/delete-all', {
        method: 'DELETE',
    })
    .then(() => {
        pagination.page = 1
        return getNotes(getPagination())
    })  
    .then(data=> {
        createPageButtons(data.meta)
        return data
    })
    .catch(error => alert(error.message))
}    

find.onclick = function() {
    const search = searchArea.value
    if (!search) {
        return
    }
    pagination.page = 1
    const searchMeta = getPagination()
    getNotes({search, ...searchMeta})  
    .then(data=> {
        createPageButtons(data.meta)
        return data\
    })
}

function createPageButtons({totalCount, limit, offset}) {
    pageButtonsArea.innerHTML = ''
    const pagesCount = Math.ceil(totalCount / limit) || 1
    for (let i = 1; i <= pagesCount; i++) {

        const buttonDisabled = i === pagination.page

        createPageButton(i, buttonDisabled)
    }
    
    setDisabledPageButton()
}

function createPageButton(pageNumber, isDisabled) {
    const pageButton = document.createElement('button')
    pageButton.disabled = isDisabled
    pageButton.classList.add('page-button')
    pageButton.textContent = pageNumber
    pageButtonsArea.appendChild(pageButton)

    pageButton.onclick = () => {
        pagination.page = pageNumber
        return getNotes(getPagination())
            .then(data=> {
                createPageButtons(data.meta)
                return data
            })
    }
}

function setDisabledPageButton() {
    const pageButtons = [...document.getElementsByClassName('page-button')]
    pageButtons.forEach(button => button.disabled = false)

    pageButtons[pagination.page-1].disabled = true
}

