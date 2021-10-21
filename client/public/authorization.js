import {requestToServer} from './utils.js'
const login = document.getElementById('login')
const password = document.getElementById('password')
const signIn = document.getElementById('sign-in')
const signUp = document.getElementById('sign-up')

signIn.onclick = () => {
    const payload = {
        login: login.value,
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