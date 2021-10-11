import {requestToServer} from './utils.js'
const login = document.getElementById('login')
const password = document.getElementById('password')
const signUp = document.getElementById('sign-up')

signUp.onclick = () => {
    const payload = {
        login: login.value,
        password: password.value
    }
    return requestToServer('/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    .then(() => {
        alert('You have been registered!')
        window.location.href = '/authorization'
    })
    .catch(error => alert(error.message))
}