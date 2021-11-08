import {requestToServer} from './utils.js'
const email = document.getElementById('email')
const password = document.getElementById('password')
const signIn = document.getElementById('sign-in')
const signUp = document.getElementById('sign-up')

signIn.onclick = () => {
    const payload = {
        email: email.value,
        password: password.value
    }
    return requestToServer('/authorization', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    .then(({data}) => {
        localStorage.setItem('jwt', data.jwt)
        alert('Authorization successful!')
        window.location.href = '/'
    })
    .catch(error => alert(error.message))
}

signUp.onclick = () => {
    window.location.href = '/registration'
}